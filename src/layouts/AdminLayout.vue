<template>
  <div class="min-h-screen bg-gray-900 flex">
    <!-- Vertical Menu -->
    <div class="w-64 bg-gray-800 fixed h-full">
      <div class="p-4">
        <h1 class="text-xl font-bold text-white">Admin Panel</h1>
      </div>
      <nav class="mt-4">
        <ul>
          <li>
            <RouterLink
              to="/admin"
              class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-700 text-white"
            >
              Dashboard
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="absolute bottom-0 w-full p-4">
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="w-full px-4 py-2 text-sm text-white bg-red-400 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg
            v-if="isLoggingOut"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 ml-64 p-8">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authentication/authenticationStore'

const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    console.log('DEBUG::AdminLayout', 'Logging out')
    const { error } = await authStore.signOut()
    
    if (error) {
      console.error('DEBUG::AdminLayout', 'Logout failed:', error.message)
      // TODO: Show error message to user
      return
    }

    console.log('DEBUG::AdminLayout', 'Logout successful, redirecting to home')
    router.push('/')
  } catch (error) {
    console.error('DEBUG::AdminLayout', 'Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script> 