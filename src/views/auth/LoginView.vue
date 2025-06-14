<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-md p-4">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-white">Login Required</h1>
        <p class="text-gray-400 mt-2">Please log in to access the admin panel</p>
      </div>

      <LoginDialog
        ref="loginDialog"
        v-model="showLogin"
        :is-loading="isLoading"
        @login="handleLogin"
        @update:modelValue="handleDialogClose"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authentication/authenticationStore'
import LoginDialog from '@/components/auth/LoginDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showLogin = ref(false)
const loginDialog = ref(null)
const isLoading = ref(false)

// Check if user is already authenticated
onMounted(() => {
  if (authStore.getCurrentUser()) {
    console.log('DEBUG::LoginView', 'User already authenticated, redirecting')
    // If already logged in, redirect to admin
    router.push('/admin')
  } else {
    showLogin.value = true
  }
})

// Handle dialog close
const handleDialogClose = (value) => {
  if (!value) {
    console.log('DEBUG::LoginView', 'Dialog closed')
    if (authStore.getCurrentUser()) {
      // If logged in after dialog closes, redirect to admin
      console.log('DEBUG::LoginView', 'User authenticated, redirecting to admin')
      router.push('/admin')
    } else {
      // If cancelled, go back to previous page
      console.log('DEBUG::LoginView', 'Login cancelled, going back')
      router.back()
    }
  }
}

const handleLogin = async (credentials) => {
  try {
    isLoading.value = true
    console.log('DEBUG::LoginView', 'Login attempt with:', credentials)
    const { data, error } = await authStore.signIn(credentials.email, credentials.password)
    
    if (error) {
      console.error('DEBUG::LoginView', 'Login failed:', error.message)
      // Show error message in the dialog
      loginDialog.value?.setError(error.message)
      return
    }

    console.log('DEBUG::LoginView', 'Login successful, redirecting to admin')
    router.push('/admin')
  } catch (error) {
    console.error('DEBUG::LoginView', 'Login error:', error)
    loginDialog.value?.setError(error.message || 'An error occurred during login')
  } finally {
    isLoading.value = false
  }
}
</script> 