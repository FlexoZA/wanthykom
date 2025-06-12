import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUnsplashImageStore = defineStore('unsplashImage', () => {
  const currentImage = ref(null)
  const lastFetchTime = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const API_URL = 'https://api.unsplash.com'
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

  const headers = {
    'Accept-Version': 'v1',
    Authorization: `Client-ID ${ACCESS_KEY}`,
  }

  const shouldRefreshImage = computed(() => {
    if (!lastFetchTime.value) return true
    const now = new Date()
    const lastFetch = new Date(lastFetchTime.value)
    const hoursSinceLastFetch = (now - lastFetch) / (1000 * 60 * 60)
    return hoursSinceLastFetch >= 24
  })

  const fetchRandomImage = async () => {
    if (!shouldRefreshImage.value && currentImage.value) {
      console.log('Using cached image:', currentImage.value)
      return currentImage.value
    }

    isLoading.value = true
    error.value = null

    try {
      console.log('Fetching new image from Unsplash...')
      const response = await fetch(
        `${API_URL}/photos/random?query=nature,landscape&orientation=landscape`,
        { headers },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch image from Unsplash')
      }

      const data = await response.json()
      console.log('Unsplash API response:', data)
      currentImage.value = {
        url: data.urls.regular,
        alt: data.alt_description || 'Nature landscape',
        photographer: data.user.name,
        photographerUrl: data.user.links.html,
      }
      console.log('Processed image data:', currentImage.value)

      saveToLocalStorage({
        image: currentImage.value,
        timestamp: Date.now(),
      })
    } catch (err) {
      error.value = err.message
      console.error('Error fetching Unsplash image:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadStoredImage = () => {
    const stored = localStorage.getItem('unsplashImage')
    if (stored) {
      const { image, timestamp } = JSON.parse(stored)
      currentImage.value = image
      lastFetchTime.value = timestamp
    }
  }

  const saveToLocalStorage = (data) => {
    localStorage.setItem('unsplashImage', JSON.stringify(data))
  }

  // Initialize store
  loadStoredImage()

  return {
    currentImage,
    isLoading,
    error,
    fetchRandomImage,
  }
})
