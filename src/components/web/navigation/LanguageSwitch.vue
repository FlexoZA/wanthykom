<template>
  <div class="flex flex-col gap-2">
    <span class="text-xs uppercase tracking-wide text-gray-400 px-3">{{ languageStore.t('language') }}</span>
    <div class="flex gap-1 px-2" role="group" aria-label="Language switch">
      <button
        v-for="lang in languageStore.supportedLanguages"
        :key="lang"
        type="button"
        @click="switchLanguage(lang)"
        class="flex-1 py-1.5 px-3 rounded text-sm font-semibold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="lang === languageStore.currentLanguage
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
        :aria-pressed="lang === languageStore.currentLanguage"
      >
        {{ lang }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/languageStore'
import { useSupabaseArticleCategoryStore } from '@/stores/web/supabaseArticleCategoryStore'
import { useSupabaseBookStore } from '@/stores/web/supabaseBookStore'

const languageStore = useLanguageStore()
const categoryStore = useSupabaseArticleCategoryStore()
const bookStore = useSupabaseBookStore()
const route = useRoute()
const router = useRouter()

const switchLanguage = async (lang) => {
  if (lang === languageStore.currentLanguage) return

  // Categories and books are separate per-language DB rows, so the same URL key
  // won't match after switching. Resolve the equivalent (by shared slug) first.
  const onCategoryPage =
    route.name === 'articles-by-category' && route.params.categoryId
  const onBookPage = route.name === 'books' && route.query.book

  let targetCategoryId = null
  let targetBook = null
  if (onCategoryPage) {
    targetCategoryId = await categoryStore.equivalentCategoryId(
      route.params.categoryId,
      lang,
    )
  } else if (onBookPage) {
    targetBook = await bookStore.equivalentBookLocation(
      route.query.book,
      route.query.chapter,
      lang,
    )
  }

  languageStore.setLanguage(lang)

  if (onCategoryPage) {
    // Jump to the matching category, or the landing page if none exists.
    router.replace(
      targetCategoryId
        ? { name: 'articles-by-category', params: { categoryId: String(targetCategoryId) } }
        : '/',
    )
  } else if (onBookPage) {
    // Open the equivalent book, carrying the chapter across when it maps; if
    // there's no counterpart book, go to the book selection prompt.
    if (targetBook?.bookName) {
      const query = { book: targetBook.bookName }
      if (targetBook.chapterName) query.chapter = targetBook.chapterName
      router.replace({ name: 'books', query })
    } else {
      router.replace({ name: 'books' })
    }
  }
}
</script>
