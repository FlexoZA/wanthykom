<template>
    <div class="space-y-8">
      <div v-if="isLoading" class="text-gray-400">Loading Books...</div>
      <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>
      <div v-else>
        <div v-for="book in books" :key="book.id" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-100 mb-4">{{ book.book_name }}</h2>
          
          <!-- Book Image -->
          <div v-if="book.book_image && book.book_image.length > 0" class="mb-6">
            <img
              :src="book.book_image[0].book_image_url"
              :alt="book.book_name"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <!-- Chapters -->
          <div v-if="book.chapter && book.chapter.length > 0" class="space-y-8">
            <div v-for="chapter in book.chapter" :key="chapter.chapter_name" class="border-t border-gray-700 pt-6">
              <h3 class="text-xl font-semibold text-gray-200 mb-4">{{ chapter.chapter_name }}</h3>
              
              <!-- Chapter Image -->
              <div v-if="chapter.chapter_image && chapter.chapter_image.length > 0" class="mb-4">
                <img
                  :src="chapter.chapter_image[0].chapter_image_url"
                  :alt="chapter.chapter_name"
                  class="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <!-- Chapter Text -->
              <div class="prose prose-invert max-w-none">
                <p class="text-gray-300 whitespace-pre-wrap">{{ chapter.chapter_text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed } from 'vue'
  import { useSupabaseBookStore } from '@/stores/supabaseBookStore'
  
  const bookStore = useSupabaseBookStore()
  
  const books = computed(() => bookStore.getBooks)
  const isLoading = computed(() => bookStore.getIsLoading)
  const error = computed(() => bookStore.getError)
  
  onMounted(async () => {
    await bookStore.fetchBooks()
    console.log('DEBUG::BookList', books.value)
  })
  </script>
  