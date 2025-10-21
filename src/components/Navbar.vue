<template>
  <nav class="nav-soft navbar navbar-expand-custom navbar-light px-3 my-3">
    <div class="container-fluid align-items-center d-flex">
      <!-- Left: Brand -->
      <RouterLink class="navbar-brand d-flex align-items-center gap-2 fw-semibold" to="/home">
        <span class="brand-dot"></span> Sheswell
      </RouterLink>

      <!-- Center: Menu (same line as brand) -->
      <ul class="navbar-nav nav-center d-none d-custom-flex gap-3">
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/home">Home</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/learn">Learn</RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/community">Community</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/combined-tables">Data Insight</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/health-chart">Health Chart</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/email">Email</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/profile">Profile</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link-soft nav-link" to="/admin">Admin</RouterLink>
        </li>
      </ul>

      <!-- Right: Button group -->
      <div class="d-flex align-items-center gap-2 ms-auto">
        <!-- Desktop buttons -->
        <div class="d-none d-custom-flex gap-2">
          <template v-if="!isLoggedIn">
            <RouterLink class="btn btn-ghost" to="/signup">Sign up</RouterLink>
            <RouterLink class="btn btn-cta" to="/login">Log in</RouterLink>
          </template>
          <template v-else>
            <span class="user-welcome">
              <span class="user-name">{{ userEmail }}</span>
            </span>
            <button class="btn btn-ghost" @click="handleLogout">Logout</button>
          </template>
        </div>

        <!-- Hamburger menu button -->
        <button
          class="navbar-toggler d-custom-none"
          type="button"
          aria-controls="mainNav"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Collapsed menu content -->
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/home">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/learn">Learn</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/record">Record</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/reminder">Reminder</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/my-plan">My Plan</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/community">Community</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/combined-tables">Data Tables</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/email">Email</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/profile">Profile</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link-soft nav-link" to="/admin">Admin</RouterLink>
          </li>

          <template v-if="!isLoggedIn">
            <li class="nav-item d-custom-none">
              <RouterLink class="btn btn-ghost w-100" to="/signup">Sign up</RouterLink>
            </li>
            <li class="nav-item d-custom-none">
              <RouterLink class="btn btn-cta w-100" to="/login">Log in</RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item d-custom-none">
              <div class="user-welcome-mobile">
                <div class="mobile-user-name">{{ userEmail }}</div>
              </div>
            </li>
            <li class="nav-item d-custom-none">
              <button class="btn btn-ghost w-100" @click="handleLogout">Logout</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()
const isLoggedIn = ref(false)
const userEmail = ref('')

// Check Firebase authentication status
const checkAuthStatus = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      isLoggedIn.value = true
      userEmail.value = user.email
    } else {
      // User is signed out
      isLoggedIn.value = false
      userEmail.value = ''
    }
  })
}

// Logout functionality
const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error.message)
  }
}

// Check authentication status when component mounts
onMounted(() => {
  checkAuthStatus()
})
</script>

<style scoped>
.nav-soft {
  background: #fff;
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
}
.brand-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--c-pink),
    var(--c-lavender) 60%,
    var(--c-peach)
  );
  box-shadow: var(--shadow-soft);
}

.nav-center {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: center;
  flex: 1;
}
/* Custom breakpoint: 1100px and above */
@media (min-width: 1100px) {
  .d-custom-flex {
    display: flex !important;
  }

  .d-custom-none {
    display: none !important;
  }
}

/* Small screens show hamburger menu */
@media (max-width: 1099px) {
  .d-custom-flex {
    display: none !important;
  }

  .d-custom-none {
    display: block !important;
  }
}

/* Custom navbar expand breakpoint control */
@media (min-width: 1100px) {
  .navbar-expand-custom .navbar-collapse {
    display: none !important;
  }

  .navbar-expand-custom .navbar-toggler {
    display: none !important;
  }
}

/* Navigation link styles & active state scale and bold effects */
.nav-link-soft {
  color: #2f3b52 !important;
  opacity: 0.9;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    font-weight 0.18s ease,
    color 0.18s ease;
}
.nav-link-soft:hover {
  transform: scale(1.05);
}
.nav-link-soft.is-exact {
  font-weight: 700;
  transform: scale(1.08);
  color: #111827 !important;
}

/* Button styles */
.btn-cta {
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  box-shadow: var(--shadow-soft);
}
.btn-ghost {
  background: #fff;
  border: 0;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  box-shadow: var(--shadow-soft);
}

/* Role-specific navigation styles */
.admin-link {
  background: linear-gradient(135deg, #f59e0b, #f97316) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  font-weight: 600 !important;
}

.role-icon {
  margin-right: 0.25rem;
}

/* User welcome styles */
.user-welcome {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

.user-name {
  color: #2f3b52;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: nowrap;
}

.user-role {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  margin-top: 0.1rem;
}

.role-admin {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
}

.user-welcome-mobile {
  padding: 0.75rem 1rem;
  display: block;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-user-name {
  color: #2f3b52;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.mobile-user-role {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  display: inline-block;
}
</style>
