import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: import.meta.env.VITE_NOTION_API_KEY,
  notionVersion: '2022-06-28'
})

const STORAGE_KEY = 'notion_articles_tree'
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour in milliseconds

export const useNotionArticlesStore = defineStore('notionArticles', () => {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const saveToLocalStorage = (data) => {
    console.log('Saving to localStorage:', data)
    const storageData = {
      ...data,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData))
  }

  const getFromLocalStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    console.log('Getting from localStorage:', data)
    return data ? JSON.parse(data) : null
  }

  const shouldRefreshData = () => {
    const storedData = getFromLocalStorage()
    if (!storedData) {
      console.log('No stored data found')
      return true
    }

    const isExpired = Date.now() - storedData.timestamp > CACHE_DURATION
    console.log('Cache status:', { 
      isExpired, 
      age: Date.now() - storedData.timestamp,
      maxAge: CACHE_DURATION 
    })
    return isExpired
  }

  // Fetch children of a page
  const fetchPageChildren = async (pageId) => {
    try {
      const response = await fetch(`/api/notion/blocks/${pageId}/children`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch page children: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.results.filter(block => block.type === 'child_page')
    } catch (err) {
      console.error('Error fetching page children:', err)
      return []
    }
  }

  // Fetch the main parent page and its children
  const fetchArticles = async () => {
    console.log('Starting fetchArticles')
    isLoading.value = true
    error.value = null
    
    try {
      // Check cache first
      const cachedData = getFromLocalStorage()
      if (cachedData && !shouldRefreshData()) {
        console.log('Using cached articles data:', cachedData)
        articles.value = cachedData.articles
        return cachedData.articles
      }

      console.log('Fetching fresh articles data')
      const response = await fetch(`/api/notion/blocks/${import.meta.env.VITE_NOTION_MAIN_PAGE_ID}/children`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Raw API Response:', data)
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid API response format')
      }

      // Filter for child_page blocks only
      const pageBlocks = data.results.filter(block => block.type === 'child_page')
      console.log('Filtered page blocks:', pageBlocks)

      // Fetch children for each parent page
      const articlesWithChildren = await Promise.all(
        pageBlocks.map(async (block) => {
          if (block.child_page.title.toLowerCase().startsWith('deel')) {
            const children = await fetchPageChildren(block.id)
            return {
              ...block,
              children
            }
          }
          return block
        })
      )

      console.log('Articles with children:', articlesWithChildren)
      articles.value = articlesWithChildren
      
      // Cache the results
      saveToLocalStorage({ articles: articlesWithChildren })
      return articlesWithChildren
    } catch (err) {
      error.value = err.message
      console.error('Error in fetchArticles:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // Transform Notion blocks into a tree structure
  const transformToTree = (blocks) => {
    console.log('Transforming blocks:', blocks)
    if (!blocks || !Array.isArray(blocks)) {
      console.warn('Invalid blocks data:', blocks)
      return []
    }

    return blocks.map(block => ({
      id: block.id,
      title: block.child_page.title,
      children: block.children ? block.children.map(child => ({
        id: child.id,
        title: child.child_page.title
      })) : []
    }))
  }

  // Get the tree structure of articles
  const getArticleTree = computed(() => {
    const tree = transformToTree(articles.value)
    console.log('Computed tree:', tree)
    return tree
  })

  // Initialize the store
  const initialize = async () => {
    console.log('Initializing store...')
    const result = await fetchArticles()
    console.log('Initialization result:', result)
  }

  return {
    articles,
    isLoading,
    error,
    fetchArticles,
    getArticleTree,
    initialize
  }
}) 