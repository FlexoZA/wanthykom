<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Chapters Management</h1>
      <p class="text-gray-400 mt-2">Manage chapters for your books</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- Loading State for Initial Load -->
    <div v-if="!selectedBookId" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Chapter List -->
    <ChapterList
      v-else
      :book-id="selectedBookId"
      :book-name="selectedBookName"
      @back-to-books="handleBackToBooks"
      @create-chapter="handleCreateChapter"
      @view-chapter="handleViewChapter"
      @edit-chapter="handleEditChapter"
      @delete-chapter="handleDeleteChapter"
    />

    <!-- Notification Toast -->
    <NotificationToast
      :show="showToast"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChapterList from '@/components/admin/chapter/ChapterList.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import { useSupabaseAdminChapterStore } from '@/stores/admin/AdminChapterStore'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'

const route = useRoute()
const router = useRouter()
const selectedBookId = ref(null)
const selectedBookName = ref('')
const chapterStore = useSupabaseAdminChapterStore()
const bookStore = useSupabaseAdminBookStore()

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleBackToBooks = () => {
  router.push('/admin/books')
}

const handleCreateChapter = () => {
  router.push(`/admin/books/${selectedBookId.value}/chapters/create`)
}

const handleViewChapter = (chapterId) => {
  router.push(`/admin/books/${selectedBookId.value}/chapters/${chapterId}`)
}

const handleEditChapter = (chapterId) => {
  router.push(`/admin/books/${selectedBookId.value}/chapters/${chapterId}/edit`)
}

const handleDeleteChapter = async (chapterId) => {
  try {
    console.log('DEBUG::ChapterListView', 'Deleting chapter:', chapterId)
    const result = await chapterStore.deleteChapter(chapterId, selectedBookId.value)

    if (result && result.success === false) {
      console.error('DEBUG::ChapterListView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete chapter')
    } else {
      console.log('DEBUG::ChapterListView', 'Chapter deleted successfully')
      showToastNotification('success', 'Chapter Deleted', 'Chapter has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::ChapterListView', 'Error deleting chapter:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the chapter')
  }
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::ChapterListView', `Showing ${type} toast: ${title}`)
  toast.value = {
    type,
    title,
    message,
    duration,
  }
  showToast.value = true
}

const hideToast = () => {
  showToast.value = false
}

// Load book information
const loadBookInfo = async (bookId) => {
  try {
    console.log('DEBUG::ChapterListView', 'Loading book info for:', bookId)
    const book = await bookStore.fetchBook(bookId)
    if (book) {
      selectedBookName.value = book.book_name
      console.log('DEBUG::ChapterListView', 'Book name loaded:', selectedBookName.value)
    }
  } catch (error) {
    console.error('DEBUG::ChapterListView', 'Error loading book info:', error)
    showToastNotification('error', 'Error', 'Failed to load book information')
  }
}

onMounted(async () => {
  // Get book ID from route params
  const bookId = route.params.bookId
  console.log('DEBUG::ChapterListView', 'Mounted with bookId:', bookId)

  if (bookId) {
    selectedBookId.value = bookId
    console.log('DEBUG::ChapterListView', 'Set selectedBookId to:', selectedBookId.value)
    await loadBookInfo(bookId)
  } else {
    // If no book ID, redirect to books
    console.log('DEBUG::ChapterListView', 'No book ID provided, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
