import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Store initialization flag
let isAuthInitialized = false

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/web/HomeView.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('@/views/web/BookView.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/articles',
      name: 'admin-articles',
      component: () => import('@/views/admin/article/ArticlesView.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/books',
      name: 'admin-books',
      component: () => import('@/views/admin/book/BooksView.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/media-manager',
      name: 'admin-media-manager',
      component: () => import('@/views/admin/media/MediaManagerView.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/books/:bookId/chapters',
      name: 'admin-chapters',
      component: () => import('@/views/admin/chapter/ChaptersView.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/books/:bookId/headers',
      name: 'admin-book-headers',
      component: () => import('@/views/admin/book-header/BookHeadersView.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
    },
  ],
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if not already done
  if (!isAuthInitialized) {
    await authStore.initialize()
    isAuthInitialized = true
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const currentUser = authStore.getCurrentUser()

  // If route requires auth and user is not logged in, redirect to login
  if (requiresAuth && !currentUser) {
    console.log('DEBUG::Router', 'Auth required, redirecting to login')
    next({ name: 'login' })
    return
  }

  next()
})

// Layout system
router.beforeEach((to, from, next) => {
  const layout = to.meta.layout || 'default'
  to.meta.layoutComponent = layout === 'default' ? DefaultLayout : AdminLayout
  next()
})

export default router
