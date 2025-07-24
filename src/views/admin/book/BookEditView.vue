<template>
  <div class="p-6">
    <UpdateBook
      :book-id="$route.params.id"
      @book-updated="handleBookUpdated"
      @cancel="$router.push('/admin/books')"
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
import UpdateBook from '@/components/admin/book/UpdateBook.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleBookUpdated = () => {
  console.log('DEBUG::BookEditView', 'Book updated successfully')
  showToastNotification('success', 'Book Updated', 'Book has been successfully updated')

  // Navigate back to books list after a short delay to show the toast
  setTimeout(() => {
    router.push('/admin/books')
  }, 1500)
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BookEditView', `Showing ${type} toast: ${title}`)
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
