<template>
  <div class="flex flex-col gap-2">
    <span class="text-xs uppercase tracking-wide text-gray-400 px-3">{{ languageStore.t('language') }}</span>
    <div class="flex gap-1 px-2" role="group" aria-label="Language switch">
      <button
        v-for="lang in languageStore.supportedLanguages"
        :key="lang"
        type="button"
        @click="languageStore.setLanguage(lang)"
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
import { useLanguageStore } from '@/stores/languageStore'

const languageStore = useLanguageStore()
</script>
