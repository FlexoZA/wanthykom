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
          .select(
            `
            article_name,
            article_text,
            article_image_url
          `,
          )
          .order('created_at', { ascending: false })

        console.log('DEBUG::supabaseArticleStore', this.article)

        if (error) {
          console.error('DEBUG::supabaseArticleStore', 'Error fetching articles:', error)
          throw error
        }

        this.articles = data
        console.log('DEBUG::supabaseArticleStore', 'Fetched articles with images:', data)
      } catch (error) {
        console.error('DEBUG::supabaseArticleStore', 'Failed to fetch articles:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
