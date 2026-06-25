import { defineStore } from 'pinia'

// Reader bookmarks: a highlighted passage the visitor wants to recall later.
// Persisted to localStorage so they survive a browser close. No backend.
const STORAGE_KEY = 'wanthykom-bookmarks'

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('DEBUG::bookmarkStore', 'Unable to read bookmarks', err)
    return []
  }
}

const makeId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    /* fall through */
  }
  return `bm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// Two bookmarks belong to the same reading view when they share a path and,
// for the books page, the same selected book.
const sameView = (route, path, query) => {
  if (!route) return false
  if (route.path !== path) return false
  const bookA = route.query?.book ?? ''
  const bookB = query?.book ?? ''
  return bookA === bookB
}

export const useBookmarkStore = defineStore('bookmarks', {
  state: () => ({
    bookmarks: load(),
    // Id of a bookmark the UI should scroll to once its content is rendered.
    recallId: null,
  }),

  getters: {
    count: (state) => state.bookmarks.length,
    // Newest first for the drawer list.
    all: (state) =>
      [...state.bookmarks].sort((a, b) => b.createdAt - a.createdAt),
    // Bookmarks that live on the given route (used to paint persistent highlights).
    forView: (state) => (path, query) =>
      state.bookmarks.filter((b) => sameView(b.route, path, query)),
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bookmarks))
      } catch (err) {
        console.error('DEBUG::bookmarkStore', 'Unable to persist bookmarks', err)
      }
    },

    add(bookmark) {
      const entry = { id: makeId(), createdAt: Date.now(), ...bookmark }
      this.bookmarks.push(entry)
      this.persist()
      return entry
    },

    // Auto-saved "resume reading" marker. Only one auto bookmark is kept per
    // view — a new one replaces the previous so the list never fills up.
    upsertAuto(bookmark) {
      this.bookmarks = this.bookmarks.filter(
        (b) =>
          !(
            b.auto &&
            sameView(b.route, bookmark.route.path, bookmark.route.query)
          ),
      )
      this.bookmarks.push({
        id: makeId(),
        createdAt: Date.now(),
        ...bookmark,
        auto: true,
      })
      this.persist()
    },

    remove(id) {
      this.bookmarks = this.bookmarks.filter((b) => b.id !== id)
      this.persist()
    },

    clearAll() {
      this.bookmarks = []
      this.persist()
    },

    requestRecall(id) {
      this.recallId = id
    },

    clearRecall() {
      this.recallId = null
    },
  },
})
