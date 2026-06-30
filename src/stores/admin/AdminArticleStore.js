import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSupabaseAdminArticleStore = defineStore('supabaseAdminArticle', () => {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Pagination + filter state. Kept in the store so it survives SPA navigation
  // (e.g. editing an article and returning lands on the same page/filter).
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const languageFilter = ref('all') // 'all' | 'af' | 'en'

  const fetchArticles = async () => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminArticleStore', 'Fetching articles', {
        page: currentPage.value,
        pageSize: pageSize.value,
        language: languageFilter.value,
      })

      const from = (currentPage.value - 1) * pageSize.value
      const to = from + pageSize.value - 1

      let query = supabase
        .from('article')
        .select(
          `
          id,
          article_name,
          article_text,
          article_image_url,
          article_featured,
          article_catagory_id,
          language,
          created_at,
          updated_at,
          enable,
          article_catagory (
            id,
            catagory_name
          )
        `,
          { count: 'exact' },
        )
        .order('created_at', { ascending: false })
        .range(from, to)

      if (languageFilter.value !== 'all') {
        query = query.eq('language', languageFilter.value)
      }

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        throw fetchError
      }

      totalCount.value = count || 0

      // If the current page is now empty (e.g. after deleting the last item on
      // the last page), step back a page and refetch.
      if ((data || []).length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
        return fetchArticles()
      }

      articles.value = data || []
      console.log('DEBUG::supabaseAdminArticleStore', 'Articles fetched successfully', {
        count: totalCount.value,
        returned: articles.value.length,
      })
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error fetching articles:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const setPage = async (page) => {
    console.log('DEBUG::supabaseAdminArticleStore', 'Set page:', page)
    currentPage.value = page
    await fetchArticles()
  }

  const setLanguageFilter = async (language) => {
    console.log('DEBUG::supabaseAdminArticleStore', 'Set language filter:', language)
    languageFilter.value = language
    currentPage.value = 1 // reset to first page when the filter changes
    await fetchArticles()
  }

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
            article_catagory_id: articleData.article_catagory_id || null,
            language: articleData.language || 'af',
            enable: articleData.enable,
          },
        ])
        .select()

      if (createError) {
        throw createError
      }

      console.log('DEBUG::supabaseAdminArticleStore', 'Article created successfully:', data)

      // Refresh the articles list
      await fetchArticles()
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
      const { data, error: fetchError } = await supabase
        .from('article')
        .select(
          `
          id,
          article_name,
          article_text,
          article_image_url,
          article_featured,
          article_catagory_id,
          language,
          created_at,
          updated_at,
          enable,
          article_catagory (
            id,
            catagory_name
          )
        `,
        )
        .eq('id', articleId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error fetching article:', err)
      throw err
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
        article_catagory_id: articleData.article_catagory_id || null,
        language: articleData.language || 'af',
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

      // Refresh the articles list
      await fetchArticles()
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

  const getArticles = computed(() => articles.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)
  const getTotalCount = computed(() => totalCount.value)
  const getCurrentPage = computed(() => currentPage.value)
  const getPageSize = computed(() => pageSize.value)
  const getLanguageFilter = computed(() => languageFilter.value)
  const getTotalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / pageSize.value)),
  )

  return {
    fetchArticles,
    createArticle,
    fetchArticle,
    updateArticle,
    deleteArticle,
    setPage,
    setLanguageFilter,
    getArticles,
    getIsLoading,
    getError,
    getTotalCount,
    getCurrentPage,
    getPageSize,
    getLanguageFilter,
    getTotalPages,
  }
})
