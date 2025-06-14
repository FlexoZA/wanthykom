<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl relative">
      <button
        @click="emit('update:modelValue', false)"
        class="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="text-center">
        <h2 class="text-3xl font-bold text-white">Login</h2>
        <p class="mt-2 text-gray-400">Sign in to your account</p>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="isLoading"
              class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :disabled="isLoading"
              class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              :disabled="isLoading"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-300">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-500 hover:text-blue-400">Forgot password?</a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'login'])

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')

const handleSubmit = () => {
  errorMessage.value = ''
  console.log('DEBUG::LoginDialog', 'Form submitted', { email: email.value, password: password.value, rememberMe: rememberMe.value })
  emit('login', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
}

// Expose error message setter to parent
defineExpose({
  setError: (message) => {
    errorMessage.value = message
  }
})
</script> 