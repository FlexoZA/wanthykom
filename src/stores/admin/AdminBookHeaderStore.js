import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSupabaseAdminBookHeaderStore = defineStore('supabaseAdminBookHeader', () => {
  const bookHeaders = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchBookHeaders = async (bookId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Fetching book headers for book:', bookId)

      if (!bookId) {
        console.log('DEBUG::supabaseAdminBookHeaderStore', 'No bookId provided, skipping fetch')
        bookHeaders.value = []
        return
      }

      const { data, error: fetchError } = await supabase
        .from('book_header')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      bookHeaders.value = data || []
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Book headers fetched successfully', data)
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Book headers count:', bookHeaders.value.length)
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookHeaderStore', 'Error fetching book headers:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const getBookHeaders = computed(() => bookHeaders.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)

  const createBookHeader = async (bookHeaderData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Creating book header:', bookHeaderData)

      const { data: bookHeaderResult, error: createError } = await supabase
        .from('book_header')
        .insert([
          {
            book_header_name: bookHeaderData.book_header_name,
            book_header_text: bookHeaderData.book_header_text,
            book_id: bookHeaderData.book_id,
            enable: bookHeaderData.enable || true,
            book_header_image_url: bookHeaderData.book_header_image_url || null,
          },
        ])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Book header created successfully:', bookHeaderResult)

      // Refresh the book headers list for this book
      await fetchBookHeaders(bookHeaderData.book_id)
      return bookHeaderResult
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookHeaderStore', 'Error creating book header:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchBookHeader = async (bookHeaderId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Fetching book header:', bookHeaderId)

      const { data, error: fetchError } = await supabase
        .from('book_header')
        .select('*')
        .eq('id', bookHeaderId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Book header fetched successfully', data)
      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookHeaderStore', 'Error fetching book header:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateBookHeader = async (bookHeaderId, bookHeaderData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Starting book header update:', {
        bookHeaderId,
        bookHeaderData,
      })

      const updatePayload = {
        book_header_name: bookHeaderData.book_header_name,
        book_header_text: bookHeaderData.book_header_text,
        enable: bookHeaderData.enable,
        book_header_image_url: bookHeaderData.book_header_image_url || null,
        updated_at: new Date().toISOString(),
      }

      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Update payload:', updatePayload)

      const { error: updateError } = await supabase
        .from('book_header')
        .update(updatePayload)
        .eq('id', bookHeaderId)

      if (updateError) {
        console.error('DEBUG::supabaseAdminBookHeaderStore', 'Supabase update error:', updateError)
        throw updateError
      }

      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Book header updated successfully')

      // Refresh the book headers list for this book
      await fetchBookHeaders(bookHeaderData.book_id)
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookHeaderStore', 'Error updating book header:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteBookHeader = async (bookHeaderId, bookId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Deleting book header:', bookHeaderId)

      const { error: deleteError } = await supabase.from('book_header').delete().eq('id', bookHeaderId)

      if (deleteError) {
        console.error('DEBUG::supabaseAdminBookHeaderStore', 'Supabase delete error:', deleteError)
        throw deleteError
      }

      // Refresh the book headers list for this book
      await fetchBookHeaders(bookId)
      console.log('DEBUG::supabaseAdminBookHeaderStore', 'Book header deleted successfully')
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminBookHeaderStore', 'Error deleting book header:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    fetchBookHeaders,
    getBookHeaders,
    getIsLoading,
    getError,
    createBookHeader,
    fetchBookHeader,
    updateBookHeader,
    deleteBookHeader,
  }
})
