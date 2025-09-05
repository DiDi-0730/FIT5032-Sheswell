import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import SignupForm from '../components/SignupForm.vue'
import LoginForm from '../components/LoginForm.vue'

const stub = (name) => ({
  name: `stub-${name}`,
  template: `<div class="container py-5">
               <h2 class="mb-3">${name}</h2>
               <p class="text-muted">Coming soon…</p>
             </div>`,
})

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/learn', name: 'learn', component: stub('Learn') },
  { path: '/record', name: 'record', component: stub('Record') },
  { path: '/reminder', name: 'reminder', component: stub('Reminder') },
  { path: '/my-plan', name: 'my-plan', component: stub('My Plan') },
  { path: '/community', name: 'community', component: stub('Community') },
  { path: '/profile', name: 'profile', component: stub('Profile') },
  { path: '/signup', name: 'signup', component: SignupForm },
  { path: '/login', name: 'login', component: LoginForm },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'is-exact',
})
