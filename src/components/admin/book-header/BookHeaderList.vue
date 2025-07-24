<template>
  <div class="space-y-4">
    <!-- Back to Books Button and Create New Book Header Button -->
    <div class="flex justify-between items-center">
      <button
        @click="backToBooks"
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
        Back to Books
      </button>
      <button
        @click="createBookHeader"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create New Book Header
      </button>
    </div>

    <!-- Book Info Header -->
    <div v-if="bookName" class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
      <h2 class="text-xl font-semibold text-white">
        Book Headers for: <span class="text-blue-400">{{ bookName }}</span>
      </h2>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showDeleteDialog"
      :title="`Delete Book Header: ${bookHeaderToDelete?.book_header_name}`"
      :message="`Are you sure you want to delete '${bookHeaderToDelete?.book_header_name}'? This action cannot be undone.`"
      confirm-text="Delete Book Header"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @close="cancelDelete"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-gray-400 text-center py-8">
      <LoadingAnimation />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-400 text-center py-8">
      <p>Error loading book headers: {{ error }}</p>
      <button
        @click="bookHeaderStore.fetchBookHeaders(bookId)"
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="bookHeaders.length === 0" class="text-gray-400 text-center py-8">
      <p>No book headers found for this book</p>
    </div>

    <!-- Book Headers Grid -->
    <div v-else class="grid gap-4">
      <div
        v-for="bookHeader in bookHeaders"
        :key="bookHeader.id"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      >
        <div class="flex gap-4">
          <!-- Book Header Image -->
          <div class="flex-shrink-0 w-24 h-24">
            <img
              v-if="bookHeader.book_header_image_url"
              :src="bookHeader.book_header_image_url"
              :alt="bookHeader.book_header_name"
              class="w-full h-full object-cover rounded-md"
            />
            <div
              v-else
              class="w-full h-full bg-gray-600 rounded-md flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <!-- Book Header Details -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white truncate">
                {{ bookHeader.book_header_name }}
              </h3>
              <div class="flex items-center ml-2">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="
                    bookHeader.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  "
                >
                  {{ bookHeader.enable ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>

            <!-- Book Header Preview -->
            <div class="text-sm text-gray-400 mb-3">
              <p class="line-clamp-2">
                {{ bookHeader.book_header_text ? bookHeader.book_header_text.substring(0, 120) + '...' : 'No content' }}
              </p>
            </div>

            <!-- Creation Date -->
            <div class="text-xs text-gray-500 mb-3 space-y-1">
              <div>Created: {{ formatDate(bookHeader.created_at) }}</div>
              <div v-if="bookHeader.updated_at">
                Updated: {{ formatDate(bookHeader.updated_at) }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <button
                  @click="viewBookHeader(bookHeader.id)"
                  class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  View Book Header
                </button>
                <button
                  @click="editBookHeader(bookHeader.id)"
                  class="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Edit Book Header
                </button>
              </div>
              <button
                @click="deleteBookHeader(bookHeader.id)"
                class="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Delete book header"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseAdminBookHeaderStore } from '@/stores/admin/AdminBookHeaderStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import ConfirmationDialog from '@/components/admin/dialogs/ConfirmationDialog.vue'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
  bookName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['delete-book-header'])

const router = useRouter()

// Dialog state
const showDeleteDialog = ref(false)
const bookHeaderToDelete = ref(null)

const bookHeaderStore = useSupabaseAdminBookHeaderStore()

const bookHeaders = computed(() => bookHeaderStore.getBookHeaders)
const isLoading = computed(() => bookHeaderStore.getIsLoading)
const error = computed(() => bookHeaderStore.getError)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const backToBooks = () => {
  console.log('DEBUG::BookHeaderList', 'Navigating back to books')
  router.push('/admin/books')
}

const createBookHeader = () => {
  console.log('DEBUG::BookHeaderList', 'Navigating to create book header')
  router.push(`/admin/books/${props.bookId}/headers/create`)
}

const viewBookHeader = (bookHeaderId) => {
  console.log('DEBUG::BookHeaderList', 'Navigating to view book header:', bookHeaderId)
  router.push(`/admin/books/${props.bookId}/headers/${bookHeaderId}`)
}

const editBookHeader = (bookHeaderId) => {
  console.log('DEBUG::BookHeaderList', 'Navigating to edit book header:', bookHeaderId)
  router.push(`/admin/books/${props.bookId}/headers/${bookHeaderId}/edit`)
}

const deleteBookHeader = (bookHeaderId) => {
  console.log('DEBUG::BookHeaderList', 'Delete book header:', bookHeaderId)
  const bookHeader = bookHeaders.value.find(bh => bh.id === bookHeaderId)
  bookHeaderToDelete.value = bookHeader
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  console.log('DEBUG::BookHeaderList', 'Confirmed delete for book header:', bookHeaderToDelete.value?.id)
  if (bookHeaderToDelete.value) {
    emit('delete-book-header', bookHeaderToDelete.value.id)
  }
  cancelDelete()
}

const cancelDelete = () => {
  console.log('DEBUG::BookHeaderList', 'Cancelled delete')
  showDeleteDialog.value = false
  bookHeaderToDelete.value = null
}

// Watch for bookId changes to fetch book headers
watch(() => props.bookId, (newBookId) => {
  if (newBookId) {
    console.log('DEBUG::BookHeaderList', 'Fetching book headers for book:', newBookId)
    bookHeaderStore.fetchBookHeaders(newBookId)
  }
}, { immediate: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
