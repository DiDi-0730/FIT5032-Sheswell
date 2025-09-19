import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import SignupForm from '../components/SignupForm.vue'
import LoginForm from '../components/LoginForm.vue'
import AdminPanel from '../components/AdminPanel.vue'
import UnauthorizedPage from '../components/UnauthorizedPage.vue'
import CommunityPage from '../components/CommunityPage.vue'
import { useRouteGuard } from '../composables/useRouteGuard'

// Legacy stub component factory - kept for backwards compatibility
const stub = (name) => ({
  name: `stub-${name}`,
  template: `<div class="container py-5">
               <h2 class="mb-3">${name}</h2>
               <p class="text-muted">Coming soon...</p>
             </div>`,
})

// Simple page component factory for demo pages
const simplePage = (name) => ({
  name: `page-${name}`,
  template: `<div class="container py-5">
               <h2 class="mb-3">${name}</h2>
               <p class="text-muted">Welcome to the ${name} page!</p>
             </div>`,
})

const routes = [
  // Public routes - accessible without authentication
  { path: '/', name: 'home', component: HomePage },
  { path: '/signup', name: 'signup', component: SignupForm },
  { path: '/login', name: 'login', component: LoginForm },

  // Protected routes - require authentication
  {
    path: '/learn',
    name: 'learn',
    component: simplePage('Learn'),
    beforeEnter: useRouteGuard().requireAuth,
  },
  {
    path: '/record',
    name: 'record',
    component: simplePage('Record'),
    beforeEnter: useRouteGuard().requireAuth,
  },
  {
    path: '/reminder',
    name: 'reminder',
    component: simplePage('Reminder'),
    beforeEnter: useRouteGuard().requireAuth,
  },
  {
    path: '/my-plan',
    name: 'my-plan',
    component: simplePage('My Plan'),
    beforeEnter: useRouteGuard().requireAuth,
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityPage,
    beforeEnter: useRouteGuard().requireAuth,
  },
  {
    path: '/profile',
    name: 'profile',
    component: simplePage('Profile'),
    beforeEnter: useRouteGuard().requireAuth,
  },

  // Admin-only routes - require admin role
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    beforeEnter: useRouteGuard().requireAdmin,
  },

  // System routes
  { path: '/unauthorized', name: 'unauthorized', component: UnauthorizedPage },
  { path: '/:pathMatch(.*)*', redirect: '/' }, // Catch-all route
]

export default createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'is-exact',
})
