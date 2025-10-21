import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import SignupForm from '../components/SignupForm.vue'
import LoginForm from '../components/LoginForm.vue'
import AdminPanel from '../components/AdminPanel.vue'
import CommunityPage from '../components/CommunityPage.vue'
import EmailForm from '../components/EmailForm.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'


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
  { path: '/', redirect: '/login' }, // Default redirect to login
  { path: '/signup', name: 'signup', component: SignupForm },
  { path: '/login', name: 'login', component: LoginForm },

  // Protected routes - require authentication
  { path: '/home', name: 'home', component: HomePage, meta: { requiresAuth: true } },

  {
    path: '/email',
    name: 'email',
    component: EmailForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/record',
    name: 'record',
    component: simplePage('Record'),
    meta: { requiresAuth: true }
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: simplePage('Profile'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    meta: { requiresAuth: true }
  },
        {
          path: '/combined-tables',
          name: 'combined-tables',
          component: () => import('../views/CombinedTablesView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/health-chart',
          name: 'health-chart',
          component: () => import('../views/FemaleHealthChart.vue'),
          meta: { requiresAuth: true }
        },

  // System routes
{ path: '/:pathMatch(.*)*', redirect: '/login' }, // Catch-all route
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'is-exact',
})

// Route guard: check Firebase authentication status
let authReady = false

// Wait for Firebase auth to initialize
onAuthStateChanged(auth, () => {
  authReady = true
})

router.beforeEach((to, from, next) => {
  // Check if authentication is required
  if (to.meta.requiresAuth) {
    if (!authReady) {
      // Wait for auth to initialize
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        if (user) {
          next()
        } else {
          next('/login')
        }
      })
    } else {
      // Check Firebase authentication status
      const user = auth.currentUser

      if (!user) {
        // Not logged in, redirect to login page
        next('/login')
      } else {
        // Logged in, allow access
        next()
      }
    }
  } else {
    // Pages that don't require authentication, allow direct access
    next()
  }
})

export default router
