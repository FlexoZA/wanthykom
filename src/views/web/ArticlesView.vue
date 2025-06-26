<template>
  <div class="relative">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-100 mb-2">Drome en Gesigte</h1>
      <p class="text-gray-400">Ontdek meer verhale en insigte</p>
    </div>
    <ArticleList :show-featured-only="false" />
  </div>
</template>

<script setup>
import ArticleList from '@/components/web/article/ArticleList.vue'
</script>
