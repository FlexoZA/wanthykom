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
      console.log("DEBUG::supabaseAdminArticleStore", "Fetching articles")

      const { data, error: fetchError } = await supabase
        .from('article')
        .select(`
          id,
          article_name,
          article_text,
          created_at,
          updated_at,
          enable,
          article_image (
            id,
            article_image_url
          )
        `)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      articles.value = data || []
      console.log("DEBUG::supabaseAdminArticleStore", "Articles fetched successfully", data)
    } catch (err) {
      console.error("DEBUG::supabaseAdminArticleStore", "Error fetching articles:", err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const getArticles = computed(() => articles.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)

  return {
    fetchArticles,
    getArticles,
    getIsLoading,
    getError
  }
})
