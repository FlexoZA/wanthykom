<template>
    <div class="space-y-8">
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <LoadingAnimation />
      </div>
      <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>
      <div v-else-if="!selectedBook" class="text-gray-400">Select a book from the navigation</div>
      <div v-else>
        <div class="mb-12">
          <!-- Book Title -->
          <h2 class="text-2xl font-bold text-gray-100 mb-4">{{ selectedBook.book_name }}</h2>

          <!-- Book Image -->
          <div v-if="selectedBook.book_image_url" class="mb-6">
            <img
              :src="selectedBook.book_image_url"
              :alt="selectedBook.book_name"
              class="w-full h-80 object-cover rounded-lg"
            />
          </div>

          <!-- Book Headers -->
          <div v-if="selectedBook.book_header && selectedBook.book_header.length > 0" class="mb-6 space-y-4">
            <div v-for="header in selectedBook.book_header" :key="header.book_header_name" class="bg-gray-800 p-4 rounded-lg">
              <!-- Header Name -->
              <h3 class="text-lg font-semibold text-gray-200 mb-4">{{ header.book_header_name }}</h3>

              <!-- Header Image -->
              <div v-if="header.book_header_image_url" class="mb-4">
                <img
                  :src="header.book_header_image_url"
                  :alt="header.book_header_name"
                  class="w-full h-60 object-cover rounded-lg"
                />
              </div>

              <!-- Header Text -->
              <div class="prose prose-invert max-w-none">
                <p class="text-gray-300 whitespace-pre-wrap">{{ header.book_header_text }}</p>
              </div>
            </div>
          </div>

          <!-- Chapters -->
          <div v-if="selectedBook.chapter && selectedBook.chapter.length > 0" class="space-y-8">
            <div
              v-for="chapter in selectedBook.chapter"
              :key="chapter.chapter_name"
              class="border-t border-gray-700 pt-6"
              :ref="el => { if (el) chapterRefs[chapter.chapter_name] = el }"
            >
              <h3 class="text-xl font-semibold text-gray-200 mb-4">{{ chapter.chapter_name }}</h3>

              <!-- Chapter Image -->
              <div v-if="chapter.book_chapter_image_url" class="mb-4">
                <img
                  :src="chapter.book_chapter_image_url"
                  :alt="chapter.chapter_name"
                  class="w-full h-full object-cover rounded-lg"
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
  import { onMounted, computed, watch, ref, onUnmounted, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSupabaseBookStore } from '@/stores/web/supabaseBookStore'
  import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

  const route = useRoute()
  const router = useRouter()
  const bookStore = useSupabaseBookStore()
  const chapterRefs = ref({})
  const activeChapter = ref(null)

  const books = computed(() => bookStore.getBooks)
  const selectedBook = computed(() => bookStore.getSelectedBook)
  const isLoading = computed(() => bookStore.getIsLoading)
  const error = computed(() => bookStore.getError)

  const scrollToChapter = (chapterName) => {
    if (chapterRefs.value[chapterName]) {
      chapterRefs.value[chapterName].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Simple scroll-based active chapter detection
  const updateActiveChapter = () => {
    if (!selectedBook.value?.chapter) return

    const chapters = selectedBook.value.chapter
    let activeChapterName = null

    // Get current scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Check each chapter's position (reverse order to find the last one that's passed)
    for (let i = chapters.length - 1; i >= 0; i--) {
      const chapter = chapters[i]
      const chapterEl = chapterRefs.value[chapter.chapter_name]

      if (chapterEl) {
        const offsetTop = chapterEl.offsetTop - 150 // 150px offset from top

        if (scrollTop >= offsetTop) {
          activeChapterName = chapter.chapter_name
          break
        }
      }
    }

    if (activeChapterName && activeChapterName !== activeChapter.value) {
      activeChapter.value = activeChapterName

      // Update URL without triggering navigation
      const newQuery = { ...route.query, chapter: activeChapterName }
      router.replace({ query: newQuery })
    }
  }

  // Throttled scroll handler
  let scrollTimeout = null
  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    scrollTimeout = setTimeout(updateActiveChapter, 100)
  }

  // Watch for route changes to scroll to the correct chapter
  watch(() => route.query.chapter, (newChapter) => {
    if (newChapter && newChapter !== activeChapter.value) {
      activeChapter.value = newChapter
      // Small delay to ensure the DOM is updated
      setTimeout(() => {
        scrollToChapter(newChapter)
      }, 100)
    }
  }, { immediate: true })

  // Watch for route changes to select the correct book
  watch(() => route.query.book, (newBookName) => {
    if (newBookName && books.value) {
      const book = books.value.find(b => b.book_name === newBookName)
      if (book) {
        bookStore.setSelectedBook(book)
      }
    }
  }, { immediate: true })

  // Watch for selected book changes to setup scroll listener
  watch(() => selectedBook.value, (newBook) => {
    // Remove existing scroll listener
    window.removeEventListener('scroll', handleScroll)

    if (newBook && newBook.chapter) {
      // Wait for DOM to update, then setup scroll listener
      nextTick(() => {
        setTimeout(() => {
          updateActiveChapter()
          window.addEventListener('scroll', handleScroll)
        }, 200)
      })
    }
  }, { immediate: true })

  onMounted(async () => {
    await bookStore.fetchBooks()
    // If there's a book in the URL query, select it
    if (route.query.book && books.value) {
      const book = books.value.find(b => b.book_name === route.query.book)
      if (book) {
        bookStore.setSelectedBook(book)
      }
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
  })
  </script>
