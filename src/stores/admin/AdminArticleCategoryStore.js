import { supabase } from '@/lib/supabase'

export const useSupabaseAdminArticleCategoryStore = () => {
  const fetchCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('article_catagory')
        .select('*')
        .order('catagory_name', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      return data || []
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleCategoryStore', 'Error fetching categories:', err)
      throw err
    }
  }

  const createCategory = async (categoryData) => {
    try {
      const { data, error: createError } = await supabase
        .from('article_catagory')
        .insert([
          {
            catagory_name: categoryData.catagory_name,
          },
        ])
        .select()

      if (createError) {
        throw createError
      }

      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleCategoryStore', 'Error creating category:', err)
      throw err
    }
  }

  const fetchCategory = async (categoryId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('article_catagory')
        .select('*')
        .eq('id', categoryId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleCategoryStore', 'Error fetching category:', err)
      throw err
    }
  }

  const updateCategory = async (categoryId, categoryData) => {
    try {
      const { error: updateError } = await supabase
        .from('article_catagory')
        .update({
          catagory_name: categoryData.catagory_name,
        })
        .eq('id', categoryId)

      if (updateError) {
        throw updateError
      }

      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleCategoryStore', 'Error updating category:', err)
      throw err
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const { error: deleteError } = await supabase
        .from('article_catagory')
        .delete()
        .eq('id', categoryId)

      if (deleteError) {
        throw deleteError
      }

      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminArticleCategoryStore', 'Error deleting category:', err)
      throw err
    }
  }

  return {
    fetchCategories,
    createCategory,
    fetchCategory,
    updateCategory,
    deleteCategory,
  }
}
