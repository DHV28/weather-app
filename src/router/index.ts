import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Route definitions for the weather app.
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    // Loaded since this is the entry point of the app
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/detail/:city',
    name: 'Detail',
    // Only downloaded when user navigates to this route
    component: () => import('../pages/DetailPage.vue'),
    props: true, // passes :city as a prop to the component
  },
  {
    path: '/profile',
    name: 'Profile',
    // Only downloaded when user navigates to the profile page
    component: () => import('../pages/ProfilePage.vue'),
  },
]

const router = createRouter({
  // createWebHistory uses the HTML5 History API
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
