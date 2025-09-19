const express = require('express')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const User = require('../models/User')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// 输入验证模式
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20).required().messages({
    'string.alphanum': 'Username must contain only alphanumeric characters',
    'string.min': 'Username must be at least 4 characters long',
    'string.max': 'Username cannot exceed 20 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
})

// 生成 JWT Token
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' })

  const refreshToken = jwt.sign({ userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}

// 用户注册
router.post('/register', async (req, res) => {
  try {
    // 输入验证
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => detail.message),
      })
    }

    const { username, email, password } = value

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username'
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`,
      })
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
    })

    await user.save()

    // 生成 tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    // 更新最后登录时间
    await user.updateLastLogin()

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// 用户登录
router.post('/login', async (req, res) => {
  try {
    // 输入验证
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => detail.message),
      })
    }

    const { email, password } = value

    // 查找用户
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // 检查账户是否被锁定
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts',
      })
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      // 增加登录尝试次数
      await user.incLoginAttempts()
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // 重置登录尝试次数
    await user.resetLoginAttempts()

    // 更新最后登录时间
    await user.updateLastLogin()

    // 生成 tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// 刷新 Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      })
    }

    // 验证 refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      })
    }

    // 查找用户
    const user = await User.findById(decoded.userId)
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
      })
    }

    // 生成新的 access token
    const { accessToken } = generateTokens(user._id)

    res.json({
      success: true,
      data: {
        accessToken,
      },
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      })
    }

    console.error('Token refresh error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// 获取当前用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          fullName: req.user.fullName,
          profile: req.user.profile,
          preferences: req.user.preferences,
          lastLogin: req.user.lastLogin,
          createdAt: req.user.createdAt,
        },
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// 更新用户信息
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const updateSchema = Joi.object({
      profile: Joi.object({
        firstName: Joi.string().max(50),
        lastName: Joi.string().max(50),
        bio: Joi.string().max(500),
      }),
      preferences: Joi.object({
        theme: Joi.string().valid('light', 'dark'),
        notifications: Joi.object({
          email: Joi.boolean(),
          push: Joi.boolean(),
        }),
      }),
    })

    const { error, value } = updateSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => detail.message),
      })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: value },
      { new: true, runValidators: true },
    ).select('-password')

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// 用户登出
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // 在实际应用中，你可能需要将 token 加入黑名单
    // 这里我们只是返回成功响应
    res.json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// 删除账户
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)

    res.json({
      success: true,
      message: 'Account deleted successfully',
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

module.exports = router
