import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSupabaseAdminChapterStore = defineStore('supabaseAdminChapter', () => {
  const chapters = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchChapters = async (bookId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminChapterStore', 'Fetching chapters for book:', bookId)

      if (!bookId) {
        console.log('DEBUG::supabaseAdminChapterStore', 'No bookId provided, skipping fetch')
        chapters.value = []
        return
      }

      const { data, error: fetchError } = await supabase
        .from('chapter')
        .select('*')
        .eq('book_id', bookId)
        .order('sort_order', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      chapters.value = data || []
      console.log('DEBUG::supabaseAdminChapterStore', 'Chapters fetched successfully', data)
      console.log('DEBUG::supabaseAdminChapterStore', 'Chapters count:', chapters.value.length)
    } catch (err) {
      console.error('DEBUG::supabaseAdminChapterStore', 'Error fetching chapters:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const getChapters = computed(() => chapters.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)

  const createChapter = async (chapterData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminChapterStore', 'Creating chapter:', chapterData)

      // Calculate next available sort_order for this book
      const { data: existingChapters, error: fetchError } = await supabase
        .from('chapter')
        .select('sort_order')
        .eq('book_id', chapterData.book_id)
        .order('sort_order', { ascending: false })
        .limit(1)

      if (fetchError) {
        console.error('DEBUG::supabaseAdminChapterStore', 'Error fetching max sort_order:', fetchError)
        throw fetchError
      }

      const nextSortOrder = existingChapters.length > 0 ? (existingChapters[0].sort_order || 0) + 1 : 1
      console.log('DEBUG::supabaseAdminChapterStore', 'Next sort_order:', nextSortOrder)

      const { data: chapterResult, error: createError } = await supabase
        .from('chapter')
        .insert([
          {
            chapter_name: chapterData.chapter_name,
            chapter_text: chapterData.chapter_text,
            book_id: chapterData.book_id,
            enable: chapterData.enable || true,
            book_chapter_image_url: chapterData.book_chapter_image_url || null,
            sort_order: nextSortOrder,
          },
        ])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      console.log('DEBUG::supabaseAdminChapterStore', 'Chapter created successfully:', chapterResult)

      // Refresh the chapters list for this book
      await fetchChapters(chapterData.book_id)
      return chapterResult
    } catch (err) {
      console.error('DEBUG::supabaseAdminChapterStore', 'Error creating chapter:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchChapter = async (chapterId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminChapterStore', 'Fetching chapter:', chapterId)

      const { data, error: fetchError } = await supabase
        .from('chapter')
        .select('*')
        .eq('id', chapterId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      console.log('DEBUG::supabaseAdminChapterStore', 'Chapter fetched successfully', data)
      return data
    } catch (err) {
      console.error('DEBUG::supabaseAdminChapterStore', 'Error fetching chapter:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateChapter = async (chapterId, chapterData) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminChapterStore', 'Starting chapter update:', {
        chapterId,
        chapterData,
      })

      const updatePayload = {
        chapter_name: chapterData.chapter_name,
        chapter_text: chapterData.chapter_text,
        enable: chapterData.enable,
        book_chapter_image_url: chapterData.book_chapter_image_url || null,
        sort_order: chapterData.sort_order,
        updated_at: new Date().toISOString(),
      }

      console.log('DEBUG::supabaseAdminChapterStore', 'Update payload:', updatePayload)

      const { error: updateError } = await supabase
        .from('chapter')
        .update(updatePayload)
        .eq('id', chapterId)

      if (updateError) {
        console.error('DEBUG::supabaseAdminChapterStore', 'Supabase update error:', updateError)
        throw updateError
      }

      console.log('DEBUG::supabaseAdminChapterStore', 'Chapter updated successfully')

      // Refresh the chapters list for this book
      await fetchChapters(chapterData.book_id)
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminChapterStore', 'Error updating chapter:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteChapter = async (chapterId, bookId) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminChapterStore', 'Deleting chapter:', chapterId)

      const { error: deleteError } = await supabase.from('chapter').delete().eq('id', chapterId)

      if (deleteError) {
        console.error('DEBUG::supabaseAdminChapterStore', 'Supabase delete error:', deleteError)
        throw deleteError
      }

      // Refresh the chapters list for this book
      await fetchChapters(bookId)
      console.log('DEBUG::supabaseAdminChapterStore', 'Chapter deleted successfully')
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminChapterStore', 'Error deleting chapter:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const reorderChapters = async (bookId, reorderedChapters) => {
    try {
      isLoading.value = true
      error.value = null
      console.log('DEBUG::supabaseAdminChapterStore', 'Reordering chapters:', { bookId, reorderedChapters })

      // Update sort_order for each chapter in batch
      const updates = reorderedChapters.map((chapter, index) => ({
        id: chapter.id,
        sort_order: index + 1
      }))

      console.log('DEBUG::supabaseAdminChapterStore', 'Batch updates:', updates)

      // Execute batch updates
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('chapter')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)

        if (updateError) {
          console.error('DEBUG::supabaseAdminChapterStore', 'Error updating chapter sort_order:', updateError)
          throw updateError
        }
      }

      console.log('DEBUG::supabaseAdminChapterStore', 'Chapters reordered successfully')

      // Refresh the chapters list
      await fetchChapters(bookId)
      return true
    } catch (err) {
      console.error('DEBUG::supabaseAdminChapterStore', 'Error reordering chapters:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    fetchChapters,
    getChapters,
    getIsLoading,
    getError,
    createChapter,
    fetchChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
  }
})
