import { defineStore } from 'pinia'
import {
  messages,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from '@/i18n/messages'

const STORAGE_KEY = 'wanthykom-language'

const readInitialLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored
    }
  } catch (err) {
    console.error('DEBUG::languageStore', 'Unable to read stored language', err)
  }
  return DEFAULT_LANGUAGE
}

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: readInitialLanguage(),
  }),

  getters: {
    currentLanguage: (state) => state.language,
    supportedLanguages: () => SUPPORTED_LANGUAGES,
    // Reactive translator: reading state.language here ties any component that
    // calls t() to language changes.
    t: (state) => (key) => {
      const dict = messages[state.language] || messages[DEFAULT_LANGUAGE]
      return dict[key] ?? messages[DEFAULT_LANGUAGE][key] ?? key
    },
  },

  actions: {
    setLanguage(lang) {
      if (!SUPPORTED_LANGUAGES.includes(lang) || lang === this.language) {
        return
      }
      this.language = lang
      try {
        localStorage.setItem(STORAGE_KEY, lang)
      } catch (err) {
        console.error('DEBUG::languageStore', 'Unable to persist language', err)
      }
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang)
      }
    },
  },
})
