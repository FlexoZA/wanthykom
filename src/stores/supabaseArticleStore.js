import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useSupabaseArticleStore = defineStore('supabaseArticle', {
  state: () => ({
    articles: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getArticles: (state) => state.articles,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },

  actions: {
    async fetchArticles() {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('article')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('DEBUG::supabaseArticleStore', 'Error fetching articles:', error)
          throw error
        }

        this.articles = data
      } catch (error) {
        console.error('DEBUG::supabaseArticleStore', 'Failed to fetch articles:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
