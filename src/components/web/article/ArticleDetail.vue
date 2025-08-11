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

    <div class="prose prose-invert max-w-none">
      <p class="text-gray-300 whitespace-pre-wrap">{{ article.article_text }}</p>
    </div>
  </div>

</template>

<script setup>
const { article } = defineProps({
  article: {
    type: Object,
    required: true,
  },
})
</script>


