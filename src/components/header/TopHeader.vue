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
      <div class="w-full max-w-7xl mx-auto px-2 md:px-8">
        <h1 class="text-3xl md:text-5xl font-bold mb-2">Want hy kom</h1>
        <h2 class="text-lg md:text-2xl font-light opacity-80">Joshua 1:2</h2>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUnsplashImageStore } from '@/stores/unsplashImageStore'

const imageStore = useUnsplashImageStore()

onMounted(async () => {
  console.log('Header mounted, fetching image...')
  await imageStore.fetchRandomImage()
  console.log('Current image after fetch:', imageStore.currentImage)
})
</script>
