<template>
  <div class="container my-4 admin-panel">
    <div class="row">
      <div class="col-12">
        <div class="admin-header mb-5">
          <h1 class="admin-title">
            Admin Dashboard
          </h1>
          <p class="admin-subtitle">Manage users, roles, and system settings</p>
        </div>

        <!-- Stats removed for minimal bootable UI -->

        <!-- User Management removed for minimal bootable UI -->

        <!-- System Information removed for minimal bootable UI -->
      </div>
    </div>
  </div>
</template>

<script setup>
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
