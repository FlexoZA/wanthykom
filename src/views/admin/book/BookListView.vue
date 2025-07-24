<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Books Management</h1>
      <p class="text-gray-400 mt-2">Manage your books</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <BookList
      @delete-book="handleDeleteBook"
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
import BookList from '@/components/admin/book/BookList.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'

const bookStore = useSupabaseAdminBookStore()

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleDeleteBook = async (bookId) => {
  try {
    console.log('DEBUG::BookListView', 'Deleting book:', bookId)
    const result = await bookStore.deleteBook(bookId)

    if (result && result.success === false) {
      console.error('DEBUG::BookListView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete book')
    } else {
      console.log('DEBUG::BookListView', 'Book deleted successfully')
      showToastNotification('success', 'Book Deleted', 'Book has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::BookListView', 'Error deleting book:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the book')
  }
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BookListView', `Showing ${type} toast: ${title}`)
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
