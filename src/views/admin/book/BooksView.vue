<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Books Management</h1>
      <p class="text-gray-400 mt-2">Manage your books</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- List View -->
    <BookList
      v-if="currentView === 'list'"
      @create-book="currentView = 'create'"
      @view-book="handleViewBook"
      @edit-book="handleEditBook"
      @delete-book="handleDeleteBook"
      @manage-chapters="handleManageChapters"
      @manage-headers="handleManageHeaders"
    />

    <!-- Create View -->
    <AddBook
      v-else-if="currentView === 'create'"
      @book-created="handleBookCreated"
      @cancel="currentView = 'list'"
    />

    <!-- View Book -->
    <BookView
      v-else-if="currentView === 'view'"
      :book-id="selectedBookId"
      @edit-book="handleEditBook"
      @back="currentView = 'list'"
    />

    <!-- Edit Book -->
    <UpdateBook
      v-else-if="currentView === 'edit'"
      :book-id="selectedBookId"
      @book-updated="handleBookUpdated"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BookList from '@/components/admin/book/BookList.vue'
import AddBook from '@/components/admin/book/AddBook.vue'
import BookView from '@/components/admin/book/BookView.vue'
import UpdateBook from '@/components/admin/book/UpdateBook.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'

const router = useRouter()

const currentView = ref('list')
const selectedBookId = ref(null)
const bookStore = useSupabaseAdminBookStore()

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleViewBook = (bookId) => {
  selectedBookId.value = bookId
  currentView.value = 'view'
}

const handleEditBook = (bookId) => {
  selectedBookId.value = bookId
  currentView.value = 'edit'
}

const handleBookCreated = () => {
  currentView.value = 'list'
  showToastNotification('success', 'Book Created', 'Book has been successfully created')
}

const handleBookUpdated = () => {
  currentView.value = 'list'
  showToastNotification('success', 'Book Updated', 'Book has been successfully updated')
}

const handleDeleteBook = async (bookId) => {
  try {
    console.log('DEBUG::BooksView', 'Deleting book:', bookId)
    const result = await bookStore.deleteBook(bookId)

    if (result && result.success === false) {
      console.error('DEBUG::BooksView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete book')
    } else {
      console.log('DEBUG::BooksView', 'Book deleted successfully')
      showToastNotification('success', 'Book Deleted', 'Book has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::BooksView', 'Error deleting book:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the book')
  }
}

const handleManageChapters = (bookId) => {
  console.log('DEBUG::BooksView', 'Manage chapters for book:', bookId)
  router.push(`/admin/books/${bookId}/chapters`)
}

const handleManageHeaders = (bookId) => {
  // TODO: Implement headers management later
  console.log('DEBUG::BooksView', 'Manage headers for book:', bookId)
  showToastNotification('info', 'Coming Soon', 'Headers management will be implemented soon')
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BooksView', `Showing ${type} toast: ${title}`)
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
</script>
