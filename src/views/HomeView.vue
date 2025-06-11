<template>
  <div class="relative">
    <NotificationToast v-model:message="cacheStatus" type="cache" :duration="3000" />

    <NotionLandingContent
      :title="pageData.title"
      :blocks="pageData.blocks"
      :is-loading="isLoading"
      :error="error"
      :has-more="hasMore"
      @load-more="loadMore"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useNotionPrefaceStore } from '@/stores/notionPrefaceStore'
import NotionLandingContent from '@/components/notion/NotionLandingContent.vue'
import NotificationToast from '@/components/helpers/NotificationToast.vue'

const prefaceStore = useNotionPrefaceStore()
const cacheStatus = ref('')

// Computed properties
const pageData = computed(() => prefaceStore.pageData)
const isLoading = computed(() => prefaceStore.isLoading)
const error = computed(() => prefaceStore.error)
const hasMore = computed(() => prefaceStore.hasMore)

// Load more content
const loadMore = async () => {
  try {
    await prefaceStore.fetchPrefacePage('20e43e9f7da680048e1bf11dc9f86382', true)
  } catch (error) {
    console.error('Failed to load more content:', error)
  }
}

// Initial load with cache status
const loadInitialData = async () => {
  const pageId = '20e43e9f7da680048e1bf11dc9f86382'

  // Check if we have cached data
  const cachedData = prefaceStore.getFromLocalStorage(pageId)

  if (cachedData) {
    if (prefaceStore.shouldRefreshData(pageId)) {
      cacheStatus.value = 'Refreshing cached data...'
    } else {
      cacheStatus.value = 'Loading from cache...'
    }
  } else {
    cacheStatus.value = 'Loading fresh data...'
  }

  try {
    await prefaceStore.fetchPrefacePage(pageId)

    // Update cache status after loading
    if (cachedData) {
      if (prefaceStore.lastEditedTime > cachedData.lastEditedTime) {
        cacheStatus.value = 'Data refreshed from Notion'
      } else {
        cacheStatus.value = 'Data loaded from cache'
      }
    } else {
      cacheStatus.value = 'Fresh data loaded'
    }
  } catch (error) {
    console.error('Failed to fetch preface page:', error)
    cacheStatus.value = 'Error loading data'
  }
}

// Initial load
onMounted(() => {
  loadInitialData()
})
</script>
