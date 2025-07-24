<template>
  <div class="p-6">
    <AddBook
      @book-created="handleBookCreated"
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
import AddBook from '@/components/admin/book/AddBook.vue'
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

const handleBookCreated = () => {
  console.log('DEBUG::BookCreateView', 'Book created successfully')
  showToastNotification('success', 'Book Created', 'Book has been successfully created')

  // Navigate back to books list after a short delay to show the toast
  setTimeout(() => {
    router.push('/admin/books')
  }, 1500)
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::BookCreateView', `Showing ${type} toast: ${title}`)
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
