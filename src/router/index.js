import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WebhookTestView from '../views/WebhookTestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/webhook-test',
      name: 'webhook-test',
      component: WebhookTestView,
    },
  ],
})

export default router
