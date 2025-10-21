import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'
import './assets/theme.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)
app.use(router)

app.mount('#app')

import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Collapsible interactive navigation
