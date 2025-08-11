<template>
  <div class="relative space-y-4">
    <ArticleDetail v-if="article" :article="article" />
    <button @click="router.back()" class="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200">
      <span class="text-xl">←</span>
      <span>Terug</span>
    </button>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleDetail from '@/components/web/article/ArticleDetail.vue'
import { useSupabaseArticleStore } from '@/stores/web/supabaseArticleStore'

const route = useRoute()
const router = useRouter()
const articleStore = useSupabaseArticleStore()

const article = ref(null)

onMounted(async () => {
  // Ensure articles are loaded; fetch if empty
  if (!articleStore.getArticles || articleStore.getArticles.length === 0) {
    await articleStore.fetchArticles()
  }

  const idParam = route.params.id
  const id = typeof idParam === 'string' ? parseInt(idParam, 10) : idParam

  const found = (articleStore.getArticles || []).find(a => a.id === id)
  article.value = found || null
})
</script>


