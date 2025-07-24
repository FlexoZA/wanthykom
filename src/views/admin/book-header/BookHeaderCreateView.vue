<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Create Book Header</h1>
      <p class="text-gray-400 mt-2">Add a new header to your book</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- Add Book Header Component -->
    <AddBookHeader
      :book-id="bookId"
      @book-header-created="handleBookHeaderCreated"
      @cancel="handleCancel"
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
import AddBookHeader from '@/components/admin/book-header/AddBookHeader.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

const route = useRoute()
const router = useRouter()
const bookId = ref(route.params.bookId)

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleBookHeaderCreated = () => {
  console.log('DEBUG::BookHeaderCreateView', 'Book header created, navigating back to list')
  showToastNotification('success', 'Book Header Created', 'Book header has been successfully created')

  // Navigate back to book headers list after a short delay to show the toast
  setTimeout(() => {
    router.push(`/admin/books/${bookId.value}/headers`)
  }, 1000)
}

const handleCancel = () => {
  console.log('DEBUG::BookHeaderCreateView', 'Create cancelled, navigating back to list')
  router.push(`/admin/books/${bookId.value}/headers`)
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BookHeaderCreateView', `Showing ${type} toast: ${title}`)
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

onMounted(() => {
  const routeBookId = route.params.bookId
  console.log('DEBUG::BookHeaderCreateView', 'Mounted with bookId:', routeBookId)

  if (routeBookId) {
    bookId.value = routeBookId
  } else {
    // If no book ID, redirect to books
    console.log('DEBUG::BookHeaderCreateView', 'No book ID provided, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
