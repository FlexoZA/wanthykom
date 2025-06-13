<template>
  <div class="space-y-8">
    <div v-if="isLoading" class="text-gray-400">Loading articles...</div>
    <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>
    <div v-else>
      <div v-for="article in articles" :key="article.id">
        <h2 class="text-2xl font-bold text-gray-100 mb-4">{{ article.article_name }}</h2>
        <h2 class="text-2xl font-bold text-gray-100 mb-4">{{ article.article_image_name }}</h2>
        <!-- Display image if it exists -->
        <div v-if="article.article_image && article.article_image.length > 0" class="mb-6">
          <img
            :src="article.article_image[0].article_image_url"
            :alt="article.article_name"
            class="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <div class="prose prose-invert max-w-none">
          <p class="text-gray-300 whitespace-pre-wrap">{{ article.article_text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useSupabaseArticleStore } from '@/stores/supabaseArticleStore'

const articleStore = useSupabaseArticleStore()

const articles = computed(() => articleStore.getArticles)
const isLoading = computed(() => articleStore.getIsLoading)
const error = computed(() => articleStore.getError)

onMounted(async () => {
  await articleStore.fetchArticles()
  console.log('DEBUG::ArticleList', articles.value)
})
</script>
