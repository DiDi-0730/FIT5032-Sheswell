const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

// 导入路由
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

// 安全中间件
app.use(helmet())

// CORS 配置
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
)

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制每个 IP 15 分钟内最多 100 个请求
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 5, // 限制每个 IP 15 分钟内最多 5 次认证请求
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
})

app.use(limiter)

// 解析 JSON 请求体
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API 路由
app.use('/api/auth', authLimiter, authRoutes)

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// 全局错误处理中间件
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)

  // Mongoose 验证错误
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err) => err.message)
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    })
  }

  // Mongoose 重复键错误
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  // JWT 错误
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    })
  }

  // 默认服务器错误
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// 数据库连接
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/sheswell',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

// 优雅关闭
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server gracefully...')

  server.close(() => {
    console.log('HTTP server closed')

    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed')
      process.exit(0)
    })
  })
}

// 启动服务器
const startServer = async () => {
  try {
    await connectDB()

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    // 优雅关闭处理
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

module.exports = app
