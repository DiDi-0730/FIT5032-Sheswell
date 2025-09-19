import { useAuth } from './useAuth'

export function useRouteGuard() {
  const { isAuth, isAdmin } = useAuth()

  // Route guard for authenticated users only
  const requireAuth = (to, from, next) => {
    if (!isAuth()) {
      next('/login') // Redirect to login if not authenticated
    } else {
      next() // Allow access if authenticated
    }
  }

  // Route guard for admin users only
  const requireAdmin = (to, from, next) => {
    if (!isAuth()) {
      next('/login') // Redirect to login if not authenticated
    } else if (!isAdmin()) {
      next('/unauthorized') // Show unauthorized page if not admin
    } else {
      next() // Allow access if admin
    }
  }

  return {
    requireAuth,
    requireAdmin,
  }
}
