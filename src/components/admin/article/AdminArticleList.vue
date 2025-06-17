<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-gray-400 text-center py-8">
      <div class="animate-pulse">Loading articles...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-400 text-center py-8">
      <p>Error loading articles: {{ error }}</p>
      <button 
        @click="articleStore.fetchArticles()" 
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="articles.length === 0" class="text-gray-400 text-center py-8">
      <p>No articles found</p>
    </div>

    <!-- Articles Grid -->
    <div v-else class="grid gap-4">
      <div 
        v-for="article in articles" 
        :key="article.id"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      >
        <div class="flex gap-4">
          <!-- Article Image -->
          <div class="flex-shrink-0 w-24 h-24">
            <img 
              v-if="article.article_image && article.article_image.length > 0"
              :src="article.article_image[0].article_image_url" 
              :alt="article.article_name"
              class="w-full h-full object-cover rounded-md"
            />
            <div 
              v-else 
              class="w-full h-full bg-gray-600 rounded-md flex items-center justify-center"
            >
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Article Details -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white truncate">
                {{ article.article_name }}
              </h3>
              <div class="flex items-center ml-2">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="article.enable
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-red-900 text-red-300'"
                >
                  {{ article.enable ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>

            <p class="text-gray-400 text-sm mb-3 line-clamp-2">
              {{ article.article_text.substring(0, 120) }}{{ article.article_text.length > 120 ? '...' : '' }}
            </p>

            <!-- Dates -->
            <div class="text-xs text-gray-500 mb-3 space-y-1">
              <div>Created: {{ formatDate(article.created_at) }}</div>
              <div>Updated: {{ formatDate(article.updated_at || article.created_at) }}</div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button
                @click="viewArticle(article.id)"
                class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                View Article
              </button>
              <button
                @click="editArticle(article.id)"
                class="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Edit Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/supabaseAdminArticleStore'

const articleStore = useSupabaseAdminArticleStore()

const articles = computed(() => articleStore.getArticles)
const isLoading = computed(() => articleStore.getIsLoading)
const error = computed(() => articleStore.getError)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewArticle = (articleId) => {
  console.log("DEBUG::AdminArticleList", "View article:", articleId)
  // TODO: Implement view article logic
}

const editArticle = (articleId) => {
  console.log("DEBUG::AdminArticleList", "Edit article:", articleId)
  // TODO: Implement edit article logic
}

onMounted(() => {
  articleStore.fetchArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
