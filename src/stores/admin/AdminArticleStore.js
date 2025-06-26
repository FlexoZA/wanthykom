import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSupabaseAdminArticleStore = defineStore('supabaseAdminArticle', () => {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchArticles = async () => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminArticleStore', 'Fetching articles')

      const { data, error: fetchError } = await supabase
        .from('article')
        .select(
          `
          id,
          article_name,
          article_text,
          article_image_url,
          article_featured,
          created_at,
          updated_at,
          enable
        `,
        )
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      articles.value = data || []
      console.log('DEBUG::supabaseAdminArticleStore', 'Articles fetched successfully', data)
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error fetching articles:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const getArticles = computed(() => articles.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)

  const createArticle = async (articleData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminArticleStore', 'Creating article:', articleData)

      const { data, error: createError } = await supabase
        .from('article')
        .insert([
          {
            article_name: articleData.article_name,
            article_text: articleData.article_text,
            article_image_url: articleData.article_image_url || null,
            article_featured: articleData.article_featured || false,
            enable: articleData.enable,
          },
        ])
        .select()

      if (createError) {
        throw createError
      }

      // Refresh the articles list
      await fetchArticles()
      console.log('DEBUG::supabaseAdminArticleStore', 'Article created successfully', data)
      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error creating article:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchArticle = async (articleId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminArticleStore', 'Fetching article:', articleId)

      const { data, error: fetchError } = await supabase
        .from('article')
        .select(
          `
          id,
          article_name,
          article_text,
          article_image_url,
          article_featured,
          created_at,
          updated_at,
          enable
        `,
        )
        .eq('id', articleId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      console.log('DEBUG::supabaseAdminArticleStore', 'Article fetched successfully', data)
      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error fetching article:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateArticle = async (articleId, articleData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminArticleStore', 'Starting article update:', {
        articleId,
        articleData,
      })

      const updatePayload = {
        article_name: articleData.article_name,
        article_text: articleData.article_text,
        article_image_url: articleData.article_image_url || null,
        article_featured: articleData.article_featured || false,
        enable: articleData.enable,
        updated_at: new Date().toISOString(),
      }

      console.log('DEBUG::supabaseAdminArticleStore', 'Update payload:', updatePayload)

      const { error: updateError } = await supabase
        .from('article')
        .update(updatePayload)
        .eq('id', articleId)

      if (updateError) {
        console.error('DEBUG::supabaseAdminArticleStore', 'Supabase update error:', updateError)
        throw updateError
      }

      console.log('DEBUG::supabaseAdminArticleStore', 'Article updated successfully')
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error updating article:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteArticle = async (articleId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminArticleStore', 'Deleting article:', articleId)

      const { error: deleteError } = await supabase.from('article').delete().eq('id', articleId)

      if (deleteError) {
        console.error('DEBUG::supabaseAdminArticleStore', 'Supabase delete error:', deleteError)
        throw deleteError
      }

      // Refresh the articles list
      await fetchArticles()
      console.log('DEBUG::supabaseAdminArticleStore', 'Article deleted successfully')
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error deleting article:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    fetchArticles,
    getArticles,
    getIsLoading,
    getError,
    createArticle,
    fetchArticle,
    updateArticle,
    deleteArticle,
  }
})
