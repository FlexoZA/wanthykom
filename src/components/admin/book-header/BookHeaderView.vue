<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">View Book Header</h1>
      <div class="flex gap-2">
        <button
          @click="editBookHeader"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Book Header
        </button>
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Book Headers
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-400 text-center py-8">
      <p>Error loading book header: {{ error }}</p>
      <button
        @click="loadBookHeader"
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Book Header Content -->
    <div v-else-if="bookHeader" class="bg-gray-800 rounded-lg p-6">
      <!-- Status Badge -->
      <div class="mb-6">
        <span
          :class="bookHeader.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
          class="px-3 py-1 text-sm rounded-full"
        >
          {{ bookHeader.enable ? 'Enabled' : 'Disabled' }}
        </span>
      </div>

      <!-- Book Header Image -->
      <div v-if="bookHeader.book_header_image_url" class="mb-6">
        <img
          :src="bookHeader.book_header_image_url"
          :alt="bookHeader.book_header_name"
          class="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <!-- Book Header Title -->
      <h2 class="text-3xl font-bold text-white mb-6">{{ bookHeader.book_header_name }}</h2>

      <!-- Book Header Content -->
      <div class="prose prose-invert max-w-none mb-8">
        <p class="text-gray-300 whitespace-pre-wrap">{{ bookHeader.book_header_text }}</p>
      </div>

      <!-- Book Header Metadata -->
      <div class="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-semibold">Created:</span>
            {{ formatDate(bookHeader.created_at) }}
          </div>
          <div v-if="bookHeader.updated_at">
            <span class="font-semibold">Last Updated:</span>
            {{ formatDate(bookHeader.updated_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-gray-400 text-center py-8">
      <p>Book header not found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseAdminBookHeaderStore } from '@/stores/admin/AdminBookHeaderStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

const props = defineProps({
  bookHeaderId: {
    type: [String, Number],
    required: true,
  },
})

const route = useRoute()
const router = useRouter()

const bookHeaderStore = useSupabaseAdminBookHeaderStore()
const bookHeader = ref(null)
const isLoading = ref(false)
const error = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const editBookHeader = () => {
  const bookId = route.params.bookId
  console.log('DEBUG::BookHeaderView', 'Navigating to edit book header:', props.bookHeaderId)
  router.push(`/admin/books/${bookId}/headers/${props.bookHeaderId}/edit`)
}

const goBack = () => {
  const bookId = route.params.bookId
  console.log('DEBUG::BookHeaderView', 'Navigating back to book headers list')
  router.push(`/admin/books/${bookId}/headers`)
}

const loadBookHeader = async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('DEBUG::BookHeaderView', 'Loading book header:', props.bookHeaderId)

    bookHeader.value = await bookHeaderStore.fetchBookHeader(props.bookHeaderId)
    console.log('DEBUG::BookHeaderView', 'Book header loaded:', bookHeader.value)
  } catch (err) {
    console.error('DEBUG::BookHeaderView', 'Error loading book header:', err)
    error.value = err.message || 'Failed to load book header'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadBookHeader()
})
</script>
