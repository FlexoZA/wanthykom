<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">View Book</h1>
      <div class="flex gap-2">
        <button
          @click="$router.push(`/admin/books/${bookId}/edit`)"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Book
        </button>
        <button
          @click="$router.push('/admin/books')"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Books
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-gray-400 text-center py-8">
      <LoadingAnimation />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-400 text-center py-8">
      <p>Error loading book: {{ error }}</p>
    </div>

    <!-- Book Content -->
    <div v-else-if="book" class="bg-gray-800 rounded-lg p-6">
      <!-- Book Cover Image -->
      <div v-if="book.book_image_url" class="mb-6">
        <img
          :src="book.book_image_url"
          :alt="book.book_name"
          class="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <!-- Book Title -->
      <h2 class="text-3xl font-bold text-white mb-6">{{ book.book_name }}</h2>

      <!-- Book Headers -->
      <div v-if="book.book_header && book.book_header.length > 0" class="mb-8">
        <h3 class="text-xl font-semibold text-gray-200 mb-4">Book Headers</h3>
        <div class="space-y-4">
          <div
            v-for="header in book.book_header"
            :key="header.id"
            class="bg-gray-700 rounded-lg p-4"
          >
            <h4 class="text-lg font-semibold text-gray-200 mb-2">{{ header.book_header_name }}</h4>
            <div class="prose prose-invert max-w-none">
              <p class="text-gray-300 whitespace-pre-wrap">{{ header.book_header_text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chapters -->
      <div v-if="book.chapter && book.chapter.length > 0" class="mb-8">
        <h3 class="text-xl font-semibold text-gray-200 mb-4">
          Chapters ({{ book.chapter.length }})
        </h3>
        <div class="space-y-6">
          <div
            v-for="chapter in book.chapter"
            :key="chapter.id"
            class="bg-gray-700 rounded-lg p-4"
          >
            <h4 class="text-lg font-semibold text-gray-200 mb-3">{{ chapter.chapter_name }}</h4>

            <!-- Chapter Image -->
            <div v-if="chapter.book_chapter_image_url" class="mb-4">
              <img
                :src="chapter.book_chapter_image_url"
                :alt="chapter.chapter_name"
                class="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <!-- Chapter Content -->
            <div class="prose prose-invert max-w-none">
              <p class="text-gray-300 whitespace-pre-wrap">{{ chapter.chapter_text }}</p>
            </div>

            <!-- Chapter Date -->
            <div class="mt-3 text-xs text-gray-500">
              Created: {{ formatDate(chapter.created_at) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty States -->
      <div v-else class="text-center py-8">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p class="text-lg">No chapters found</p>
          <p class="text-sm">This book doesn't have any chapters yet.</p>
        </div>
      </div>

      <!-- Book Metadata -->
      <div class="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span class="font-semibold">Created:</span>
            {{ formatDate(book.created_at) }}
          </div>
          <div>
            <span class="font-semibold">Headers:</span>
            {{ book.book_header ? book.book_header.length : 0 }}
          </div>
          <div>
            <span class="font-semibold">Chapters:</span>
            {{ book.chapter ? book.chapter.length : 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

const props = defineProps({
  bookId: {
    type: String,
    required: true,
  },
})

// No emits needed anymore - using router navigation

const bookStore = useSupabaseAdminBookStore()
const book = ref(null)
const isLoading = ref(false)
const error = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadBook = async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('DEBUG::BookView', 'Loading book:', props.bookId)

    const bookData = await bookStore.fetchBook(props.bookId)
    book.value = bookData
    console.log('DEBUG::BookView', 'Book loaded:', bookData)
  } catch (err) {
    console.error('DEBUG::BookView', 'Error loading book:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadBook()
})
</script>
