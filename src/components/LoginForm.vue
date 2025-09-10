<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, init } = useAuth()
onMounted(() => {
  init()
})

/* Form data */
const formData = ref({
  email: '',
  password: '',
})

/* Error states */
const errors = ref({
  email: null,
  password: null,
})

/* Email validation */
const validateEmail = (blur) => {
  const email = formData.value.email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = null
  }
}

/* Password validation - consistent with Signup page */
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

/* Form submission */
const submitForm = () => {
  // Validate all fields
  validateEmail(true)
  validatePassword(true)

  // Check if form is valid
  const isValid =
    !errors.value.email && !errors.value.password && formData.value.email && formData.value.password

  if (isValid) {
    // Mock login success
    localStorage.setItem('authToken', 'mock-jwt-token')
    localStorage.setItem('userId', 'user-123')

    router.push('/')
    const res = login(formData.value.email, formData.value.password)
    if (res.success) {
      const redirect = router.currentRoute.value.query?.redirect || '/'
      router.replace(redirect)
    } else {
      errors.value.password = res.message || 'Login failed'
    }
  }
}

/* Clear form and errors */
const clearForm = () => {
  formData.value = {
    email: '',
    password: '',
  }
  errors.value = {
    email: null,
    password: null,
  }
}
</script>

<template>
  <div class="container my-4 login-page">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="login-card card-soft p-5">
          <!-- Header with decorative elements -->
          <div class="text-center mb-5">
            <div class="login-header">
              <div class="macaron-dots">
                <div class="dot dot-peach"></div>
                <div class="dot dot-lavender"></div>
                <div class="dot dot-pink"></div>
                <div class="dot dot-blue"></div>
              </div>
              <h1 class="login-title">Welcome Back</h1>
              <p class="login-subtitle">Sign in to your Sheswell account</p>
            </div>
          </div>

          <form @submit.prevent="submitForm" novalidate>
            <!-- Email input -->
            <div class="mb-4">
              <label for="email" class="form-label fw-semibold">
                <span class="label-icon">📧</span> Email Address
              </label>
              <input
                type="email"
                class="form-control form-control-soft"
                id="email"
                v-model="formData.email"
                placeholder="Enter your email"
                @blur="() => validateEmail(true)"
                @input="() => validateEmail(false)"
              />
              <div v-if="errors.email" class="text-danger mt-2">{{ errors.email }}</div>
            </div>

            <!-- Password input -->
            <div class="mb-5">
              <label for="password" class="form-label fw-semibold">
                <span class="label-icon">🔒</span> Password
              </label>
              <input
                type="password"
                class="form-control form-control-soft"
                id="password"
                v-model="formData.password"
                placeholder="Enter your password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
              />
              <div v-if="errors.password" class="text-danger mt-2">{{ errors.password }}</div>
            </div>

            <!-- Action buttons -->
            <div class="d-flex gap-3 justify-content-center mb-4">
              <button type="submit" class="btn btn-cta px-4 py-2">
                <span class="btn-icon">🚀</span> Sign In
              </button>
              <button type="button" class="btn btn-ghost px-4 py-2" @click="clearForm">
                <span class="btn-icon">🔄</span> Clear
              </button>
            </div>

            <div class="text-center">
              <p class="mb-3">
                <a href="#" class="text-decoration-none link-soft">Forgot your password?</a>
              </p>
              <p class="mb-0">
                Don't have an account?
                <router-link to="/signup" class="text-decoration-none link-cta fw-semibold">
                  Sign up here
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial;
}

.login-card {
  background: #fff;
  border: 0;
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--c-peach),
    var(--c-lavender),
    var(--c-pink),
    var(--c-babyblue)
  );
}

/* Header styling */
.login-header {
  position: relative;
}

.macaron-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: var(--shadow-soft);
}

.dot-peach {
  background: var(--c-peach);
}
.dot-lavender {
  background: var(--c-lavender);
}
.dot-pink {
  background: var(--c-pink);
}
.dot-blue {
  background: var(--c-babyblue);
}

.login-title {
  color: #2f3b52;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

/* Form controls */
.form-control-soft {
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-control-soft:focus {
  outline: none;
  border-color: var(--c-lavender);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.05),
    0 0 0 3px rgba(196, 181, 253, 0.1);
  background: #fff;
}

.form-control-soft::placeholder {
  color: #9ca3af;
}

.form-label {
  color: #374151;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.label-icon {
  font-size: 1.1rem;
}

/* Buttons */
.btn-cta {
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 0.875rem 2rem;
  box-shadow: var(--shadow-soft);
  text-decoration: none;
  display: inline-block;
  font-weight: 600;
  font-size: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  color: #fff;
  text-decoration: none;
}

.btn-ghost {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.875rem 2rem;
  box-shadow: var(--shadow-soft);
  color: #6b7280;
  text-decoration: none;
  display: inline-block;
  font-weight: 600;
  font-size: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.btn-ghost:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  color: #374151;
  text-decoration: none;
  border-color: var(--c-lavender);
}

.btn-icon {
  margin-right: 0.5rem;
}

/* Link styles */
.link-soft {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.link-soft:hover {
  color: var(--c-peach);
  text-decoration: underline;
}

.link-cta {
  color: var(--c-pink);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link-cta:hover {
  color: var(--c-peach);
  text-decoration: underline;
}

/* Error styles */
.text-danger {
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-card {
    padding: 2rem !important;
  }

  .login-title {
    font-size: 2rem;
  }

  .btn-cta,
  .btn-ghost {
    padding: 0.75rem 1.5rem;
  }
}
</style>
