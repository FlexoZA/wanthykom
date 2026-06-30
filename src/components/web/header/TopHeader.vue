<template>
  <header class="w-full h-48 text-white shadow-md relative overflow-hidden">
    <div v-if="imageStore.currentImage" class="absolute inset-0">
      <img
        :src="imageStore.currentImage.url"
        :alt="imageStore.currentImage.alt"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-800/80"></div>
    </div>
    <div v-else class="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-700"></div>

    <div class="absolute inset-0 flex items-center">
      <div class="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8">
        <router-link to="/" class="block">
          <h1 class="text-3xl md:text-5xl font-bold mb-2 hover:text-blue-300 transition-colors">{{ languageStore.t('siteTitle') }}</h1>
        </router-link>
        <h2 class="text-lg md:text-2xl font-light opacity-80">Jennifer Schoeman</h2>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUnsplashImageStore } from '@/stores/web/unsplashImageStore'
import { useLanguageStore } from '@/stores/languageStore'

const imageStore = useUnsplashImageStore()
const languageStore = useLanguageStore()

onMounted(async () => {
  await imageStore.fetchRandomImage()
})
</script>
