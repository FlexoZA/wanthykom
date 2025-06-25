<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">View Chapter</h1>
      <div class="flex gap-2">
        <button
          @click="$emit('edit-chapter', chapterId)"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Chapter
        </button>
        <button
          @click="$emit('back')"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Chapters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-400 text-center py-8">
      <p>Error loading chapter: {{ error }}</p>
      <button
        @click="loadChapter"
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Chapter Content -->
    <div v-else-if="chapter" class="bg-gray-800 rounded-lg p-6">
      <!-- Status Badge -->
      <div class="mb-6">
        <span
          :class="chapter.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
          class="px-3 py-1 text-sm rounded-full"
        >
          {{ chapter.enable ? 'Enabled' : 'Disabled' }}
        </span>
      </div>

      <!-- Chapter Image -->
      <div v-if="chapter.book_chapter_image_url" class="mb-6">
        <img
          :src="chapter.book_chapter_image_url"
          :alt="chapter.chapter_name"
          class="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <!-- Chapter Title -->
      <h2 class="text-3xl font-bold text-white mb-6">{{ chapter.chapter_name }}</h2>

      <!-- Chapter Content -->
      <div class="prose prose-invert max-w-none mb-8">
        <p class="text-gray-300 whitespace-pre-wrap">{{ chapter.chapter_text }}</p>
      </div>

      <!-- Chapter Metadata -->
      <div class="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-semibold">Created:</span>
            {{ formatDate(chapter.created_at) }}
          </div>
          <div v-if="chapter.updated_at">
            <span class="font-semibold">Last Updated:</span>
            {{ formatDate(chapter.updated_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-gray-400 text-center py-8">
      <p>Chapter not found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseAdminChapterStore } from '@/stores/admin/AdminChapterStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

const props = defineProps({
  chapterId: {
    type: [String, Number],
    required: true,
  },
})

defineEmits(['edit-chapter', 'back'])

const chapterStore = useSupabaseAdminChapterStore()
const chapter = ref(null)
const isLoading = ref(false)
const error = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadChapter = async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('DEBUG::ChapterView', 'Loading chapter:', props.chapterId)

    chapter.value = await chapterStore.fetchChapter(props.chapterId)
    console.log('DEBUG::ChapterView', 'Chapter loaded:', chapter.value)
  } catch (err) {
    console.error('DEBUG::ChapterView', 'Error loading chapter:', err)
    error.value = err.message || 'Failed to load chapter'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadChapter()
})
</script>
