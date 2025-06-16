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
              :class="[
                'mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
                emailError ? 'border-red-500' : 'border-gray-600'
              ]"
              placeholder="Enter your email"
              @blur="validateEmailField"
            />
            <p v-if="emailError" class="mt-1 text-red-500 text-sm">{{ emailError }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
            <div class="relative mt-1">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="isLoading"
                :class="[
                  'block w-full px-3 py-2 pr-10 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
                  passwordError ? 'border-red-500' : 'border-gray-600'
                ]"
                placeholder="Enter your password"
                @blur="validatePasswordField"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                :disabled="isLoading"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none disabled:opacity-50"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05M21.95 15.95l-2.122-2.122M9.878 9.878l-6.364-6.364M21.95 15.95L15.95 21.95" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-red-500 text-sm">{{ passwordError }}</p>
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
            :disabled="isLoading || !isFormValid"
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
import { ref, computed } from 'vue'
import { validateEmail, validatePassword } from '@/utils/validation'

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
const showPassword = ref(false)

// Validation states
const emailError = ref('')
const passwordError = ref('')

// Validation methods
const validateEmailField = () => {
  emailError.value = validateEmail(email.value)
}

const validatePasswordField = () => {
  passwordError.value = validatePassword(password.value)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Form validation
const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         !emailError.value && 
         !passwordError.value
})

const handleSubmit = () => {
  // Validate all fields before submission
  validateEmailField()
  validatePasswordField()
  
  if (!isFormValid.value) {
    console.log('DEBUG::LoginDialog', 'Form validation failed')
    return
  }

  errorMessage.value = ''
  console.log('DEBUG::LoginDialog', 'Form submitted', { 
    email: email.value, 
    password: password.value, 
    rememberMe: rememberMe.value 
  })
  
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