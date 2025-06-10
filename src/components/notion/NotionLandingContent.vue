<template>
  <div class="space-y-8">
    <!-- Loading state -->
    <div v-if="isLoading && !blocks.length" class="flex justify-center items-center min-h-[200px]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-gray-100">{{ title }}</h1>

      <!-- Blocks -->
      <div class="space-y-6">
        <template v-for="(block, index) in blocks" :key="index">
          <!-- Images -->
          <div v-if="block.type === 'image'" class="space-y-2">
            <img 
              :src="block.url" 
              :alt="block.caption || `Image ${index + 1}`"
              class="w-full h-auto rounded-lg shadow-lg"
            />
            <p v-if="block.caption" class="text-sm text-gray-400 text-center">{{ block.caption }}</p>
          </div>

          <!-- Headings -->
          <FormattedHeading
            v-else-if="['heading_1', 'heading_2', 'heading_3'].includes(block.type)"
            :type="block.type"
            :text="block.text"
          />

          <!-- Paragraphs -->
          <p v-else class="text-gray-300 leading-relaxed">
            <FormattedText 
              v-for="(text, textIndex) in block.text" 
              :key="textIndex"
              :text="text"
            />
          </p>
        </template>

        <!-- Loading indicator -->
        <div v-if="isLoading && blocks.length" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <!-- Load more trigger -->
        <div v-if="hasMore && !isLoading" ref="loadMoreTrigger" class="h-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted } from 'vue';
import FormattedText from '../helpers/FormattedText.vue';
import FormattedHeading from '../helpers/FormattedHeading.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  blocks: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  hasMore: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['loadMore']);

const loadMoreTrigger = ref(null);
const observer = ref(null);

// Setup intersection observer
const setupObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && props.hasMore && !props.isLoading) {
        emit('loadMore');
      }
    },
    {
      rootMargin: '100px'
    }
  );

  if (loadMoreTrigger.value) {
    observer.value.observe(loadMoreTrigger.value);
  }
};

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script> 