import { ref } from 'vue'
import { validateStorageData, sanitizeInput } from '@/utils/security'

// Mock user database - hardcoded for demo purposes
// In production, this would be replaced with API calls to a backend service
const USERS_DATABASE = [
  {
    id: 1,
    email: 'admin@sheswell.com',
    password: 'Admin123!',
    name: 'Admin',
    role: 'admin',
  },
  {
    id: 2,
    email: 'user@sheswell.com',
    password: 'User123!',
    name: 'User',
    role: 'user',
  },
]

// Global authentication state
const state = ref({
  user: null,
  isAuthenticated: false,
})

export function useAuth() {
  // Initialize authentication state from localStorage with security validation
  const init = () => {
    const saved = localStorage.getItem('currentUser')
    if (saved) {
      // Validate stored data for security
      const user = validateStorageData(saved, ['id', 'email', 'name', 'role'])

      if (user) {
        // Update old user data to match current database
        const currentUserData = USERS_DATABASE.find((u) => u.email === user.email)
        if (currentUserData) {
          const updatedUser = { ...user, ...currentUserData }
          // Update localStorage with current data
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))

          state.value = {
            user: updatedUser,
            isAuthenticated: true,
          }
        }
      } else {
        // Clear invalid data
        localStorage.removeItem('currentUser')
      }
    }
  }

  // Authenticate user with email and password
  const login = (email, password) => {
    // Find user in mock database with matching credentials
    const user = USERS_DATABASE.find((u) => u.email === email && u.password === password)

    if (user) {
      // Set authenticated state
      state.value = {
        user: user,
        isAuthenticated: true,
      }
      // Persist session in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user))
      return { success: true }
    } else {
      // Return error for invalid credentials
      return { success: false, message: 'Invalid email or password' }
    }
  }

  // Register new user account
  const signup = (username, email, password) => {
    // Check if email already exists
    const existingUser = USERS_DATABASE.find((u) => u.email === email)
    if (existingUser) {
      return { success: false, message: 'Email already exists' }
    }

    // Create new user object
    // NOTE: In production, this would be an API call to create user in database
    const newUser = {
      id: Date.now(), // Simple ID generation for demo
      email: email,
      password: password, // WARNING: Never store plaintext passwords in production
      name: username,
      role: 'user', // Default role for new registrations
    }

    // Auto-login after successful registration
    state.value = {
      user: newUser,
      isAuthenticated: true,
    }
    localStorage.setItem('currentUser', JSON.stringify(newUser))

    return { success: true, message: 'Registration successful!' }
  }

  // Clear user session
  const logout = () => {
    state.value = {
      user: null,
      isAuthenticated: false,
    }
    localStorage.removeItem('currentUser')
  }

  // Check if user is currently authenticated
  const isAuth = () => state.value.isAuthenticated

  // Get current user object
  const getCurrentUser = () => state.value.user

  // Check if current user has admin role
  const isAdmin = () => state.value.user?.role === 'admin'

  // Check if current user has regular user role
  const isUser = () => state.value.user?.role === 'user'

  // Get human-readable role name
  const getRoleDisplayName = (role) => {
    return '' // Don't display any role labels
  }

  return {
    state,
    init,
    login,
    signup,
    logout,
    isAuth,
    getCurrentUser,
    isAdmin,
    isUser,
    getRoleDisplayName,
  }
}
