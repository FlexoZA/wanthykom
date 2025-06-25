<template>
  <div>
    <!-- Loading Animation while fetching chapter data -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Show AddChapter component once data is loaded -->
    <AddChapter
      v-else
      :book-id="bookId"
      :chapter-id="chapterId"
      @chapter-updated="$emit('chapter-updated')"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddChapter from './AddChapter.vue'
import LoadingAnimation from '../helpers/LoadingAnimation.vue'
import { useSupabaseAdminChapterStore } from '@/stores/admin/AdminChapterStore'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
  chapterId: {
    type: [String, Number],
    required: true,
  },
})

defineEmits(['chapter-updated', 'cancel'])

const chapterStore = useSupabaseAdminChapterStore()
const isLoading = ref(true)

onMounted(async () => {
  try {
    console.log('DEBUG::UpdateChapter', 'Loading chapter data for ID:', props.chapterId)
    // Pre-fetch the chapter data to ensure it's available when AddChapter component mounts
    await chapterStore.fetchChapter(props.chapterId)
    console.log('DEBUG::UpdateChapter', 'Chapter data loaded successfully')
  } catch (error) {
    console.error('DEBUG::UpdateChapter', 'Error loading chapter data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
