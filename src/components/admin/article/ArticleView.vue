<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">View Article</h1>
      <div class="flex gap-2">
        <button
          @click="$emit('edit-article', articleId)"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Article
        </button>
        <button
          @click="$emit('back')"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Back to Articles
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-400 text-center py-8">
      <p>Error loading article: {{ error }}</p>
      <button
        @click="fetchArticle"
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="bg-gray-800 rounded-lg p-6">
      <!-- Status Badges -->
      <div class="mb-6 flex gap-2">
        <!-- Category Badge -->
        <span
          v-if="article.article_catagory && article.article_catagory.catagory_name"
          class="px-3 py-1 text-sm rounded-full bg-purple-900 text-purple-300"
        >
          Category: {{ article.article_catagory.catagory_name }}
        </span>
        <!-- Featured Badge -->
        <span
          v-if="article.article_featured"
          class="px-3 py-1 text-sm rounded-full bg-blue-900 text-blue-300"
        >
          Featured Article
        </span>
        <!-- Enable Status Badge -->
        <span
          class="px-3 py-1 text-sm rounded-full"
          :class="article.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
        >
          {{ article.enable ? 'Enabled' : 'Disabled' }}
        </span>
      </div>

      <!-- Article Image -->
      <div v-if="article.article_image_url" class="mb-6">
        <img
          :src="article.article_image_url"
          :alt="article.article_name"
          class="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <!-- Article Title -->
      <h2 class="text-3xl font-bold text-white mb-4">{{ article.article_name }}</h2>

      <!-- Article Text -->
      <div class="prose prose-invert max-w-none">
        <p class="text-gray-300 whitespace-pre-wrap">{{ article.article_text }}</p>
      </div>

      <!-- Dates -->
      <div class="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
        <div>Created: {{ formatDate(article.created_at) }}</div>
        <div>
          Last updated:
          {{ article.updated_at ? formatDate(article.updated_at) : 'No updates yet' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/AdminArticleStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true,
  },
})

defineEmits(['edit-article', 'back'])

const articleStore = useSupabaseAdminArticleStore()
const isLoading = ref(true)
const error = ref(null)
const article = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const fetchArticle = async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('DEBUG::ArticleView', 'Fetching article:', props.articleId)
    article.value = await articleStore.fetchArticle(props.articleId)
  } catch (err) {
    console.error('DEBUG::ArticleView', 'Error fetching article:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Watch for articleId changes
watch(
  () => props.articleId,
  () => {
    if (props.articleId) {
      fetchArticle()
    }
  },
  { immediate: true },
)
</script>
