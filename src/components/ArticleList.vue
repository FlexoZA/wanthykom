<template>
  <div>
    <div v-if="isLoading">Loading articles...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <p>Articles loaded successfully. Check console for data.</p>
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
