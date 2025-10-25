<template>
  <div class="container my-4 admin-panel">
    <div class="row">
      <div class="col-12">
        <div class="admin-header mb-5">
          <h1 class="admin-title">
            <i class="bi bi-shield-check admin-icon"></i>
            Admin Dashboard
          </h1>
          <p class="admin-subtitle">Manage users, roles, and system settings</p>
        </div>

        <!-- Admin Navigation Tabs -->
        <div class="admin-nav mb-4">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'overview' }"
                @click="activeTab = 'overview'"
                type="button"
              >
                <i class="bi bi-speedometer2 me-2"></i>
                Overview
              </button>
            </li>
          
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'users' }"
                @click="activeTab = 'users'"
                type="button"
              >
                <i class="bi bi-people me-2"></i>
                User Management
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'system' }"
                @click="activeTab = 'system'"
                type="button"
              >
                <i class="bi bi-gear me-2"></i>
                System Settings
              </button>
            </li>
          </ul>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="tab-pane active">
            <div class="row">
              <div class="col-md-3 mb-4">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="bi bi-people"></i>
                  </div>
                  <div class="stat-info">
                    <h3>1,234</h3>
                    <p>Total Users</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-4">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="bi bi-envelope"></i>
                  </div>
                  <div class="stat-info">
                    <h3>45</h3>
                    <p>Emails Sent Today</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-4">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="bi bi-graph-up"></i>
                  </div>
                  <div class="stat-info">
                    <h3>89%</h3>
                    <p>System Health</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-4">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div class="stat-info">
                    <h3>100%</h3>
                    <p>Security Status</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="admin-section">
                  <div class="section-header">
                    <h4 class="section-title">Quick Actions</h4>
                  </div>
                  <div class="quick-actions">
                    <button class="btn btn-cta me-3 mb-2" @click="activeTab = 'bulk-email'">
                      <i class="bi bi-envelope-paper btn-icon"></i>
                      Send Bulk Email
                    </button>
                    <button class="btn btn-cta me-3 mb-2" @click="activeTab = 'users'">
                      <i class="bi bi-people btn-icon"></i>
                      Manage Users
                    </button>
                    <button class="btn btn-cta mb-2">
                      <i class="bi bi-download btn-icon"></i>
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="admin-section">
                  <div class="section-header">
                    <h4 class="section-title">Recent Activity</h4>
                  </div>
                  <div class="activity-list">
                    <div class="activity-item">
                      <i class="bi bi-envelope text-primary"></i>
                      <span>Bulk email sent to 150 users</span>
                      <small class="text-muted">2 hours ago</small>
                    </div>
                    <div class="activity-item">
                      <i class="bi bi-person-plus text-success"></i>
                      <span>New user registered</span>
                      <small class="text-muted">4 hours ago</small>
                    </div>
                    <div class="activity-item">
                      <i class="bi bi-gear text-warning"></i>
                      <span>System settings updated</span>
                      <small class="text-muted">1 day ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bulk Email Tab -->
          <div v-if="activeTab === 'bulk-email'" class="tab-pane active">
            <BulkEmailForm />
          </div>

          <!-- User Management Tab -->
          <div v-if="activeTab === 'users'" class="tab-pane active">
            <div class="admin-section">
              <div class="section-header">
                <h4 class="section-title">User Management</h4>
                <button class="btn btn-cta">
                  <i class="bi bi-plus btn-icon"></i>
                  Add User
                </button>
              </div>
              <div class="info-card">
                <h4>User Management Features</h4>
                <ul>
                  <li>View all registered users</li>
                  <li>Manage user roles and permissions</li>
                  <li>Activate/deactivate user accounts</li>
                  <li>Export user data</li>
                  <li>Send targeted communications</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- System Settings Tab -->
          <div v-if="activeTab === 'system'" class="tab-pane active">
            <div class="admin-section">
              <div class="section-header">
                <h4 class="section-title">System Settings</h4>
              </div>
              <div class="info-card">
                <h4>System Configuration</h4>
                <ul>
                  <li>Email service configuration</li>
                  <li>Database connection settings</li>
                  <li>Security and authentication settings</li>
                  <li>Backup and maintenance schedules</li>
                  <li>System monitoring and alerts</li>
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
import { ref } from 'vue'

// Reactive data
const activeTab = ref('overview')
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

/* Admin Navigation */
.admin-nav {
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-tabs {
  border: none;
  margin: 0;
}

.nav-tabs .nav-link {
  border: none;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  margin: 0 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-tabs .nav-link:hover {
  background: #f3f4f6;
  color: #374151;
}

.nav-tabs .nav-link.active {
  background: linear-gradient(135deg, var(--c-lavender), var(--c-babyblue));
  color: white;
  box-shadow: 0 2px 4px rgba(212, 165, 199, 0.3);
}

/* Tab Content */
.tab-content {
  margin-top: 0;
}

.tab-pane {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: #f3f4f6;
  border-left-color: var(--c-lavender);
}

.activity-item i {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.activity-item span {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.activity-item small {
  color: #9ca3af;
  font-size: 0.8rem;
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

  .nav-tabs .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .quick-actions {
    flex-direction: column;
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
