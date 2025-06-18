<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-4 right-4 max-w-sm w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg
              v-if="type === 'success'"
              class="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <!-- Error Icon -->
            <svg
              v-else-if="type === 'error'"
              class="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <!-- Info Icon -->
            <svg
              v-else
              class="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Content -->
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-white">
              {{ title }}
            </p>
            <p v-if="message" class="mt-1 text-sm text-gray-300">
              {{ message }}
            </p>
          </div>

          <!-- Close Button -->
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              class="bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <span class="sr-only">Close</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div
        v-if="autoDismiss && duration > 0"
        class="absolute bottom-0 left-0 h-1 bg-gray-600 rounded-b-lg"
      >
        <div
          class="h-full rounded-b-lg transition-all ease-linear"
          :class="{
            'bg-green-500': type === 'success',
            'bg-red-500': type === 'error',
            'bg-blue-500': type === 'info',
          }"
          :style="{ width: progressWidth + '%' }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'

console.log('DEBUG::NotificationToast', 'Component initializing')

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'info'
    validator: (value) => ['success', 'error', 'info'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 5000, // 5 seconds
  },
  autoDismiss: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const progressWidth = ref(100)
let progressInterval = null

const close = () => {
  console.log('DEBUG::NotificationToast', 'Closing toast')
  emit('close')
}

const startProgress = () => {
  if (!props.autoDismiss || props.duration <= 0) return

  progressWidth.value = 100
  const startTime = Date.now()

  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, props.duration - elapsed)
    progressWidth.value = (remaining / props.duration) * 100

    if (remaining <= 0) {
      clearInterval(progressInterval)
      close()
    }
  }, 50)
}

const stopProgress = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

// Watch for show prop changes to start/stop progress
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      console.log('DEBUG::NotificationToast', `Showing ${props.type} toast: ${props.title}`)
      startProgress()
    } else {
      stopProgress()
    }
  },
)

onUnmounted(() => {
  stopProgress()
})
</script>
