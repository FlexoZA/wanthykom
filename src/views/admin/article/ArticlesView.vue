<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Articles Management</h1>
      <p class="text-gray-400 mt-2">Manage your articles</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- List View -->
    <AdminArticleList
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminArticleList from '@/components/admin/article/AdminArticleList.vue'
import AddArticle from '@/components/admin/article/AddArticle.vue'
import ArticleView from '@/components/admin/article/ArticleView.vue'
import UpdateArticle from '@/components/admin/article/UpdateArticle.vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/supabaseAdminArticleStore'

const currentView = ref('list')
const selectedArticleId = ref(null)
const articleStore = useSupabaseAdminArticleStore()

const handleViewArticle = (articleId) => {
  selectedArticleId.value = articleId
  currentView.value = 'view'
}

const handleEditArticle = (articleId) => {
  selectedArticleId.value = articleId
  currentView.value = 'edit'
}

const handleArticleCreated = () => {
  currentView.value = 'list'
}

const handleArticleUpdated = () => {
  currentView.value = 'list'
}

const handleDeleteArticle = async (articleId) => {
  try {
    await articleStore.deleteArticle(articleId)
  } catch (err) {
    console.error('DEBUG::ArticlesView', 'Error deleting article:', err)
  }
}
</script>
