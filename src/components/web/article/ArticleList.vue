<template>
  <div class="space-y-8">
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>
    <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>
    <div v-else-if="articles.length === 0" class="text-gray-400">
      <p>{{ showFeaturedOnly ? 'No featured articles found' : 'No articles found' }}</p>
    </div>
    <div v-else>
      <div class="mb-12">
        <div v-for="article in articles" :key="article.id" class="border-t border-gray-700 pt-6 first:border-t-0 first:pt-0">
          <h2 class="text-2xl font-bold text-gray-100 mb-4">{{ article.article_name }}</h2>
          <!-- Display image if it exists -->
          <div v-if="article.article_image_url" class="mb-6">
            <img
              :src="article.article_image_url"
              :alt="article.article_name"
              class="w-full h-80 object-cover rounded-lg"
            />
          </div>

          <div class="prose prose-invert max-w-none">
            <p class="text-gray-300 whitespace-pre-wrap">{{ article.article_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useSupabaseArticleStore } from '@/stores/web/supabaseArticleStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

const props = defineProps({
  showFeaturedOnly: {
    type: Boolean,
    default: true
  },
  categoryId: {
    type: String,
    default: null
  }
})

const articleStore = useSupabaseArticleStore()

const articles = computed(() => {
  return props.showFeaturedOnly
    ? articleStore.getFeaturedArticles
    : articleStore.getArticles
})

const isLoading = computed(() => articleStore.getIsLoading)
const error = computed(() => articleStore.getError)

const fetchArticles = async () => {
  if (props.showFeaturedOnly) {
    await articleStore.fetchFeaturedArticles()
    console.log('DEBUG::ArticleList', 'Featured articles:', articles.value)
  } else if (props.categoryId) {
    await articleStore.fetchArticlesByCategory(props.categoryId)
    console.log('DEBUG::ArticleList', 'Articles by category:', articles.value)
  } else {
    await articleStore.fetchArticles()
    console.log('DEBUG::ArticleList', 'Non-featured articles:', articles.value)
  }
}

// Watch for category changes
watch(() => props.categoryId, () => {
  fetchArticles()
})

onMounted(async () => {
  await fetchArticles()
})
</script>
