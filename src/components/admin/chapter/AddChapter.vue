<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-white mb-6">
      {{ mode === 'create' ? 'Add New Chapter' : 'Edit Chapter' }}
    </h2>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-md">
      <p class="text-red-300 text-sm">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Enable/Disable Toggle -->
      <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
        <div>
          <label class="text-white font-medium">Enable Chapter</label>
          <p class="text-gray-400 text-sm">Make this chapter visible to readers</p>
        </div>
        <button
          type="button"
          @click="formData.enable = !formData.enable"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="formData.enable ? 'bg-green-600' : 'bg-gray-600'"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out"
            :class="formData.enable ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <!-- Chapter Image Selection -->
      <div>
        <label class="block text-white font-medium mb-2">Chapter Image</label>
        <div class="flex gap-4 items-start">
          <!-- Image Thumbnail -->
          <div class="flex-shrink-0 w-20 h-20">
            <img
              v-if="selectedImageUrl"
              :src="selectedImageUrl"
              :alt="selectedImageName"
              class="w-full h-full object-cover rounded-md border border-gray-600"
            />
            <div
              v-else
              class="w-full h-full bg-gray-600 rounded-md flex items-center justify-center border border-gray-600"
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <!-- Image Dropdown -->
          <div class="flex-1">
            <select
              v-model="formData.book_chapter_image_url"
              @change="updateSelectedImage"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select an image</option>
              <option
                v-for="image in availableImages"
                :key="image.path"
                :value="image.url"
              >
                {{ image.name }}
              </option>
            </select>
            <p v-if="mediaStore.getIsLoading" class="text-sm text-gray-400 mt-1">
              Loading images...
            </p>
            <p v-else-if="availableImages.length === 0" class="text-sm text-gray-400 mt-1">
              No images available. Upload images in Media Manager first.
            </p>
          </div>
        </div>
      </div>

      <!-- Sort Order -->
      <div>
        <label class="block text-white font-medium mb-2">Sort Order</label>
        <input
          v-model.number="formData.sort_order"
          type="number"
          min="1"
          @input="clearError"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter sort order (optional - will auto-assign if empty)"
        />
        <p class="text-xs text-gray-400 mt-1">
          Leave empty to automatically assign the next available sort order. Lower numbers appear first.
        </p>
      </div>

      <!-- Chapter Title -->
      <div>
        <label class="block text-white font-medium mb-2">Chapter Title</label>
        <input
          v-model="formData.chapter_name"
          type="text"
          required
          maxlength="255"
          @input="clearError"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter chapter title"
        />
        <p v-if="formData.chapter_name.length > 0" class="text-xs text-gray-400 mt-1">
          {{ formData.chapter_name.length }}/255 characters
        </p>
      </div>

      <!-- Chapter Content -->
      <div>
        <label class="block text-white font-medium mb-2">Chapter Content</label>
        <textarea
          v-model="formData.chapter_text"
          required
          rows="12"
          @input="clearError"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          placeholder="Enter chapter content..."
        ></textarea>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {{ isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Chapter' : 'Update Chapter') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabaseAdminChapterStore } from '@/stores/admin/AdminChapterStore'
import { useMediaManagerStore } from '@/stores/admin/mediaManagerStore'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
  chapterId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['chapter-created', 'chapter-updated', 'cancel'])

const chapterStore = useSupabaseAdminChapterStore()
const mediaStore = useMediaManagerStore()
const isSubmitting = ref(false)
const errorMessage = ref('')

const formData = ref({
  enable: true,
  book_chapter_image_url: '',
  chapter_name: '',
  chapter_text: '',
  sort_order: null,
})

const mode = computed(() => (props.chapterId ? 'edit' : 'create'))

// Get available images from media store
const availableImages = computed(() => mediaStore.getImages)

// Get selected image details for thumbnail
const selectedImage = computed(() => {
  if (!formData.value.book_chapter_image_url) return null
  return availableImages.value.find(img => img.url === formData.value.book_chapter_image_url)
})

const selectedImageUrl = computed(() => formData.value.book_chapter_image_url || '')
const selectedImageName = computed(() => selectedImage.value?.name || '')

// Form validation
const isFormValid = computed(() => {
  return formData.value.chapter_name.trim().length > 0 &&
         formData.value.chapter_text.trim().length > 0 &&
         formData.value.chapter_name.trim().length <= 255 // Reasonable title length limit
})

// Update selected image when dropdown changes
const updateSelectedImage = () => {
  console.log('DEBUG::AddChapter', 'Selected image URL:', formData.value.book_chapter_image_url)
  console.log('DEBUG::AddChapter', 'Selected image details:', selectedImage.value)
}

// Clear error message when user starts typing
const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = '' // Clear any previous errors
    console.log('DEBUG::AddChapter', 'Submitting form:', formData.value)

    const chapterData = {
      ...formData.value,
      book_id: props.bookId,
    }

    if (mode.value === 'create') {
      await chapterStore.createChapter(chapterData)
      console.log('DEBUG::AddChapter', 'Chapter created successfully')
      emit('chapter-created')
    } else {
      await chapterStore.updateChapter(props.chapterId, chapterData)
      console.log('DEBUG::AddChapter', 'Chapter updated successfully')
      emit('chapter-updated')
    }

    // Reset form if creating
    if (mode.value === 'create') {
      formData.value = {
        enable: true,
        book_chapter_image_url: '',
        chapter_name: '',
        chapter_text: '',
      }
    }
  } catch (error) {
    console.error('DEBUG::AddChapter', 'Error submitting form:', error)
    errorMessage.value = error.message || 'An error occurred while saving the chapter. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Load chapter data for editing
onMounted(async () => {
  try {
    // Set the correct bucket and load images from media manager
    mediaStore.setBucket('articles')
    await mediaStore.fetchImages()
    console.log('DEBUG::AddChapter', 'Media images loaded:', mediaStore.getImages.length)

    if (props.chapterId) {
      console.log('DEBUG::AddChapter', 'Loading chapter for editing:', props.chapterId)
      const chapter = await chapterStore.fetchChapter(props.chapterId)
      if (chapter) {
        formData.value = {
          enable: chapter.enable ?? true,
          book_chapter_image_url: chapter.book_chapter_image_url || '',
          chapter_name: chapter.chapter_name || '',
          chapter_text: chapter.chapter_text || '',
        }
        console.log('DEBUG::AddChapter', 'Chapter data loaded:', formData.value)
      } else {
        console.warn('DEBUG::AddChapter', 'No chapter data found for ID:', props.chapterId)
        errorMessage.value = 'Chapter not found'
      }
    }
  } catch (error) {
    console.error('DEBUG::AddChapter', 'Error during component initialization:', error)
    errorMessage.value = 'Failed to load chapter data: ' + error.message
  }
})
</script>
