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
      <!-- Mirrors DefaultLayout's content row (content column + sidebar spacer)
           so the title lines up with the main content's left edge. -->
      <div class="flex w-full max-w-7xl mx-auto gap-0 md:gap-8 px-2 md:px-8">
        <router-link
          to="/"
          class="flex-1 w-full max-w-3xl mx-auto px-2 md:px-8 block"
        >
          <h1 class="text-3xl md:text-5xl font-bold mb-2 hover:text-blue-300 transition-colors">{{ languageStore.t('siteTitle') }}</h1>
          <h2 class="text-lg md:text-2xl font-light opacity-80">Jennifer Schoeman</h2>
        </router-link>
        <div class="hidden md:block w-56 min-w-[12rem]" aria-hidden="true"></div>
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
