<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="handleBackdropClick"
  >
    <div
      class="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 transform transition-all duration-200"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center mb-4">
        <div
          class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3"
        >
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-medium text-white">
            {{ title }}
          </h3>
        </div>
      </div>

      <!-- Message -->
      <div class="mb-6">
        <p class="text-gray-300">
          {{ message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

console.log('DEBUG::ConfirmationDialog', 'Component initializing')

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to perform this action?',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  allowBackdropClose: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const handleConfirm = () => {
  console.log('DEBUG::ConfirmationDialog', 'Confirmed action')
  emit('confirm')
}

const handleCancel = () => {
  console.log('DEBUG::ConfirmationDialog', 'Cancelled action')
  emit('cancel')
  emit('close')
}

const handleBackdropClick = () => {
  if (props.allowBackdropClose) {
    console.log('DEBUG::ConfirmationDialog', 'Closed via backdrop click')
    emit('cancel')
    emit('close')
  }
}
</script>
