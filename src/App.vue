<script setup>
// No props needed - using dynamic layout system
import { onMounted } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'

const languageStore = useLanguageStore()

// Reflect the active language on the root <html> element for accessibility/SEO.
onMounted(() => {
  document.documentElement.setAttribute('lang', languageStore.currentLanguage)
})
</script>

<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>
</template>

<style>
/* Global cursor styles */
button,
[role='button'],
a,
.cursor-pointer {
  cursor: pointer;
}

/* Disabled state */
button:disabled,
[role='button']:disabled,
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
