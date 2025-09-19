<template>
  <div class="container my-4 admin-panel">
    <div class="row">
      <div class="col-12">
        <div class="admin-header mb-5">
          <h1 class="admin-title">
            <span class="admin-icon">⚡</span>
            Admin Dashboard
          </h1>
          <p class="admin-subtitle">Manage users, roles, and system settings</p>
        </div>

        <!-- Stats Cards -->
        <div class="row mb-5">
          <div class="col-md-3 mb-3">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>{{ stats.totalUsers }}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stat-card">
              <div class="stat-icon">👑</div>
              <div class="stat-info">
                <h3>{{ stats.adminUsers }}</h3>
                <p>Administrators</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <h3>{{ stats.activeUsers }}</h3>
                <p>Active Users</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Management Table -->
        <div class="admin-section">
          <div class="section-header">
            <h2 class="section-title">User Management</h2>
            <button class="btn btn-cta" @click="refreshUsers">
              <span class="btn-icon">🔄</span> Refresh
            </button>
          </div>

          <div class="table-responsive">
            <table class="table admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in users"
                  :key="user.id"
                  :class="{ 'inactive-user': !user.isActive }"
                >
                  <td>{{ user.id }}</td>
                  <td>
                    <div class="user-info">
                      <span class="user-name">{{ user.name }}</span>
                      <span v-if="user.id === currentUser?.id" class="current-user-badge">You</span>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <select
                      v-if="user.id !== currentUser?.id"
                      :value="user.role"
                      @change="updateRole(user.id, $event.target.value)"
                      class="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <span v-else class="role-badge" :class="`role-${user.role}`">
                      {{ user.role === 'admin' ? 'Admin' : 'User' }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="['status-badge', user.isActive ? 'status-active' : 'status-inactive']"
                    >
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <span v-if="user.lastLogin" class="last-login">
                      {{ formatDate(user.lastLogin) }}
                    </span>
                    <span v-else class="text-muted">Never</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button
                        v-if="user.id !== currentUser?.id"
                        @click="toggleStatus(user.id)"
                        :class="[
                          'btn',
                          'btn-sm',
                          user.isActive ? 'btn-outline-danger' : 'btn-outline-success',
                        ]"
                      >
                        {{ user.isActive ? 'Deactivate' : 'Activate' }}
                      </button>
                      <span v-else class="text-muted">Current User</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- System Information -->
        <div class="admin-section mt-5">
          <div class="section-header">
            <h2 class="section-title">System Information</h2>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="info-card">
                <h4>Authentication System</h4>
                <ul>
                  <li>Type: Role-Based Access Control (RBAC)</li>
                  <li>Storage: Local Storage (Demo)</li>
                  <li>Roles: Admin, Moderator, User</li>
                  <li>
                    Permissions: {{ Object.keys(ROLE_PERMISSIONS.admin).length }} total permissions
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-6">
              <div class="info-card">
                <h4>Current Session</h4>
                <ul>
                  <li>User: {{ currentUser?.name }}</li>
                  <li>Role: {{ currentUser?.role === 'admin' ? 'Admin' : 'User' }}</li>
                  <li>Permissions: {{ currentUser?.permissions?.length || 0 }}</li>
                  <li>Login Time: {{ formatDate(new Date().toISOString()) }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const {
  getCurrentUser,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getRoleDisplayName,
  USER_ROLES,
  ROLE_PERMISSIONS,
} = useAuth()

const users = ref([])
const currentUser = computed(() => getCurrentUser())

// Statistics computed properties
const stats = computed(() => {
  const totalUsers = users.value.length
  const adminUsers = users.value.filter((u) => u.role === USER_ROLES.ADMIN).length
  const activeUsers = users.value.filter((u) => u.isActive).length

  return {
    totalUsers,
    adminUsers,
    activeUsers,
  }
})

// Load users data
const refreshUsers = () => {
  users.value = getAllUsers()
}

// Update user role
const updateRole = (userId, newRole) => {
  const result = updateUserRole(userId, newRole)
  if (result.success) {
    refreshUsers()
    alert(result.message)
  } else {
    alert(result.message)
  }
}

// Toggle user active status
const toggleStatus = (userId) => {
  const result = toggleUserStatus(userId)
  if (result.success) {
    refreshUsers()
    alert(result.message)
  } else {
    alert(result.message)
  }
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

onMounted(() => {
  refreshUsers()
})
</script>

<style scoped>
.admin-panel {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial;
  min-height: 100vh;
}

.admin-header {
  text-align: center;
  padding: 2rem 0;
}

.admin-title {
  font-size: 3rem;
  font-weight: 700;
  color: #2f3b52;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.admin-icon {
  font-size: 3rem;
}

.admin-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
}

/* Stats Cards */
.stat-card {
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.stat-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Admin Sections */
.admin-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-soft);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2f3b52;
  margin: 0;
}

/* Table Styles */
.admin-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.admin-table th {
  background: linear-gradient(135deg, var(--c-lavender), var(--c-babyblue));
  color: white;
  font-weight: 600;
  padding: 1rem;
  border: none;
}

.admin-table td {
  padding: 1rem;
  vertical-align: middle;
  border-color: #f1f5f9;
}

.inactive-user {
  opacity: 0.6;
  background-color: #f9fafb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name {
  font-weight: 500;
}

.current-user-badge {
  background: var(--c-peach);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-select {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.9rem;
  background: white;
}

.role-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.role-admin {
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  color: white;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.last-login {
  font-size: 0.85rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Info Cards */
.info-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid var(--c-lavender);
}

.info-card h4 {
  color: #2f3b52;
  font-weight: 600;
  margin-bottom: 1rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  padding: 0.5rem 0;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.info-card li:last-child {
  border-bottom: none;
}

/* Button Styles */
.btn-cta {
  background: linear-gradient(135deg, var(--c-peach), var(--c-pink));
  color: white;
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  box-shadow: var(--shadow-soft);
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  color: white;
}

.btn-icon {
  margin-right: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-title {
    font-size: 2rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .admin-section {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
