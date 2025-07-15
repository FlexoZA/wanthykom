import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useSupabaseArticleStore = defineStore('supabaseArticle', {
  state: () => ({
    articles: [],
    featuredArticles: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getArticles: (state) => state.articles,
    getFeaturedArticles: (state) => state.featuredArticles,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },

  actions: {
    // Fetch only featured and enabled articles for home page
    async fetchFeaturedArticles() {
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
            enable
          `,
          )
          .eq('article_featured', true)
          .eq('enable', true)
          .order('created_at', { ascending: false })

        console.log('DEBUG::supabaseArticleStore', 'Featured articles query result:', data)

        if (error) {
          console.error('DEBUG::supabaseArticleStore', 'Error fetching featured articles:', error)
          throw error
        }

        this.featuredArticles = data || []
        console.log('DEBUG::supabaseArticleStore', 'Fetched featured articles:', data)
      } catch (error) {
        console.error('DEBUG::supabaseArticleStore', 'Failed to fetch featured articles:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Fetch only non-featured but enabled articles for articles page
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
            article_catagory (
              id,
              catagory_name
            )
          `,
          )
          .eq('article_featured', false)
          .eq('enable', true)
          .order('created_at', { ascending: false })

        console.log('DEBUG::supabaseArticleStore', 'Non-featured articles query result:', data)

        if (error) {
          console.error('DEBUG::supabaseArticleStore', 'Error fetching non-featured articles:', error)
          throw error
        }

        this.articles = data || []
        console.log('DEBUG::supabaseArticleStore', 'Fetched non-featured articles:', data)
      } catch (error) {
        console.error('DEBUG::supabaseArticleStore', 'Failed to fetch non-featured articles:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Fetch articles by category (non-featured and enabled only)
    async fetchArticlesByCategory(categoryId) {
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
            article_catagory (
              id,
              catagory_name
            )
          `,
          )
          .eq('article_catagory_id', categoryId)
          .eq('article_featured', false)
          .eq('enable', true)
          .order('created_at', { ascending: false })

        console.log('DEBUG::supabaseArticleStore', 'Articles by category query result:', data)

        if (error) {
          console.error('DEBUG::supabaseArticleStore', 'Error fetching articles by category:', error)
          throw error
        }

        this.articles = data || []
        console.log('DEBUG::supabaseArticleStore', 'Fetched articles by category:', data)
      } catch (error) {
        console.error('DEBUG::supabaseArticleStore', 'Failed to fetch articles by category:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
