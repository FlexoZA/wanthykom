import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useLanguageStore } from '@/stores/languageStore'
import { CATEGORY_TRANSLATIONS } from '@/i18n/messages'

export const useSupabaseArticleCategoryStore = defineStore('supabaseArticleCategory', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getCategories: (state) => state.categories,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },

  actions: {
    // Fetch all categories that have enabled, non-featured articles
    async fetchCategoriesWithArticles() {
      this.isLoading = true
      this.error = null

      try {
        const language = useLanguageStore().currentLanguage

        const { data, error } = await supabase
          .from('article_catagory')
          .select(
            `
            id,
            catagory_name,
            article (
              id,
              article_name,
              article_featured,
              enable,
              language
            )
          `,
          )
          .eq('language', language)
          .eq('article.language', language)
          .order('catagory_name', { ascending: true })

        console.log('DEBUG::supabaseArticleCategoryStore', 'Categories query result:', data)

        if (error) {
          console.error('DEBUG::supabaseArticleCategoryStore', 'Error fetching categories:', error)
          throw error
        }

        // Filter categories that have at least one enabled, non-featured article
        const categoriesWithArticles = data.filter(category => {
          const hasEnabledNonFeaturedArticles = category.article.some(article =>
            article.enable === true && article.article_featured === false
          )
          return hasEnabledNonFeaturedArticles
        })

        this.categories = categoriesWithArticles || []
        console.log('DEBUG::supabaseArticleCategoryStore', 'Fetched categories with articles:', this.categories)
      } catch (error) {
        console.error('DEBUG::supabaseArticleCategoryStore', 'Failed to fetch categories:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Given a category id, return the id of the equivalent category in
    // `targetLang` (matched by translated catagory_name). Returns null if there
    // is no known counterpart in the target language.
    async equivalentCategoryId(categoryId, targetLang) {
      if (!categoryId) return null
      try {
        const { data: current, error: curErr } = await supabase
          .from('article_catagory')
          .select('catagory_name, slug')
          .eq('id', categoryId)
          .single()
        if (curErr || !current) return null

        // Preferred: match on the shared slug (data-driven, rename-safe).
        if (current.slug) {
          const { data: bySlug } = await supabase
            .from('article_catagory')
            .select('id')
            .eq('language', targetLang)
            .eq('slug', current.slug)
            .single()
          if (bySlug) return bySlug.id
        }

        // Fallback: hardcoded name map (for categories without a slug yet).
        const counterpart = CATEGORY_TRANSLATIONS[current.catagory_name?.trim()]
        if (!counterpart) return null
        const { data: byName } = await supabase
          .from('article_catagory')
          .select('id')
          .eq('language', targetLang)
          .eq('catagory_name', counterpart)
          .single()
        return byName?.id ?? null
      } catch (err) {
        console.error('DEBUG::supabaseArticleCategoryStore', 'equivalentCategoryId failed', err)
        return null
      }
    },
  },
})
