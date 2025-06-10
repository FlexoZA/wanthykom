<template>
  <NotionLandingContent
    :title="pageData.title"
    :blocks="pageData.blocks"
    :is-loading="isLoading"
    :error="error"
    :has-more="hasMore"
    @load-more="loadMore"
  />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useNotionPrefaceStore } from '@/stores/notionPrefaceStore';
import NotionLandingContent from '@/components/notion/NotionLandingContent.vue';

const prefaceStore = useNotionPrefaceStore();

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

// Initial load
onMounted(async () => {
  try {
    await prefaceStore.fetchPrefacePage('20e43e9f7da680048e1bf11dc9f86382');
  } catch (error) {
    console.error('Failed to fetch preface page:', error);
  }
});
</script>
