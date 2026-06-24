<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-100">{{ article.article_name }}</h1>

    <div v-if="article.article_image_url">
      <img
        :src="article.article_image_url"
        :alt="article.article_name"
        class="w-full h-96 object-cover rounded-lg"
      />
    </div>

    <div class="rich-content text-gray-300" v-html="sanitizeHtml(article.article_text)"></div>
  </div>

</template>

<script setup>
import { sanitizeHtml } from '@/utils/html'

const { article } = defineProps({
  article: {
    type: Object,
    required: true,
  },
})
</script>


