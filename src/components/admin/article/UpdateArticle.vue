<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">Edit Article</h1>
      <button
        @click="$emit('cancel')"
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

    <!-- Article Form -->
    <AddArticle v-else :article="article" mode="edit" @article-updated="handleArticleUpdated" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/AdminArticleStore'
import AddArticle from '@/components/admin/article/AddArticle.vue'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['article-updated', 'cancel'])

const articleStore = useSupabaseAdminArticleStore()
const isLoading = ref(true)
const error = ref(null)
const article = ref(null)

const fetchArticle = async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('DEBUG::UpdateArticle', 'Fetching article:', props.articleId)
    article.value = await articleStore.fetchArticle(props.articleId)
  } catch (err) {
    console.error('DEBUG::UpdateArticle', 'Error fetching article:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const handleArticleUpdated = async () => {
  try {
    emit('article-updated')
  } catch (err) {
    console.error('DEBUG::UpdateArticle', 'Error refreshing articles:', err)
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
