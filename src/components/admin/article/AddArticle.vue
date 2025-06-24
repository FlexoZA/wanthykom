<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-white mb-6">
      {{ mode === 'create' ? 'Add New Article' : 'Edit Article' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Enable/Disable Switch -->
      <div class="flex items-center justify-between">
        <label class="text-white">Enable Article</label>
        <button
          type="button"
          @click="formData.enable = !formData.enable"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
          :class="formData.enable ? 'bg-green-600' : 'bg-gray-600'"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="formData.enable ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <!-- Article Image Selection -->
      <div>
        <label class="block text-white mb-2">Article Image</label>
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
              v-model="formData.article_image_url"
              @change="updateSelectedImage"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select an image</option>
              <option
                v-for="image in availableImages"
                :key="image.url"
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

      <!-- Article Name/Title -->
      <div>
        <label class="block text-white mb-2">Article Title</label>
        <input
          type="text"
          v-model="formData.article_name"
          required
          :disabled="isSubmitting"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          placeholder="Enter article title"
        />
      </div>

      <!-- Article Text -->
      <div>
        <label class="block text-white mb-2">Article Text</label>
        <textarea
          v-model="formData.article_text"
          required
          rows="10"
          :disabled="isSubmitting"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          placeholder="Enter article content"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end gap-2">
        <button
          v-if="mode === 'create'"
          type="button"
          @click="$emit('cancel')"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !formData.article_name.trim() || !formData.article_text.trim()"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            v-if="isSubmitting"
            class="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Article' : 'Update Article' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/AdminArticleStore'
import { useMediaManagerStore } from '@/stores/admin/mediaManagerStore'

const props = defineProps({
  article: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value),
  },
})

const emit = defineEmits(['article-created', 'article-updated', 'cancel'])
const articleStore = useSupabaseAdminArticleStore()
const mediaStore = useMediaManagerStore()
const isSubmitting = ref(false)

const formData = ref({
  enable: false,
  article_image_url: '',
  article_name: '',
  article_text: '',
})

// Get available images from media store
const availableImages = computed(() => mediaStore.getImages)

// Get selected image details for thumbnail
const selectedImage = computed(() => {
  if (!formData.value.article_image_url) return null
  return availableImages.value.find(img => img.url === formData.value.article_image_url)
})

const selectedImageUrl = computed(() => formData.value.article_image_url || '')
const selectedImageName = computed(() => selectedImage.value?.name || '')

// Update selected image when dropdown changes
const updateSelectedImage = () => {
  console.log('DEBUG::AddArticle', 'Selected image URL:', formData.value.article_image_url)
  console.log('DEBUG::AddArticle', 'Selected image details:', selectedImage.value)
}

// Initialize form data if in edit mode
onMounted(async () => {
  // Set the correct bucket and load images from media manager
  mediaStore.setBucket('articles')
  await mediaStore.fetchImages()

  if (props.mode === 'edit' && props.article) {
    formData.value = {
      enable: props.article.enable,
      article_image_url: props.article.article_image_url || '',
      article_name: props.article.article_name,
      article_text: props.article.article_text,
    }
  }
})

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    console.log('DEBUG::AddArticle', 'Form data before submit:', formData.value)
    console.log('DEBUG::AddArticle', 'Mode:', props.mode)
    console.log('DEBUG::AddArticle', 'Article ID:', props.article?.id)

    if (props.mode === 'create') {
      await articleStore.createArticle(formData.value)
      emit('article-created')
    } else {
      console.log('DEBUG::AddArticle', 'Attempting to update article:', {
        id: props.article.id,
        data: formData.value,
      })
      const result = await articleStore.updateArticle(props.article.id, formData.value)
      if (result) {
        emit('article-updated')
      } else {
        throw new Error('Update failed')
      }
    }

    // Reset form after successful submission
    formData.value = {
      enable: false,
      article_image_url: '',
      article_name: '',
      article_text: '',
    }
  } catch (error) {
    console.error('DEBUG::AddArticle', 'Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
