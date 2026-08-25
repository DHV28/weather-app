import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Create the Vue app
createApp(App)
  .use(router) // registers <RouterView> and <RouterLink> globally
  .mount('#app')
