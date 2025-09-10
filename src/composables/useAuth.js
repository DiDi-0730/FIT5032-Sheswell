import { ref } from 'vue'

const AUTH_KEY = 'virtual_auth' // localStorage key

// virtual user
const VIRTUAL_USERS = [{ email: 'user123@gmail.com', password: 'User#12345678!', name: 'User123' }]

const state = ref({
  user: null,
  token: null,
  isAuthenticated: false,
})

export function useAuth() {
  const init = () => {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      state.value = {
        user: parsed.user || null,
        token: parsed.token || null,
        isAuthenticated: !!parsed.token,
      }
    }
  }
  const login = (email, password) => {
    const hit = VIRTUAL_USERS.find((u) => u.email === email && u.password === password)
    if (!hit) {
      return { success: false, message: 'Wrong Email or Password, please try again.' }
    }

    state.value = {
      user: { email: hit.email, name: hit.name },
      token: 'virtual-token',
      isAuthenticated: true,
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(state.value))
    return { success: true }
  }

  const logout = () => {
    state.value = { user: null, token: null, isAuthenticated: false }
    localStorage.removeItem(AUTH_KEY)
  }

  const isAuth = () => state.value.isAuthenticated

  return { state, init, login, logout, isAuth }
}
