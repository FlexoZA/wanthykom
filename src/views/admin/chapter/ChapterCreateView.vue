<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Create New Chapter</h1>
      <p class="text-gray-400 mt-2">Add a new chapter to your book</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <AddChapter
      :book-id="bookId"
      @chapter-created="handleChapterCreated"
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
import AddChapter from '@/components/admin/chapter/AddChapter.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

const route = useRoute()
const router = useRouter()
const bookId = ref(null)

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleChapterCreated = () => {
  console.log('DEBUG::ChapterCreateView', 'Chapter created successfully')
  showToastNotification('success', 'Chapter Created', 'Chapter has been successfully created')

  // Redirect to chapter list after a short delay to show the toast
  setTimeout(() => {
    router.push(`/admin/books/${bookId.value}/chapters`)
  }, 1000)
}

const handleCancel = () => {
  router.push(`/admin/books/${bookId.value}/chapters`)
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::ChapterCreateView', `Showing ${type} toast: ${title}`)
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
  // Get book ID from route params
  bookId.value = route.params.bookId
  console.log('DEBUG::ChapterCreateView', 'Mounted with bookId:', bookId.value)

  if (!bookId.value) {
    // If no book ID, redirect to books
    console.log('DEBUG::ChapterCreateView', 'No book ID provided, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
