<template>
  <div class="relative">
    <!-- Cache status indicator -->
    <div v-if="cacheStatus" 
         class="fixed top-4 right-4 bg-gray-800 bg-opacity-90 text-gray-200 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300"
         :class="{ 'opacity-0': isStatusFading }">
      <div class="flex items-center space-x-2">
        <span v-if="cacheStatus.includes('cache')" class="text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-else-if="cacheStatus.includes('fresh')" class="text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-else-if="cacheStatus.includes('Error')" class="text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </span>
        <span>{{ cacheStatus }}</span>
      </div>
    </div>

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
import { computed, onMounted, ref } from 'vue';
import { useNotionPrefaceStore } from '@/stores/notionPrefaceStore';
import NotionLandingContent from '@/components/notion/NotionLandingContent.vue';

const prefaceStore = useNotionPrefaceStore();
const cacheStatus = ref('');
const isStatusFading = ref(false);

// Computed properties
const pageData = computed(() => prefaceStore.pageData);
const isLoading = computed(() => prefaceStore.isLoading);
const error = computed(() => prefaceStore.error);
const hasMore = computed(() => prefaceStore.hasMore);

// Load more content
const loadMore = async () => {
  try {
    await prefaceStore.fetchPrefacePage('20e43e9f7da680048e1bf11dc9f86382', true);
  } catch (error) {
    console.error('Failed to load more content:', error);
  }
};

// Initial load with cache status
const loadInitialData = async () => {
  const pageId = '20e43e9f7da680048e1bf11dc9f86382';
  
  // Check if we have cached data
  const cachedData = prefaceStore.getFromLocalStorage(pageId);
  
  if (cachedData) {
    if (prefaceStore.shouldRefreshData(pageId)) {
      cacheStatus.value = 'Refreshing cached data...';
    } else {
      cacheStatus.value = 'Loading from cache...';
    }
  } else {
    cacheStatus.value = 'Loading fresh data...';
  }

  try {
    await prefaceStore.fetchPrefacePage(pageId);
    
    // Update cache status after loading
    if (cachedData) {
      if (prefaceStore.lastEditedTime > cachedData.lastEditedTime) {
        cacheStatus.value = 'Data refreshed from Notion';
      } else {
        cacheStatus.value = 'Data loaded from cache';
      }
    } else {
      cacheStatus.value = 'Fresh data loaded';
    }

    // Fade out and clear status after 3 seconds
    setTimeout(() => {
      isStatusFading.value = true;
      setTimeout(() => {
        cacheStatus.value = '';
        isStatusFading.value = false;
      }, 300);
    }, 3000);
  } catch (error) {
    console.error('Failed to fetch preface page:', error);
    cacheStatus.value = 'Error loading data';
  }
};

// Initial load
onMounted(() => {
  loadInitialData();
});
</script>
