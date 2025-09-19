<template>
  <div class="container my-5 unauthorized-page">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="unauthorized-card">
          <div class="unauthorized-header text-center mb-4">
            <div class="unauthorized-icon">🚫</div>
            <h1 class="unauthorized-title">Access Denied</h1>
            <p class="unauthorized-subtitle">You don't have permission to access this page</p>
          </div>

          <div class="unauthorized-content">
            <div class="permission-info mb-4">
              <h3>Permission Details:</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Your Role:</span>
                  <span class="info-value role-badge">
                    {{ getRoleDisplayName(currentUser?.role) }}
                  </span>
                </div>
                <div class="info-item" v-if="requiredRole">
                  <span class="info-label">Required Role:</span>
                  <span class="info-value role-badge required">
                    {{ getRoleDisplayName(requiredRole) }}
                  </span>
                </div>
                <div class="info-item" v-if="requiredPermission">
                  <span class="info-label">Required Permission:</span>
                  <span class="info-value permission-badge">
                    {{ requiredPermission }}
                  </span>
                </div>
              </div>
            </div>

            <div class="suggestions mb-4">
              <h4>What you can do:</h4>
              <ul class="suggestion-list">
                <li v-if="!isAuthenticated">
                  <router-link to="/login" class="suggestion-link">
                    🔑 Sign in to your account
                  </router-link>
                </li>
                <li v-else-if="isUser()">
                  <span class="suggestion-text">
                    📞 Contact an administrator to request elevated permissions
                  </span>
                </li>
                <li>
                  <router-link to="/" class="suggestion-link"> 🏠 Return to homepage </router-link>
                </li>
                <li>
                  <button @click="goBack" class="suggestion-link btn-link">
                    ⬅️ Go back to previous page
                  </button>
                </li>
              </ul>
            </div>

            <!-- Show available pages based on user role -->
            <div class="available-pages" v-if="isAuthenticated">
              <h4>Pages you can access:</h4>
              <div class="page-links">
                <router-link to="/" class="page-link"> 🏠 Home </router-link>
                <router-link to="/profile" class="page-link"> 👤 Profile </router-link>
                <router-link
                  to="/community"
                  class="page-link"
                  v-if="hasPermission('community.participate')"
                >
                  👥 Community
                </router-link>
                <router-link to="/admin" class="page-link" v-if="isAdmin()">
                  ⚡ Admin Panel
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()

const { state, getCurrentUser, getRoleDisplayName, hasPermission, isAdmin, isUser } = useAuth()

const currentUser = computed(() => getCurrentUser())
const isAuthenticated = computed(() => state.value.isAuthenticated)
const requiredRole = computed(() => route.query.required)
const requiredPermission = computed(() => route.query.required)

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

onMounted(() => {
  // If user is not authenticated, redirect to login after a delay
  if (!isAuthenticated.value) {
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }
})
</script>

<style scoped>
.unauthorized-page {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.unauthorized-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.unauthorized-header {
  margin-bottom: 2rem;
}

.unauthorized-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.unauthorized-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 1rem;
}

.unauthorized-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
}

.permission-info {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
}

.permission-info h3 {
  color: #991b1b;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: #374151;
}

.info-value {
  font-weight: 600;
}

.role-badge {
  background: linear-gradient(135deg, var(--c-lavender), var(--c-babyblue));
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.role-badge.required {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

.permission-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-family: monospace;
}

.suggestions {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 1.5rem;
}

.suggestions h4 {
  color: #0c4a6e;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-list li {
  margin-bottom: 0.75rem;
}

.suggestion-link {
  color: #0369a1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.suggestion-link:hover {
  color: #0284c7;
  text-decoration: underline;
}

.btn-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.suggestion-text {
  color: #374151;
  font-weight: 500;
}

.available-pages {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 1.5rem;
}

.available-pages h4 {
  color: #14532d;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.page-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.page-link {
  background: white;
  color: #059669;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #d1fae5;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.page-link:hover {
  background: #d1fae5;
  color: #047857;
  text-decoration: none;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .unauthorized-card {
    padding: 2rem;
    margin: 1rem;
  }

  .unauthorized-title {
    font-size: 2rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .page-links {
    flex-direction: column;
  }
}
</style>
