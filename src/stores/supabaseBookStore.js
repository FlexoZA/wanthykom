import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useSupabaseBookStore = defineStore('supabaseBook', {
  state: () => ({
    books: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getBooks: (state) => state.books,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },

  actions: {
    async fetchBooks() {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('book')
          .select(
            `
            book_name,
            book_text,
            chapter (
                chapter_name,
                chapter_text,
                chapter_image (
                    chapter_image_url
                )
            ),
            book_image (
                book_image_url
            )
          `,
          )
          .order('created_at', { ascending: false })

        console.log('DEBUG::supabaseBookStore', this.books)

        if (error) {
          console.error('DEBUG::supabaseBookStore', 'Error fetching Books:', error)
          throw error
        }

        this.books = data
        console.log('DEBUG::supabaseBookStore', 'Fetched books with images:', data)
      } catch (error) {
        console.error('DEBUG::supabaseBookStore', 'Failed to fetch books:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
