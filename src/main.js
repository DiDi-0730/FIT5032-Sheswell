import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'
import './assets/theme.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

createApp(App).use(router).mount('#app')

import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Collapsible interactive navigation
