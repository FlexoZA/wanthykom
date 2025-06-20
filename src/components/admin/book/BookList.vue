<template>
  <div class="space-y-4">
    <!-- Create New Book Button -->
    <div class="flex justify-end">
      <button
        @click="$emit('create-book')"
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
        Create New Book
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showDeleteDialog"
      :title="`Delete Book: ${bookToDelete?.book_name}`"
      :message="`Are you sure you want to delete '${bookToDelete?.book_name}'? This action cannot be undone and will also delete all associated chapters and headers.`"
      confirm-text="Delete Book"
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
      <p>Error loading books: {{ error }}</p>
      <button
        @click="bookStore.fetchBooks()"
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="books.length === 0" class="text-gray-400 text-center py-8">
      <p>No books found</p>
    </div>

    <!-- Books Grid -->
    <div v-else class="grid gap-4">
      <div
        v-for="book in books"
        :key="book.id"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      >
        <div class="flex gap-4">
          <!-- Book Image -->
          <div class="flex-shrink-0 w-24 h-24">
            <img
              v-if="book.book_image && book.book_image.length > 0"
              :src="book.book_image[0].book_image_url"
              :alt="book.book_name"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          <!-- Book Details -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white truncate">
                {{ book.book_name }}
              </h3>
              <div class="flex items-center ml-2">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="
                    book.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  "
                >
                  {{ book.enable ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>

            <!-- Book Stats -->
            <div class="text-sm text-gray-400 mb-3 space-y-1">
              <div>Headers: {{ book.book_header ? book.book_header.length : 0 }}</div>
              <div>Chapters: {{ book.chapter ? book.chapter.length : 0 }}</div>
            </div>

            <!-- Creation Date -->
            <div class="text-xs text-gray-500 mb-3">
              <div>Created: {{ formatDate(book.created_at) }}</div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <button
                  @click="viewBook(book.id)"
                  class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  View Book
                </button>
                <button
                  @click="editBook(book.id)"
                  class="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Edit Book
                </button>
                <button
                  @click="manageChapters(book.id)"
                  class="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  Chapters
                </button>
                <button
                  @click="manageChapters(book.id)"
                  class="px-3 py-1 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                >
                  Headers
                </button>
              </div>
              <button
                @click="deleteBook(book.id)"
                class="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Delete book"
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
import { computed, onMounted, ref } from 'vue'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import ConfirmationDialog from '@/components/admin/dialogs/ConfirmationDialog.vue'

const emit = defineEmits(['create-book', 'view-book', 'edit-book', 'delete-book', 'manage-chapters'])

// Dialog state
const showDeleteDialog = ref(false)
const bookToDelete = ref(null)

const bookStore = useSupabaseAdminBookStore()

const books = computed(() => bookStore.getBooks)
const isLoading = computed(() => bookStore.getIsLoading)
const error = computed(() => bookStore.getError)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const viewBook = (bookId) => {
  console.log('DEBUG::BookList', 'View book:', bookId)
  emit('view-book', bookId)
}

const editBook = (bookId) => {
  console.log('DEBUG::BookList', 'Edit book:', bookId)
  emit('edit-book', bookId)
}

const manageChapters = (bookId) => {
  console.log('DEBUG::BookList', 'Manage chapters for book:', bookId)
  emit('manage-chapters', bookId)
}

const deleteBook = (bookId) => {
  console.log('DEBUG::BookList', 'Delete book:', bookId)
  const book = books.value.find(b => b.id === bookId)
  bookToDelete.value = book
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  console.log('DEBUG::BookList', 'Confirmed delete for book:', bookToDelete.value?.id)
  if (bookToDelete.value) {
    emit('delete-book', bookToDelete.value.id)
  }
  cancelDelete()
}

const cancelDelete = () => {
  console.log('DEBUG::BookList', 'Cancelled delete')
  showDeleteDialog.value = false
  bookToDelete.value = null
}

onMounted(() => {
  bookStore.fetchBooks()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
