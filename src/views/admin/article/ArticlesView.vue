<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Articles Management</h1>
      <p class="text-gray-400 mt-2">Manage your articles</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- List View -->
    <ArticleList
      v-if="currentView === 'list'"
      @create-article="currentView = 'create'"
      @view-article="handleViewArticle"
      @edit-article="handleEditArticle"
      @delete-article="handleDeleteArticle"
    />

    <!-- Create View -->
    <AddArticle
      v-else-if="currentView === 'create'"
      @article-created="handleArticleCreated"
      @cancel="currentView = 'list'"
    />

    <!-- View Article -->
    <ArticleView
      v-else-if="currentView === 'view'"
      :article-id="selectedArticleId"
      @edit-article="handleEditArticle"
      @back="currentView = 'list'"
    />

    <!-- Edit Article -->
    <UpdateArticle
      v-else-if="currentView === 'edit'"
      :article-id="selectedArticleId"
      @article-updated="handleArticleUpdated"
      @cancel="currentView = 'list'"
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
import ArticleList from '@/components/admin/article/ArticleList.vue'
import AddArticle from '@/components/admin/article/AddArticle.vue'
import ArticleView from '@/components/admin/article/ArticleView.vue'
import UpdateArticle from '@/components/admin/article/UpdateArticle.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/AdminArticleStore'

const currentView = ref('list')
const selectedArticleId = ref(null)
const articleStore = useSupabaseAdminArticleStore()

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleViewArticle = (articleId) => {
  selectedArticleId.value = articleId
  currentView.value = 'view'
}

const handleEditArticle = (articleId) => {
  selectedArticleId.value = articleId
  currentView.value = 'edit'
}

const handleArticleCreated = async () => {
  currentView.value = 'list'
  showToastNotification('success', 'Article Created', 'Article has been successfully created')
}

const handleArticleUpdated = async () => {
  currentView.value = 'list'
  showToastNotification('success', 'Article Updated', 'Article has been successfully updated')
}

const handleDeleteArticle = async (articleId) => {
  try {
    console.log('DEBUG::ArticlesView', 'Deleting article:', articleId)
    const result = await articleStore.deleteArticle(articleId)

    if (result && result.success === false) {
      console.error('DEBUG::ArticlesView', 'Delete failed:', result.error)
      showToastNotification('error', 'Delete Failed', result.error || 'Failed to delete article')
    } else {
            console.log('DEBUG::ArticlesView', 'Article deleted successfully')
      showToastNotification('success', 'Article Deleted', 'Article has been successfully deleted')
    }
  } catch (err) {
    console.error('DEBUG::ArticlesView', 'Error deleting article:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the article')
  }
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::ArticlesView', `Showing ${type} toast: ${title}`)
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
