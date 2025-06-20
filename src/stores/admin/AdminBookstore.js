import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSupabaseAdminBookStore = defineStore('supabaseAdminBook', () => {
  const books = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchBooks = async () => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookStore', 'Fetching books')

      const { data, error: fetchError } = await supabase
        .from('book')
        .select(
          `
          id,
          book_name,
          created_at,
          enable,
          book_image (
            id,
            book_image_url
          ),
          book_header (
            id,
            book_header_name,
            book_header_text
          ),
          chapter (
            id,
            chapter_name,
            chapter_text,
            created_at,
            chapter_image (
              id,
              chapter_image_url
            )
          )
        `,
        )
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      books.value = data || []
      console.log('DEBUG::supabaseAdminBookStore', 'Books fetched successfully', data)
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookStore', 'Error fetching books:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const getBooks = computed(() => books.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)

  const createBook = async (bookData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookStore', 'Creating book:', bookData)

      const { data, error: createError } = await supabase
        .from('book')
        .insert([
          {
            book_name: bookData.book_name,
          },
        ])
        .select()

      if (createError) {
        throw createError
      }

      // Refresh the books list
      await fetchBooks()
      console.log('DEBUG::supabaseAdminBookStore', 'Book created successfully', data)
      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookStore', 'Error creating book:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchBook = async (bookId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookStore', 'Fetching book:', bookId)

      const { data, error: fetchError } = await supabase
        .from('book')
        .select(
          `
          id,
          book_name,
          created_at,
          enable,
          book_image (
            id,
            book_image_url
          ),
          book_header (
            id,
            book_header_name,
            book_header_text
          ),
          chapter (
            id,
            chapter_name,
            chapter_text,
            created_at,
            chapter_image (
              id,
              chapter_image_url
            )
          )
        `,
        )
        .eq('id', bookId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      console.log('DEBUG::supabaseAdminBookStore', 'Book fetched successfully', data)
      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookStore', 'Error fetching book:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateBook = async (bookId, bookData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookStore', 'Starting book update:', {
        bookId,
        bookData,
      })

      const updatePayload = {
        book_name: bookData.book_name,
        enable: bookData.enable,
      }

      console.log('DEBUG::supabaseAdminBookStore', 'Update payload:', updatePayload)

      const { error: updateError } = await supabase
        .from('book')
        .update(updatePayload)
        .eq('id', bookId)

      if (updateError) {
        console.error('DEBUG::supabaseAdminBookStore', 'Supabase update error:', updateError)
        throw updateError
      }

      console.log('DEBUG::supabaseAdminBookStore', 'Book updated successfully')
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookStore', 'Error updating book:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteBook = async (bookId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookStore', 'Deleting book:', bookId)

      const { error: deleteError } = await supabase.from('book').delete().eq('id', bookId)

      if (deleteError) {
        console.error('DEBUG::supabaseAdminBookStore', 'Supabase delete error:', deleteError)
        throw deleteError
      }

      // Refresh the books list
      await fetchBooks()
      console.log('DEBUG::supabaseAdminBookStore', 'Book deleted successfully')
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookStore', 'Error deleting book:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    fetchBooks,
    getBooks,
    getIsLoading,
    getError,
    createBook,
    fetchBook,
    updateBook,
    deleteBook,
  }
})
