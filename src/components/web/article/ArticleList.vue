<template>
  <div class="space-y-8">
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>
    <div v-else-if="error" class="text-red-400">{{ languageStore.t('errorPrefix') }}: {{ error }}</div>
    <div v-else-if="articles.length === 0" class="text-gray-400">
      <p>{{ showFeaturedOnly ? languageStore.t('noFeaturedArticles') : languageStore.t('noArticles') }}</p>
    </div>
        <div v-else>
      <!-- Latest Article Block -->
      <template v-if="showLatestArticle">
        <h2 class="text-2xl font-bold text-gray-100 mb-2">{{ languageStore.t('whatsNew') }}</h2>
        <div v-if="latestArticle" class="bg-gray-800 rounded-lg p-6 mb-8">
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="latestArticle.article_image_url" class="md:w-1/3">
              <img
                :src="latestArticle.article_image_url"
                :alt="latestArticle.article_name"
                class="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div :class="{ 'md:w-2/3': latestArticle.article_image_url, 'w-full': !latestArticle.article_image_url }">
              <h2 class="text-2xl font-bold text-gray-100 mb-2">{{ latestArticle.article_name }}</h2>
              <p class="text-gray-300 line-clamp-3 mb-4">{{ stripHtml(latestArticle.article_text) }}</p>
              <router-link
                :to="{ name: 'article-detail', params: { id: latestArticle.id } }"
                class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {{ languageStore.t('readMore') }}
              </router-link>
            </div>
        </div>
      </div>
      </template>
      <!-- Regular Article List -->
      <div class="mb-12">
        <div v-for="article in articles" :key="article.id" class="border-t border-gray-700 pt-6 first:border-t-0 first:pt-0">
          <h2 class="text-2xl font-bold text-gray-100 mb-4">
            <router-link
              :to="{ name: 'article-detail', params: { id: article.id } }"
              class="hover:text-blue-300 transition-colors"
            >
              {{ article.article_name }}
            </router-link>
          </h2>
          <!-- Display image if it exists -->
          <div v-if="article.article_image_url" class="mb-6">
            <img
              :src="article.article_image_url"
              :alt="article.article_name"
              class="w-full object-cover rounded-lg"
            />
          </div>

          <div class="rich-content text-gray-300" v-html="sanitizeHtml(article.article_text)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useSupabaseArticleStore } from '@/stores/web/supabaseArticleStore'
import { useLanguageStore } from '@/stores/languageStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import { sanitizeHtml, stripHtml } from '@/utils/html'

const languageStore = useLanguageStore()

const props = defineProps({
  showFeaturedOnly: {
    type: Boolean,
    default: true
  },
  categoryId: {
    type: String,
    default: null
  },
  showLatestArticle: {
    type: Boolean,
    default: false
  }
})

const articleStore = useSupabaseArticleStore()

const allArticles = computed(() => articleStore.getArticles)

const articles = computed(() => {
  const articles = allArticles.value || []

  if (props.showFeaturedOnly) {
    return articles.filter(article => article.article_featured === true)
  } else if (props.categoryId) {
    return articles.filter(article => String(article.article_catagory_id) === props.categoryId)
  }
  return articles
})

const latestArticle = computed(() => {
  if (allArticles.value && allArticles.value.length > 0) {
    // Sort articles by created_at in descending order and take the first one
    return [...allArticles.value].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })[0]
  }
  return null
})

const isLoading = computed(() => articleStore.getIsLoading)
const error = computed(() => articleStore.getError)

const fetchArticles = async () => {
  await articleStore.fetchArticles()
}

// Watch for category changes
watch(() => props.categoryId, () => {
  fetchArticles()
})

// Re-fetch when the language changes
watch(() => languageStore.currentLanguage, () => {
  fetchArticles()
})

onMounted(async () => {
  await fetchArticles()
})
</script>
