<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Chapters Management</h1>
      <p class="text-gray-400 mt-2">Manage chapters for your books</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- List View -->
    <ChapterList
      v-if="currentView === 'list' && selectedBookId"
      :book-id="selectedBookId"
      :book-name="selectedBookName"
      @back-to-books="handleBackToBooks"
      @create-chapter="currentView = 'create'"
      @view-chapter="handleViewChapter"
      @edit-chapter="handleEditChapter"
      @delete-chapter="handleDeleteChapter"
    />

    <!-- Loading State for Initial Load -->
    <div v-else-if="currentView === 'list' && !selectedBookId" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Create View -->
    <AddChapter
      v-else-if="currentView === 'create'"
      :book-id="selectedBookId"
      @chapter-created="handleChapterCreated"
      @cancel="currentView = 'list'"
    />

    <!-- View Chapter -->
    <ChapterView
      v-else-if="currentView === 'view'"
      :chapter-id="selectedChapterId"
      @edit-chapter="handleEditChapter"
      @back="currentView = 'list'"
    />

    <!-- Edit Chapter -->
    <UpdateChapter
      v-else-if="currentView === 'edit'"
      :book-id="selectedBookId"
      :chapter-id="selectedChapterId"
      @chapter-updated="handleChapterUpdated"
      @cancel="currentView = 'list'"
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
import AddChapter from '@/components/admin/chapter/AddChapter.vue'
import ChapterView from '@/components/admin/chapter/ChapterView.vue'
import UpdateChapter from '@/components/admin/chapter/UpdateChapter.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import { useSupabaseAdminChapterStore } from '@/stores/admin/AdminChapterStore'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'

const route = useRoute()
const router = useRouter()
const currentView = ref('list')
const selectedBookId = ref(null)
const selectedBookName = ref('')
const selectedChapterId = ref(null)
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

const handleViewChapter = (chapterId) => {
  selectedChapterId.value = chapterId
  currentView.value = 'view'
}

const handleEditChapter = (chapterId) => {
  selectedChapterId.value = chapterId
  currentView.value = 'edit'
}

const handleChapterCreated = () => {
  currentView.value = 'list'
  showToastNotification('success', 'Chapter Created', 'Chapter has been successfully created')
}

const handleChapterUpdated = () => {
  currentView.value = 'list'
  showToastNotification('success', 'Chapter Updated', 'Chapter has been successfully updated')
}

const handleDeleteChapter = async (chapterId) => {
  try {
    console.log('DEBUG::ChaptersView', 'Deleting chapter:', chapterId)
    const result = await chapterStore.deleteChapter(chapterId, selectedBookId.value)

    if (result && result.success === false) {
      console.error('DEBUG::ChaptersView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete chapter')
    } else {
      console.log('DEBUG::ChaptersView', 'Chapter deleted successfully')
      showToastNotification('success', 'Chapter Deleted', 'Chapter has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::ChaptersView', 'Error deleting chapter:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the chapter')
  }
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::ChaptersView', `Showing ${type} toast: ${title}`)
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
    console.log('DEBUG::ChaptersView', 'Loading book info for:', bookId)
    const book = await bookStore.fetchBook(bookId)
    if (book) {
      selectedBookName.value = book.book_name
      console.log('DEBUG::ChaptersView', 'Book name loaded:', selectedBookName.value)
    }
  } catch (error) {
    console.error('DEBUG::ChaptersView', 'Error loading book info:', error)
    showToastNotification('error', 'Error', 'Failed to load book information')
  }
}

onMounted(async () => {
  // Get book ID from route params
  const bookId = route.params.bookId
  console.log('DEBUG::ChaptersView', 'Mounted with bookId:', bookId)

  if (bookId) {
    selectedBookId.value = bookId
    console.log('DEBUG::ChaptersView', 'Set selectedBookId to:', selectedBookId.value)
    await loadBookInfo(bookId)
  } else {
    // If no book ID, redirect to books
    console.log('DEBUG::ChaptersView', 'No book ID provided, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
