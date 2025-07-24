<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Articles Management</h1>
      <p class="text-gray-400 mt-2">Manage your articles</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <ArticleList @delete-article="handleDeleteArticle" />

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
import ArticleList from '@/components/admin/article/ArticleList.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/AdminArticleStore'

const articleStore = useSupabaseAdminArticleStore()

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
  console.log('DEBUG::ArticleListView', `Showing ${type} toast: ${title}`)
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

const handleDeleteArticle = async (articleId) => {
  try {
    console.log('DEBUG::ArticleListView', 'Deleting article:', articleId)
    const result = await articleStore.deleteArticle(articleId)

    if (result && result.success === false) {
      console.error('DEBUG::ArticleListView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete article')
    } else {
      console.log('DEBUG::ArticleListView', 'Article deleted successfully')
      showToastNotification('success', 'Article Deleted', 'Article has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::ArticleListView', 'Error deleting article:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the article')
  }
}

// Expose the toast function for potential use by child components
defineExpose({
  showToastNotification
})
</script>
