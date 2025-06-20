<template>
  <nav
    class="hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56 min-w-[12rem] border-l border-gray-700 sticky top-0 h-[calc(100vh-4rem)]"
  >
    <!-- Back to landing page -->
    <RouterLink
      to="/"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
    >
      Voorwoord
    </RouterLink>

    <!-- Book Links with Chapter Dropdowns -->
    <div v-for="book in books" :key="book.book_name" class="mb-4">
      <div class="flex flex-col">
        <!-- Book Link -->
        <div
          class="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700 transition-colors cursor-pointer"
          :class="{ 'bg-gray-700': isBookActive(book.book_name) }"
          @click="toggleBook(book.book_name)"
        >
          <RouterLink
            :to="{ name: 'books', query: { book: book.book_name }}"
            class="font-semibold flex-grow"
            @click.stop
          >
            {{ book.book_name }}
          </RouterLink>
          <span class="ml-2">
            {{ expandedBooks[book.book_name] ? '▼' : '▶' }}
          </span>
        </div>

        <!-- Chapter Links -->
        <div
          v-if="expandedBooks[book.book_name] && book.chapter"
          class="ml-4 mt-2 space-y-1"
        >
          <RouterLink
            v-for="chapter in book.chapter"
            :key="chapter.chapter_name"
            :to="{ name: 'books', query: { book: book.book_name, chapter: chapter.chapter_name }}"
            class="block py-1 px-3 rounded hover:bg-gray-700 transition-colors text-sm"
            :class="{ 'bg-gray-700': isChapterActive(book.book_name, chapter.chapter_name) }"
          >
            {{ chapter.chapter_name }}
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useSupabaseBookStore } from '@/stores/web/supabaseBookStore'

const route = useRoute()
const bookStore = useSupabaseBookStore()
const books = computed(() => bookStore.getBooks)
const expandedBooks = ref({})

const isBookActive = (bookName) => {
  return route.name === 'books' && route.query.book === bookName
}

const isChapterActive = (bookName, chapterName) => {
  return route.name === 'books' &&
         route.query.book === bookName &&
         route.query.chapter === chapterName
}

const toggleBook = (bookName) => {
  // Close all other books
  Object.keys(expandedBooks.value).forEach(key => {
    if (key !== bookName) {
      expandedBooks.value[key] = false
    }
  })
  // Toggle the clicked book
  expandedBooks.value[bookName] = !expandedBooks.value[bookName]
}

// Watch for route changes to automatically expand the selected book
watch(() => route.query.book, (newBook) => {
  if (newBook) {
    // Close all other books
    Object.keys(expandedBooks.value).forEach(key => {
      if (key !== newBook) {
        expandedBooks.value[key] = false
      }
    })
    // Expand the selected book
    expandedBooks.value[newBook] = true
  } else {
    // If no book is selected, close all books
    Object.keys(expandedBooks.value).forEach(key => {
      expandedBooks.value[key] = false
    })
  }
}, { immediate: true })

onMounted(async () => {
  await bookStore.fetchBooks()
  // Expand the current book if one is selected
  if (route.query.book) {
    expandedBooks.value[route.query.book] = true
  }
})
</script>
