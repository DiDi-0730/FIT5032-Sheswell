const jwt = require('jsonwebtoken')
const User = require('../models/User')

// JWT Token 验证中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      })
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 查找用户
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      })
    }

    // 检查用户是否被锁定
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts',
      })
    }

    // 检查用户是否激活
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      })
    }

    req.user = user
    next()
  } catch (error) {
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

    console.error('Auth middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

// 可选认证中间件（不强制要求登录）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('-password')

      if (user && user.isActive && !user.isLocked()) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // 可选认证失败时不返回错误，继续执行
    next()
  }
}

// 角色验证中间件
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      })
    }

    next()
  }
}

// 资源所有权验证中间件
const requireOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    // 管理员可以访问所有资源
    if (req.user.role === 'admin') {
      return next()
    }

    // 检查资源所有权
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField]

    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - insufficient permissions',
      })
    }

    next()
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  requireOwnership,
}
