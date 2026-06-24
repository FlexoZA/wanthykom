<template>
  <div class="relative space-y-4">
    <ArticleDetail v-if="article" :article="article" />
    <button @click="router.back()" class="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200">
      <span class="text-xl">←</span>
      <span>{{ languageStore.t('back') }}</span>
    </button>
  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleDetail from '@/components/web/article/ArticleDetail.vue'
import { useSupabaseArticleStore } from '@/stores/web/supabaseArticleStore'
import { useLanguageStore } from '@/stores/languageStore'

const route = useRoute()
const router = useRouter()
const articleStore = useSupabaseArticleStore()
const languageStore = useLanguageStore()

const article = ref(null)

const resolveArticle = async ({ forceFetch = false } = {}) => {
  // Ensure articles are loaded; fetch if empty or forced (e.g. after a language switch)
  if (forceFetch || !articleStore.getArticles || articleStore.getArticles.length === 0) {
    await articleStore.fetchArticles()
  }

  const idParam = route.params.id
  const id = typeof idParam === 'string' ? parseInt(idParam, 10) : idParam

  const found = (articleStore.getArticles || []).find(a => a.id === id)
  article.value = found || null
}

onMounted(() => resolveArticle())

// On language change, the same article id won't exist in the other language's
// content set. Re-fetch and, if it's gone, send the reader back to the home page.
watch(() => languageStore.currentLanguage, async () => {
  await resolveArticle({ forceFetch: true })
  if (!article.value) {
    router.push({ name: 'home' })
  }
})
</script>


