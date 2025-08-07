<template>
  <!-- Mobile Hamburger Menu Button -->
  <button
    @click="toggleMobileMenu"
    class="md:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
    aria-label="Toggle navigation menu"
  >
    <svg
      class="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-if="!isMobileMenuOpen"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
  </button>

  <!-- Mobile Menu Overlay -->
  <div
    v-if="isMobileMenuOpen"
    class="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
    @click="closeMobileMenu"
  ></div>

  <!-- Desktop Navigation Menu -->
  <nav class="hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56 min-w-[12rem] border-l border-gray-700 sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto">
    <!-- Back to landing page -->
    <RouterLink
      to="/"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
    >
      Voorwoord
    </RouterLink>

    <!-- Article Categories as Main Menu Items -->
    <RouterLink
      v-for="category in categories"
      :key="category.id"
      :to="{ name: 'articles-by-category', params: { categoryId: category.id } }"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
    >
      {{ category.catagory_name }}
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
            {{ formatNavigationText(chapter.chapter_name) }}
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Navigation Menu -->
  <nav
    v-if="isMobileMenuOpen"
    class="md:hidden fixed top-0 right-0 h-full w-80 max-w-[80vw] z-50 overflow-y-auto flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 border-l border-gray-700"
  >
    <!-- Mobile Menu Header -->
    <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
      <h2 class="text-lg font-semibold">Menu</h2>
      <button
        @click="closeMobileMenu"
        class="p-1 hover:bg-gray-700 rounded"
        aria-label="Close menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Back to landing page -->
    <RouterLink
      to="/"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
      @click="closeMobileMenu"
    >
      Voorwoord
    </RouterLink>

    <!-- Article Categories as Main Menu Items -->
    <RouterLink
      v-for="category in categories"
      :key="category.id"
      :to="{ name: 'articles-by-category', params: { categoryId: category.id } }"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
      @click="closeMobileMenu"
    >
      {{ category.catagory_name }}
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
            @click.stop="closeMobileMenu"
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
            @click="closeMobileMenu"
          >
            {{ formatNavigationText(chapter.chapter_name) }}
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
import { useSupabaseArticleCategoryStore } from '@/stores/web/supabaseArticleCategoryStore'

const route = useRoute()
const bookStore = useSupabaseBookStore()
const categoryStore = useSupabaseArticleCategoryStore()
const books = computed(() => bookStore.getBooks)
const categories = computed(() => categoryStore.getCategories)
const expandedBooks = ref({})
const isMobileMenuOpen = ref(false)

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

const toggleMobileMenu = () => {
  console.log("DEBUG::VerticalNav", "Toggling mobile menu", { currentState: isMobileMenuOpen.value })
  isMobileMenuOpen.value = !isMobileMenuOpen.value

  // Prevent body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  console.log("DEBUG::VerticalNav", "Closing mobile menu")
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Format text to capitalize only first letter and limit to 18 characters
const formatNavigationText = (text) => {
  if (!text) return ''

  // Find the first letter (skip numbers, dots, spaces)
  const firstLetterIndex = text.search(/[a-zA-Z]/)
  if (firstLetterIndex === -1) return text // No letters found

  // Keep everything before the first letter as is, capitalize the first letter, lowercase the rest
  const beforeFirstLetter = text.substring(0, firstLetterIndex)
  const firstLetter = text.charAt(firstLetterIndex).toUpperCase()
  const afterFirstLetter = text.substring(firstLetterIndex + 1).toLowerCase()

  const formatted = beforeFirstLetter + firstLetter + afterFirstLetter
  return formatted.length > 18 ? formatted.substring(0, 18) + "..." : formatted
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

// Close mobile menu when route changes
watch(() => route.path, () => {
  closeMobileMenu()
})

// Close mobile menu on window resize to desktop size
const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(async () => {
  await bookStore.fetchBooks()
  await categoryStore.fetchCategoriesWithArticles()
  // Expand the current book if one is selected
  if (route.query.book) {
    expandedBooks.value[route.query.book] = true
  }

  // Add resize listener
  window.addEventListener('resize', handleResize)
})

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>
