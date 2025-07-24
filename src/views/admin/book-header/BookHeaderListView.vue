<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Book Headers Management</h1>
      <p class="text-gray-400 mt-2">Manage headers for your books</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- Book Header List Component -->
    <BookHeaderList
      :book-id="bookId"
      :book-name="bookName"
      @back-to-books="handleBackToBooks"
      @create-book-header="handleCreateBookHeader"
      @view-book-header="handleViewBookHeader"
      @edit-book-header="handleEditBookHeader"
      @delete-book-header="handleDeleteBookHeader"
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
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import { useSupabaseAdminBookHeaderStore } from '@/stores/admin/AdminBookHeaderStore'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'

const route = useRoute()
const router = useRouter()
const bookId = ref(route.params.bookId)
const bookName = ref('')
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
  console.log('DEBUG::BookHeaderListView', 'Navigating back to books')
  router.push('/admin/books')
}

const handleCreateBookHeader = () => {
  console.log('DEBUG::BookHeaderListView', 'Navigating to create book header')
  router.push(`/admin/books/${bookId.value}/headers/create`)
}

const handleViewBookHeader = (bookHeaderId) => {
  console.log('DEBUG::BookHeaderListView', 'Navigating to view book header:', bookHeaderId)
  router.push(`/admin/books/${bookId.value}/headers/${bookHeaderId}`)
}

const handleEditBookHeader = (bookHeaderId) => {
  console.log('DEBUG::BookHeaderListView', 'Navigating to edit book header:', bookHeaderId)
  router.push(`/admin/books/${bookId.value}/headers/${bookHeaderId}/edit`)
}

const handleDeleteBookHeader = async (bookHeaderId) => {
  try {
    console.log('DEBUG::BookHeaderListView', 'Deleting book header:', bookHeaderId)
    const result = await bookHeaderStore.deleteBookHeader(bookHeaderId, bookId.value)

    if (result && result.success === false) {
      console.error('DEBUG::BookHeaderListView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete book header')
    } else {
      console.log('DEBUG::BookHeaderListView', 'Book header deleted successfully')
      showToastNotification('success', 'Book Header Deleted', 'Book header has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::BookHeaderListView', 'Error deleting book header:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the book header')
  }
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BookHeaderListView', `Showing ${type} toast: ${title}`)
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
    console.log('DEBUG::BookHeaderListView', 'Loading book info for:', bookId)
    const book = await bookStore.fetchBook(bookId)
    if (book) {
      bookName.value = book.book_name
      console.log('DEBUG::BookHeaderListView', 'Book name loaded:', bookName.value)
    }
  } catch (error) {
    console.error('DEBUG::BookHeaderListView', 'Error loading book info:', error)
    showToastNotification('error', 'Error', 'Failed to load book information')
  }
}

onMounted(async () => {
  const routeBookId = route.params.bookId
  console.log('DEBUG::BookHeaderListView', 'Mounted with bookId:', routeBookId)

  if (routeBookId) {
    bookId.value = routeBookId
    console.log('DEBUG::BookHeaderListView', 'Set bookId to:', bookId.value)
    await loadBookInfo(routeBookId)
  } else {
    // If no book ID, redirect to books
    console.log('DEBUG::BookHeaderListView', 'No book ID provided, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
