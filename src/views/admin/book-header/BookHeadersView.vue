<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Book Headers Management</h1>
      <p class="text-gray-400 mt-2">Manage headers for your books</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- List View -->
    <BookHeaderList
      v-if="currentView === 'list' && selectedBookId"
      :book-id="selectedBookId"
      :book-name="selectedBookName"
      @back-to-books="handleBackToBooks"
      @create-book-header="currentView = 'create'"
      @view-book-header="handleViewBookHeader"
      @edit-book-header="handleEditBookHeader"
      @delete-book-header="handleDeleteBookHeader"
    />

    <!-- Loading State for Initial Load -->
    <div v-else-if="currentView === 'list' && !selectedBookId" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Create View -->
    <AddBookHeader
      v-else-if="currentView === 'create'"
      :book-id="selectedBookId"
      @book-header-created="handleBookHeaderCreated"
      @cancel="currentView = 'list'"
    />

    <!-- View Book Header -->
    <BookHeaderView
      v-else-if="currentView === 'view'"
      :book-header-id="selectedBookHeaderId"
      @edit-book-header="handleEditBookHeader"
      @back="currentView = 'list'"
    />

    <!-- Edit Book Header -->
    <UpdateBookHeader
      v-else-if="currentView === 'edit'"
      :book-id="selectedBookId"
      :book-header-id="selectedBookHeaderId"
      @book-header-updated="handleBookHeaderUpdated"
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
import BookHeaderList from '@/components/admin/book-header/BookHeaderList.vue'
import AddBookHeader from '@/components/admin/book-header/AddBookHeader.vue'
import BookHeaderView from '@/components/admin/book-header/BookHeaderView.vue'
import UpdateBookHeader from '@/components/admin/book-header/UpdateBookHeader.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import { useSupabaseAdminBookHeaderStore } from '@/stores/admin/AdminBookHeaderStore'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'

const route = useRoute()
const router = useRouter()
const currentView = ref('list')
const selectedBookId = ref(null)
const selectedBookName = ref('')
const selectedBookHeaderId = ref(null)
const bookHeaderStore = useSupabaseAdminBookHeaderStore()
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

const handleViewBookHeader = (bookHeaderId) => {
  selectedBookHeaderId.value = bookHeaderId
  currentView.value = 'view'
}

const handleEditBookHeader = (bookHeaderId) => {
  selectedBookHeaderId.value = bookHeaderId
  currentView.value = 'edit'
}

const handleBookHeaderCreated = () => {
  currentView.value = 'list'
  showToastNotification('success', 'Book Header Created', 'Book header has been successfully created')
}

const handleBookHeaderUpdated = () => {
  currentView.value = 'list'
  showToastNotification('success', 'Book Header Updated', 'Book header has been successfully updated')
}

const handleDeleteBookHeader = async (bookHeaderId) => {
  try {
    console.log('DEBUG::BookHeadersView', 'Deleting book header:', bookHeaderId)
    const result = await bookHeaderStore.deleteBookHeader(bookHeaderId, selectedBookId.value)

    if (result && result.success === false) {
      console.error('DEBUG::BookHeadersView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete book header')
    } else {
      console.log('DEBUG::BookHeadersView', 'Book header deleted successfully')
      showToastNotification('success', 'Book Header Deleted', 'Book header has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::BookHeadersView', 'Error deleting book header:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the book header')
  }
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BookHeadersView', `Showing ${type} toast: ${title}`)
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
    console.log('DEBUG::BookHeadersView', 'Loading book info for:', bookId)
    const book = await bookStore.fetchBook(bookId)
    if (book) {
      selectedBookName.value = book.book_name
      console.log('DEBUG::BookHeadersView', 'Book name loaded:', selectedBookName.value)
    }
  } catch (error) {
    console.error('DEBUG::BookHeadersView', 'Error loading book info:', error)
    showToastNotification('error', 'Error', 'Failed to load book information')
  }
}

onMounted(async () => {
  // Get book ID from route params
  const bookId = route.params.bookId
  console.log('DEBUG::BookHeadersView', 'Mounted with bookId:', bookId)

  if (bookId) {
    selectedBookId.value = bookId
    console.log('DEBUG::BookHeadersView', 'Set selectedBookId to:', selectedBookId.value)
    await loadBookInfo(bookId)
  } else {
    // If no book ID, redirect to books
    console.log('DEBUG::BookHeadersView', 'No book ID provided, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
