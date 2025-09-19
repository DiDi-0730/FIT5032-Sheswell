<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signup, init } = useAuth()

onMounted(() => {
  init()
})

/** Form data */
const formData = ref({
  username: '',
  email: '',
  password: '',
  doubleCheckPassword: '',
})

/** Error states */
const errors = ref({
  username: null,
  email: null,
  password: null,
  doubleCheckPassword: null,
})

/** Username validation: at least 4 characters */
const validateName = (blur) => {
  if (formData.value.username.length < 4) {
    if (blur) errors.value.username = 'Username must be at least 4 characters'
  } else {
    errors.value.username = null
  }
}

/** Email validation */
const validateEmail = (blur) => {
  const email = formData.value.email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = null
  }
}

/** Password strength validation */
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

/** Double check password */
const validateDoubleCheckPassword = (blur) => {
  if (formData.value.doubleCheckPassword !== formData.value.password) {
    if (blur)
      errors.value.doubleCheckPassword = 'Passwords do not match, please enter the password again.'
  } else {
    errors.value.doubleCheckPassword = null
  }
}

/** Submit form */
const submitForm = () => {
  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateDoubleCheckPassword(true)

  if (
    !errors.value.username &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.doubleCheckPassword
  ) {
    const result = signup(formData.value.username, formData.value.email, formData.value.password)

    if (result.success) {
      alert(result.message || 'Sign Up successful! Welcome to Sheswell!')
      // Redirect to homepage after successful signup
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      // Show error message
      if (result.message.includes('Email')) {
        errors.value.email = result.message
      } else if (result.message.includes('Username')) {
        errors.value.username = result.message
      } else {
        alert(result.message)
      }
    }
  }
}

/** Clear form and errors */
const clearForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: '',
    doubleCheckPassword: '',
  }
  errors.value = {
    username: null,
    email: null,
    password: null,
    doubleCheckPassword: null,
  }
}
</script>

<template>
  <div class="container my-4 signup-page">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="signup-card card-soft p-5">
          <!-- Header with decorative elements -->
          <div class="text-center mb-5">
            <div class="signup-header">
              <div class="macaron-dots">
                <div class="dot dot-peach"></div>
                <div class="dot dot-lavender"></div>
                <div class="dot dot-pink"></div>
                <div class="dot dot-blue"></div>
              </div>
              <h1 class="signup-title">Create Your Account</h1>
              <p class="signup-subtitle">
                Join Sheswell and start your personalized health journey
              </p>
            </div>
          </div>

          <form @submit.prevent="submitForm" novalidate>
            <!-- Username -->
            <div class="mb-4">
              <label for="username" class="form-label fw-semibold">
                <span class="label-icon">👤</span> Username
              </label>
              <input
                type="text"
                class="form-control form-control-soft"
                id="username"
                v-model="formData.username"
                placeholder="Enter your username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
              />
              <div v-if="errors.username" class="text-danger mt-2">{{ errors.username }}</div>
            </div>

            <!-- Email -->
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

            <!-- Password -->
            <div class="mb-4">
              <label for="password" class="form-label fw-semibold">
                <span class="label-icon">🔒</span> Password
              </label>
              <input
                type="password"
                class="form-control form-control-soft"
                id="password"
                v-model="formData.password"
                placeholder="Create a strong password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
              />
              <div v-if="errors.password" class="text-danger mt-2">{{ errors.password }}</div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-5">
              <label for="doubleCheckPassword" class="form-label fw-semibold">
                <span class="label-icon">✅</span> Confirm Password
              </label>
              <input
                type="password"
                class="form-control form-control-soft"
                id="doubleCheckPassword"
                v-model="formData.doubleCheckPassword"
                placeholder="Confirm your password"
                @blur="() => validateDoubleCheckPassword(true)"
                @input="() => validateDoubleCheckPassword(false)"
              />
              <div v-if="errors.doubleCheckPassword" class="text-danger mt-2">
                {{ errors.doubleCheckPassword }}
              </div>
            </div>

            <!-- Action buttons -->
            <div class="d-flex gap-3 justify-content-center mb-4">
              <button type="submit" class="btn btn-cta px-4 py-2">
                <span class="btn-icon">✨</span> Create Account
              </button>
              <button type="button" class="btn btn-ghost px-4 py-2" @click="clearForm">
                <span class="btn-icon">🔄</span> Clear
              </button>
            </div>

            <!-- Login link -->
            <div class="text-center">
              <p class="login-prompt">
                Already have an account?
                <RouterLink to="/login" class="login-link">Sign in here</RouterLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial;
}

.signup-card {
  background: #fff;
  border: 0;
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}

.signup-card::before {
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
.signup-header {
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

.signup-title {
  color: #2f3b52;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.signup-subtitle {
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
  background: #fff;
  box-shadow:
    0 0 0 4px rgba(205, 182, 246, 0.15),
    inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.form-label {
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.label-icon {
  margin-right: 0.5rem;
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

/* Login prompt */
.login-prompt {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

.login-link {
  color: var(--c-pink);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: var(--c-peach);
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .signup-card {
    padding: 2rem !important;
  }

  .signup-title {
    font-size: 2rem;
  }

  .btn-cta,
  .btn-ghost {
    padding: 0.75rem 1.5rem;
  }
}
</style>
