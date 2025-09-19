<template>
  <!-- Render content only if user has required permissions -->
  <slot v-if="hasAccess" />

  <!-- Optional fallback content -->
  <slot v-else-if="$slots.fallback" name="fallback" />

  <!-- Default unauthorized message -->
  <div v-else-if="showUnauthorized" class="permission-denied">
    <span class="permission-icon">🔒</span>
    <span class="permission-message">{{ unauthorizedMessage }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  // Role-based access
  role: {
    type: String,
    default: null,
  },

  // Permission-based access
  permission: {
    type: String,
    default: null,
  },

  // Multiple permissions (any)
  anyPermissions: {
    type: Array,
    default: () => [],
  },

  // Multiple permissions (all)
  allPermissions: {
    type: Array,
    default: () => [],
  },

  // Require authentication
  requireAuth: {
    type: Boolean,
    default: false,
  },

  // Show unauthorized message when access denied
  showUnauthorized: {
    type: Boolean,
    default: false,
  },

  // Custom unauthorized message
  unauthorizedMessage: {
    type: String,
    default: 'You do not have permission to view this content',
  },
})

const { state, hasRole, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth()

const hasAccess = computed(() => {
  // If requires authentication and user is not authenticated
  if (props.requireAuth && !state.value.isAuthenticated) {
    return false
  }

  // Check role-based access
  if (props.role && !hasRole(props.role)) {
    return false
  }

  // Check single permission
  if (props.permission && !hasPermission(props.permission)) {
    return false
  }

  // Check any of multiple permissions
  if (props.anyPermissions.length > 0 && !hasAnyPermission(props.anyPermissions)) {
    return false
  }

  // Check all of multiple permissions
  if (props.allPermissions.length > 0 && !hasAllPermissions(props.allPermissions)) {
    return false
  }

  return true
})
</script>

<style scoped>
.permission-denied {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.9rem;
}

.permission-icon {
  font-size: 1.1rem;
}

.permission-message {
  font-weight: 500;
}
</style>

