/**
 * Security utilities for XSS protection and data validation
 */

// XSS Protection - HTML entity encoding
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return ''

  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }

  return str.replace(/[&<>"'`=/]/g, (s) => entityMap[s])
}

// Input validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  // Allow alphanumeric, spaces, and common punctuation for names
  name: /^[a-zA-Z0-9\s\-_.,']{1,50}$/,
}

// Validate input against XSS patterns
export function validateInput(input, type = 'text') {
  if (typeof input !== 'string') return false

  // Check for common XSS patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]*>/g, // Basic HTML tag detection
  ]

  // Check for XSS attempts
  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      console.warn('Potential XSS attempt detected:', input)
      return false
    }
  }

  // Validate against specific patterns
  if (type in ValidationPatterns) {
    return ValidationPatterns[type].test(input)
  }

  return true
}

// Sanitize user input for safe storage/display
export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''

  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000) // Limit length
}

// Generate secure random tokens (for CSRF protection if needed)
export function generateSecureToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

// Content Security Policy helpers
export function getCSPDirectives() {
  return {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline'", // Note: In production, avoid 'unsafe-inline'
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: https:",
    'font-src': "'self'",
    'connect-src': "'self'",
    'frame-ancestors': "'none'",
  }
}

// Validate localStorage data before use
export function validateStorageData(data, expectedKeys = []) {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data

    if (typeof parsed !== 'object' || parsed === null) {
      return null
    }

    // Check for required keys if specified
    if (expectedKeys.length > 0) {
      const hasRequiredKeys = expectedKeys.every((key) => key in parsed)
      if (!hasRequiredKeys) {
        return null
      }
    }

    return parsed
  } catch (error) {
    console.warn('Invalid storage data detected:', error)
    return null
  }
}




