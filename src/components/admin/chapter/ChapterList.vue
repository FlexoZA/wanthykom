<template>
  <div class="space-y-4">
    <!-- Back to Books Button and Create New Chapter Button -->
    <div class="flex justify-between items-center">
      <button
        @click="$emit('back-to-books')"
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
        Back to Books
      </button>
      <button
        @click="$emit('create-chapter')"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create New Chapter
      </button>
    </div>

    <!-- Book Info Header -->
    <div v-if="bookName" class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
      <h2 class="text-xl font-semibold text-white">
        Chapters for: <span class="text-blue-400">{{ bookName }}</span>
      </h2>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showDeleteDialog"
      :title="`Delete Chapter: ${chapterToDelete?.chapter_name}`"
      :message="`Are you sure you want to delete '${chapterToDelete?.chapter_name}'? This action cannot be undone.`"
      confirm-text="Delete Chapter"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @close="cancelDelete"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-gray-400 text-center py-8">
      <LoadingAnimation />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-400 text-center py-8">
      <p>Error loading chapters: {{ error }}</p>
      <button
        @click="chapterStore.fetchChapters(bookId)"
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="chapters.length === 0" class="text-gray-400 text-center py-8">
      <p>No chapters found for this book</p>
    </div>

    <!-- Chapters Grid -->
    <div v-else class="grid gap-4">
      <div
        v-for="chapter in chapters"
        :key="chapter.id"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      >
        <div class="flex gap-4">
          <!-- Chapter Image -->
          <div class="flex-shrink-0 w-24 h-24">
            <img
              v-if="chapter.book_chapter_image_url"
              :src="chapter.book_chapter_image_url"
              :alt="chapter.chapter_name"
              class="w-full h-full object-cover rounded-md"
            />
            <div
              v-else
              class="w-full h-full bg-gray-600 rounded-md flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>

          <!-- Chapter Details -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white truncate">
                {{ chapter.chapter_name }}
              </h3>
              <div class="flex items-center ml-2">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="
                    chapter.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  "
                >
                  {{ chapter.enable ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>

            <!-- Chapter Preview -->
            <div class="text-sm text-gray-400 mb-3">
              <p class="line-clamp-2">
                {{ chapter.chapter_text ? chapter.chapter_text.substring(0, 120) + '...' : 'No content' }}
              </p>
            </div>

            <!-- Creation Date -->
            <div class="text-xs text-gray-500 mb-3 space-y-1">
              <div>Created: {{ formatDate(chapter.created_at) }}</div>
              <div v-if="chapter.updated_at">
                Updated: {{ formatDate(chapter.updated_at) }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <button
                  @click="viewChapter(chapter.id)"
                  class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  View Chapter
                </button>
                <button
                  @click="editChapter(chapter.id)"
                  class="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Edit Chapter
                </button>
              </div>
              <button
                @click="deleteChapter(chapter.id)"
                class="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Delete chapter"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useSupabaseAdminChapterStore } from '@/stores/admin/AdminChapterStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import ConfirmationDialog from '@/components/admin/dialogs/ConfirmationDialog.vue'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
  bookName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['back-to-books', 'create-chapter', 'view-chapter', 'edit-chapter', 'delete-chapter'])

// Dialog state
const showDeleteDialog = ref(false)
const chapterToDelete = ref(null)

const chapterStore = useSupabaseAdminChapterStore()

const chapters = computed(() => chapterStore.getChapters)
const isLoading = computed(() => chapterStore.getIsLoading)
const error = computed(() => chapterStore.getError)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const viewChapter = (chapterId) => {
  console.log('DEBUG::ChapterList', 'View chapter:', chapterId)
  emit('view-chapter', chapterId)
}

const editChapter = (chapterId) => {
  console.log('DEBUG::ChapterList', 'Edit chapter:', chapterId)
  emit('edit-chapter', chapterId)
}

const deleteChapter = (chapterId) => {
  console.log('DEBUG::ChapterList', 'Delete chapter:', chapterId)
  const chapter = chapters.value.find(c => c.id === chapterId)
  chapterToDelete.value = chapter
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  console.log('DEBUG::ChapterList', 'Confirmed delete for chapter:', chapterToDelete.value?.id)
  if (chapterToDelete.value) {
    emit('delete-chapter', chapterToDelete.value.id)
  }
  cancelDelete()
}

const cancelDelete = () => {
  console.log('DEBUG::ChapterList', 'Cancelled delete')
  showDeleteDialog.value = false
  chapterToDelete.value = null
}

// Watch for bookId changes to fetch chapters
watch(() => props.bookId, (newBookId) => {
  if (newBookId) {
    console.log('DEBUG::ChapterList', 'Fetching chapters for book:', newBookId)
    chapterStore.fetchChapters(newBookId)
  }
}, { immediate: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
