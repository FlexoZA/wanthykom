<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Edit Book Header</h1>
      <p class="text-gray-400 mt-2">Update book header information</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- Update Book Header Component -->
    <UpdateBookHeader
      :book-id="bookId"
      :book-header-id="bookHeaderId"
      @book-header-updated="handleBookHeaderUpdated"
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
import UpdateBookHeader from '@/components/admin/book-header/UpdateBookHeader.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

const route = useRoute()
const router = useRouter()
const bookId = ref(route.params.bookId)
const bookHeaderId = ref(route.params.id)

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleBookHeaderUpdated = () => {
  console.log('DEBUG::BookHeaderEditView', 'Book header updated, navigating back to list')
  showToastNotification('success', 'Book Header Updated', 'Book header has been successfully updated')

  // Navigate back to book headers list after a short delay to show the toast
  setTimeout(() => {
    router.push(`/admin/books/${bookId.value}/headers`)
  }, 1000)
}

const handleCancel = () => {
  console.log('DEBUG::BookHeaderEditView', 'Edit cancelled, navigating back to list')
  router.push(`/admin/books/${bookId.value}/headers`)
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BookHeaderEditView', `Showing ${type} toast: ${title}`)
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
  const routeHeaderId = route.params.id
  console.log('DEBUG::BookHeaderEditView', 'Mounted with bookId:', routeBookId, 'headerId:', routeHeaderId)

  if (routeBookId && routeHeaderId) {
    bookId.value = routeBookId
    bookHeaderId.value = routeHeaderId
  } else {
    // If missing parameters, redirect to books
    console.log('DEBUG::BookHeaderEditView', 'Missing parameters, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
