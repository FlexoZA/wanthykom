<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Edit Chapter</h1>
      <p class="text-gray-400 mt-2">Update chapter information</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <UpdateChapter
      :book-id="bookId"
      :chapter-id="chapterId"
      @chapter-updated="handleChapterUpdated"
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
import UpdateChapter from '@/components/admin/chapter/UpdateChapter.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

const route = useRoute()
const router = useRouter()
const chapterId = ref(null)
const bookId = ref(null)

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleChapterUpdated = () => {
  console.log('DEBUG::ChapterEditView', 'Chapter updated successfully')
  showToastNotification('success', 'Chapter Updated', 'Chapter has been successfully updated')

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
  console.log('DEBUG::ChapterEditView', `Showing ${type} toast: ${title}`)
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
  // Get IDs from route params
  chapterId.value = route.params.id
  bookId.value = route.params.bookId
  console.log('DEBUG::ChapterEditView', 'Mounted with chapterId:', chapterId.value, 'bookId:', bookId.value)

  if (!chapterId.value || !bookId.value) {
    // If missing params, redirect to books
    console.log('DEBUG::ChapterEditView', 'Missing required params, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
