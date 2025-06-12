import { defineStore } from 'pinia'

const STORAGE_KEY_PREFIX = 'notion_preface_'
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour in milliseconds

export const useNotionPrefaceStore = defineStore('notionPreface', {
  state: () => ({
    pageData: {
      title: '',
      blocks: [],
    },
    isLoading: false,
    error: null,
    hasMore: true,
    startCursor: null,
    last_edited_time: null,
  }),

  actions: {
    getStorageKey(pageId) {
      return `${STORAGE_KEY_PREFIX}${pageId}`
    },

    saveToLocalStorage(pageId, data) {
      const storageData = {
        ...data,
        timestamp: Date.now(),
        last_edited_time: this.last_edited_time,
      }
      localStorage.setItem(this.getStorageKey(pageId), JSON.stringify(storageData))
    },

    getFromLocalStorage(pageId) {
      const data = localStorage.getItem(this.getStorageKey(pageId))
      return data ? JSON.parse(data) : null
    },

    shouldRefreshData(pageId) {
      const storedData = this.getFromLocalStorage(pageId)
      if (!storedData) return true

      const isExpired = Date.now() - storedData.timestamp > CACHE_DURATION
      const hasNewerVersion =
        this.last_edited_time &&
        storedData.last_edited_time &&
        new Date(this.last_edited_time) > new Date(storedData.last_edited_time)

      return isExpired || hasNewerVersion
    },

    async fetchPrefacePage(pageId, loadMore = false) {
      if (!loadMore) {
        this.isLoading = true
        this.error = null
        this.blocks = []
        this.hasMore = true
        this.startCursor = null
      }

      try {
        // Check local storage first if not loading more
        if (!loadMore) {
          const storedData = this.getFromLocalStorage(pageId)
          if (storedData && !this.shouldRefreshData(pageId)) {
            this.pageData = {
              title: storedData.title,
              blocks: storedData.blocks,
            }
            this.hasMore = storedData.hasMore
            this.startCursor = storedData.startCursor
            this.last_edited_time = storedData.last_edited_time
            return {
              blocks: storedData.blocks,
              hasMore: storedData.hasMore,
            }
          }
        }

        // Fetch page data (only on initial load)
        if (!loadMore) {
          const pageResponse = await fetch(`/api/notion/pages/${pageId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json',
            },
          })

          if (!pageResponse.ok) {
            throw new Error(`HTTP error! status: ${pageResponse.status}`)
          }

          const page = await pageResponse.json()
          this.pageData.title = page.properties.title.title[0]?.plain_text || ''
          this.last_edited_time = page.last_edited_time
        }

        // Fetch blocks with pagination
        const blocksResponse = await fetch(
          `/api/notion/blocks/${pageId}/children${this.startCursor ? `?start_cursor=${this.startCursor}` : ''}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json',
            },
          },
        )

        if (!blocksResponse.ok) {
          throw new Error(`HTTP error! status: ${blocksResponse.status}`)
        }

        const blocksData = await blocksResponse.json()

        // Process blocks
        const newBlocks = blocksData.results
          .filter((block) =>
            ['paragraph', 'heading_1', 'heading_2', 'heading_3', 'image'].includes(block.type),
          )
          .map((block) => {
            if (block.type === 'image') {
              return {
                type: 'image',
                url: block.image.file?.url || block.image.external?.url || '',
                caption: block.image.caption?.map((cap) => cap.plain_text).join('') || '',
              }
            } else {
              return {
                type: block.type,
                text: block[block.type].rich_text.map((text) => ({
                  content: text.plain_text,
                  isBold: text.annotations.bold,
                  isItalic: text.annotations.italic,
                  isStrikethrough: text.annotations.strikethrough,
                  isUnderline: text.annotations.underline,
                  isCode: text.annotations.code,
                  color: text.annotations.color,
                })),
              }
            }
          })
          .filter((block) => {
            if (block.type === 'image') {
              return block.url.length > 0
            } else {
              return block.text.some((t) => t.content.length > 0)
            }
          })

        // Update state
        this.pageData.blocks = loadMore ? [...this.pageData.blocks, ...newBlocks] : newBlocks
        this.hasMore = blocksData.has_more
        this.startCursor = blocksData.next_cursor

        // Save to local storage if not loading more
        if (!loadMore) {
          this.saveToLocalStorage(pageId, {
            title: this.pageData.title,
            blocks: this.pageData.blocks,
            hasMore: this.hasMore,
            startCursor: this.startCursor,
          })
        }

        return {
          blocks: newBlocks,
          hasMore: this.hasMore,
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
