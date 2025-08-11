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
            id,
            article_name,
            article_text,
            article_image_url,
            article_featured,
            enable,
            created_at,
            article_catagory_id,
            article_catagory (
              id,
              catagory_name
            )
          `,
          )
          .eq('enable', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        this.articles = data || []
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
