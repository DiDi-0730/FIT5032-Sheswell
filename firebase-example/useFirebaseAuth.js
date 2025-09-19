// Firebase 认证 Composable
import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase-config'

// 响应式状态
const user = ref(null)
const loading = ref(true)
const error = ref(null)

// 计算属性
const isAuthenticated = computed(() => !!user.value)
const userDisplayName = computed(() => user.value?.displayName || '')
const userEmail = computed(() => user.value?.email || '')
const isEmailVerified = computed(() => user.value?.emailVerified || false)

// 监听认证状态变化
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
  loading.value = false
  error.value = null
})

export function useFirebaseAuth() {
  // 用户注册
  const register = async (email, password, displayName) => {
    try {
      loading.value = true
      error.value = null

      // 创建用户账户
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // 更新用户显示名称
      await updateProfile(firebaseUser, {
        displayName: displayName,
      })

      // 发送邮箱验证邮件
      await sendEmailVerification(firebaseUser)

      // 在 Firestore 中创建用户文档
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName,
        createdAt: new Date(),
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
          },
        },
      })

      return { success: true, user: firebaseUser }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 用户登录
  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // 更新最后登录时间
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        {
          lastLogin: new Date(),
        },
        { merge: true },
      )

      return { success: true, user: userCredential.user }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 用户登出
  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 重置密码
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 发送邮箱验证
  const verifyEmail = async () => {
    try {
      if (user.value) {
        await sendEmailVerification(user.value)
        return { success: true }
      }
      return { success: false, error: 'No user logged in' }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 更新用户资料
  const updateUserProfile = async (updates) => {
    try {
      if (user.value) {
        await updateProfile(user.value, updates)

        // 同时更新 Firestore 中的用户文档
        await setDoc(doc(db, 'users', user.value.uid), updates, { merge: true })

        return { success: true }
      }
      return { success: false, error: 'No user logged in' }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 获取用户数据
  const getUserData = async () => {
    try {
      if (user.value) {
        const userDoc = await getDoc(doc(db, 'users', user.value.uid))
        return { success: true, data: userDoc.data() }
      }
      return { success: false, error: 'No user logged in' }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isAuthenticated,
    userDisplayName,
    userEmail,
    isEmailVerified,

    // 方法
    register,
    login,
    logout,
    resetPassword,
    verifyEmail,
    updateUserProfile,
    getUserData,
    clearError,
  }
}

// Firebase 错误代码转换为用户友好的错误消息
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please log in again to perform this action.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/credential-already-in-use':
      'This credential is already associated with a different user.',
  }

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.'
}
