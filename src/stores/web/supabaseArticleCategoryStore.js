import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

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
              enable
            )
          `,
          )
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
  },
})
