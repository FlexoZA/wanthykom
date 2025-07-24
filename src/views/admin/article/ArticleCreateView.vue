<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Create Article</h1>
      <p class="text-gray-400 mt-2">Add a new article</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <AddArticle />

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
import AddArticle from '@/components/admin/article/AddArticle.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::ArticleCreateView', `Showing ${type} toast: ${title}`)
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

// Expose the toast function for potential use by child components
defineExpose({
  showToastNotification
})
</script>
