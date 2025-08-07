import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useSupabaseBookStore = defineStore('supabaseBook', {
  state: () => ({
    books: [],
    selectedBook: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getBooks: (state) => state.books,
    getSelectedBook: (state) => state.selectedBook,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },

  actions: {
    setSelectedBook(book) {
      this.selectedBook = book
    },

    async fetchBooks() {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('book')
          .select(
            `
            book_name,
            book_image_url,
            created_at,
            book_header (
                book_header_name,
                book_header_text,
                book_header_image_url,
                created_at,
                enable
            ),
            chapter (
                chapter_name,
                chapter_text,
                book_chapter_image_url,
                created_at,
                enable
            )
          `,
          )
          .order('created_at', { ascending: false })

        if (error) {
          console.error('DEBUG::supabaseBookStore', 'Error fetching Books:', error)
          throw error
        }

        // Set the books data, filter enabled items, and sort chapters and headers by newest first
        this.books = data.map(book => ({
          ...book,
          book_header: book.book_header?.filter(header => header.enable === true)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [],
          chapter: book.chapter?.filter(chapter => chapter.enable === true)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []
        }))

        console.log('DEBUG::supabaseBookStore', 'Fetched books with images:', this.books)
      } catch (error) {
        console.error('DEBUG::supabaseBookStore', 'Failed to fetch books:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
