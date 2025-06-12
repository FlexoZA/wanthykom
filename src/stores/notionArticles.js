import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'notion_articles_tree'
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour in milliseconds

export const useNotionArticlesStore = defineStore('notionArticles', () => {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const saveToLocalStorage = (data) => {
    console.log('DEBUG::notionArticles', 'Saving to localStorage:', data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const getFromLocalStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    console.log('DEBUG::notionArticles', 'Getting from localStorage:', data)
    if (data) {
      return JSON.parse(data)
    }
    return null
  }

  const shouldRefreshData = () => {
    const storedData = getFromLocalStorage()
    if (!storedData) {
      return true
    }

    const isExpired = Date.now() - storedData.timestamp > CACHE_DURATION
    return isExpired
  }

  // Fetch children of a page
  const fetchPageChildren = async (pageId) => {
    try {
      const response = await fetch(`/api/notion/blocks/${pageId}/children`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch page children: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.results
        .filter((block) => block.type === 'child_page')
        .map((block) => ({
          id: block.id,
          title: block.child_page.title,
          type: block.type,
        }))
    } catch (err) {
      console.error('DEBUG::notionArticles', 'Error fetching page children:', err)
      return []
    }
  }

  // Fetch the main parent page and its children
  const fetchArticles = async () => {
    console.log('DEBUG::notionArticles', 'Starting fetchArticles')
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const cachedData = getFromLocalStorage()
      if (cachedData && !shouldRefreshData()) {
        console.log('DEBUG::notionArticles', 'Using cached articles data:', cachedData)
        articles.value = cachedData.articles
        isLoading.value = false
        return
      }

      const response = await fetch(
        `/api/notion/blocks/${import.meta.env.VITE_NOTION_MAIN_PAGE_ID}/children`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
        },
      )

      console.log('DEBUG::notionArticles', 'API Response status:', response.status)
      console.log(
        'DEBUG::notionArticles',
        'API Response headers:',
        Object.fromEntries(response.headers.entries()),
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('DEBUG::notionArticles', 'API Error response:', errorText)
        throw new Error(
          `Failed to fetch articles: ${response.status} ${response.statusText}\n${errorText}`,
        )
      }

      const data = await response.json()
      console.log('DEBUG::notionArticles', 'API Response:', data)

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid API response format')
      }

      // Filter for child_page blocks only and process them
      const pageBlocks = data.results
        .filter((block) => block.type === 'child_page')
        .map((block) => ({
          id: block.id,
          title: block.child_page.title,
          type: block.type,
        }))

      console.log('DEBUG::notionArticles', 'Filtered page blocks:', pageBlocks)

      if (pageBlocks.length === 0) {
        console.log('DEBUG::notionArticles', 'No page blocks found in the response')
        articles.value = []
        return
      }

      // Fetch children for each parent page
      const articlesWithChildren = await Promise.all(
        pageBlocks.map(async (block) => {
          if (block.title.toLowerCase().startsWith('deel')) {
            const children = await fetchPageChildren(block.id)
            console.log('DEBUG::notionArticles', `Children for ${block.title}:`, children)
            return {
              ...block,
              children,
            }
          }
          return block
        }),
      )

      console.log('DEBUG::notionArticles', 'Final articles with children:', articlesWithChildren)
      articles.value = articlesWithChildren

      // Cache the results
      saveToLocalStorage({ articles: articlesWithChildren, timestamp: Date.now() })
    } catch (err) {
      error.value = err.message
      console.error('DEBUG::notionArticles', 'Error in fetchArticles:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Initialize the store
  const initialize = async () => {
    console.log('DEBUG::notionArticles', 'Initializing store...')
    await fetchArticles()
  }

  return {
    articles,
    isLoading,
    error,
    fetchArticles,
    initialize,
  }
})
