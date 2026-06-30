import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useLanguageStore } from '@/stores/languageStore'

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
        const language = useLanguageStore().currentLanguage

        const { data, error } = await supabase
          .from('book')
          .select(
            `
            book_name,
            book_image_url,
            created_at,
            sort_order,
            book_header (
                book_header_name,
                book_header_text,
                book_header_image_url,
                created_at,
                sort_order,
                enable
            ),
            chapter (
                chapter_name,
                chapter_text,
                book_chapter_image_url,
                created_at,
                sort_order,
                enable
            )
          `,
          )
          .eq('language', language)
          .order('sort_order', { ascending: true })

        if (error) throw error

        // Set the books data, filter enabled items, and sort chapters and headers by sort_order
        this.books = data.map(book => ({
          ...book,
          book_header: book.book_header?.filter(header => header.enable === true)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || [],
          chapter: book.chapter?.filter(chapter => chapter.enable === true)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || []
        }))

      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Resolve the equivalent book (and chapter) in `targetLang`.
    // - Books are matched by the shared `slug`.
    // - Chapters are matched by `sort_order` within the linked book pair (the
    //   translated chapters were created with the same sort_order as their
    //   source), so no per-chapter link column is needed.
    // Returns { bookName, chapterName } (chapterName may be null), or null if
    // there is no counterpart book.
    async equivalentBookLocation(bookName, chapterName, targetLang) {
      if (!bookName) return null
      try {
        const { data: curBook, error: curErr } = await supabase
          .from('book')
          .select('id, slug')
          .eq('book_name', bookName)
          .limit(1)
          .maybeSingle()
        if (curErr || !curBook?.slug) return null

        const { data: tgtBook } = await supabase
          .from('book')
          .select('id, book_name')
          .eq('language', targetLang)
          .eq('slug', curBook.slug)
          .limit(1)
          .maybeSingle()
        if (!tgtBook) return null

        let targetChapter = null
        if (chapterName) {
          const { data: curCh } = await supabase
            .from('chapter')
            .select('slug, sort_order')
            .eq('book_id', curBook.id)
            .eq('chapter_name', chapterName)
            .limit(1)
            .maybeSingle()

          // Preferred: shared chapter slug (survives reordering).
          if (curCh?.slug) {
            const { data: bySlug } = await supabase
              .from('chapter')
              .select('chapter_name')
              .eq('book_id', tgtBook.id)
              .eq('slug', curCh.slug)
              .limit(1)
              .maybeSingle()
            targetChapter = bySlug?.chapter_name ?? null
          }

          // Fallback: same sort_order within the linked book pair.
          if (!targetChapter && curCh && curCh.sort_order != null) {
            const { data: bySort } = await supabase
              .from('chapter')
              .select('chapter_name')
              .eq('book_id', tgtBook.id)
              .eq('sort_order', curCh.sort_order)
              .limit(1)
              .maybeSingle()
            targetChapter = bySort?.chapter_name ?? null
          }
        }

        return { bookName: tgtBook.book_name, chapterName: targetChapter }
      } catch (err) {
        console.error('DEBUG::supabaseBookStore', 'equivalentBookLocation failed', err)
        return null
      }
    },
  },
})
