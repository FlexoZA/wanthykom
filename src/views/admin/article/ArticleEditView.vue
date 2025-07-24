<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Edit Article</h1>
      <p class="text-gray-400 mt-2">Update article details</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <UpdateArticle :article-id="articleId" />

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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import UpdateArticle from '@/components/admin/article/UpdateArticle.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

const route = useRoute()

// Get article ID from route params
const articleId = computed(() => route.params.id)

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
  console.log('DEBUG::ArticleEditView', `Showing ${type} toast: ${title}`)
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
