import { supabase } from '@/lib/supabase'

export const useSupabaseAdminArticleStore = () => {
  const fetchArticles = async () => {
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
          created_at,
          updated_at,
          enable,
          article_catagory (
            id,
            catagory_name
          )
        `,
        )
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      return data || []
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error fetching articles:', err)
      throw err
    }
  }

  const createArticle = async (articleData) => {
    try {
      const { data, error: createError } = await supabase
        .from('article')
        .insert([
          {
            article_name: articleData.article_name,
            article_text: articleData.article_text,
            article_image_url: articleData.article_image_url || null,
            article_featured: articleData.article_featured || false,
            article_catagory_id: articleData.article_catagory_id || null,
            enable: articleData.enable,
          },
        ])
        .select()

      if (createError) {
        throw createError
      }

      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error creating article:', err)
      throw err
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
      const updatePayload = {
        article_name: articleData.article_name,
        article_text: articleData.article_text,
        article_image_url: articleData.article_image_url || null,
        article_featured: articleData.article_featured || false,
        article_catagory_id: articleData.article_catagory_id || null,
        enable: articleData.enable,
        updated_at: new Date().toISOString(),
      }

      const { error: updateError } = await supabase
        .from('article')
        .update(updatePayload)
        .eq('id', articleId)

      if (updateError) {
        throw updateError
      }

      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error updating article:', err)
      throw err
    }
  }

  const deleteArticle = async (articleId) => {
    try {
      const { error: deleteError } = await supabase.from('article').delete().eq('id', articleId)

      if (deleteError) {
        throw deleteError
      }

      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleStore', 'Error deleting article:', err)
      throw err
    }
  }

  return {
    fetchArticles,
    createArticle,
    fetchArticle,
    updateArticle,
    deleteArticle,
  }
}
