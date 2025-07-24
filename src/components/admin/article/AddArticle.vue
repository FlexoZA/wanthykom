<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-white mb-6">
      {{ mode === 'create' ? 'Add New Article' : 'Edit Article' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Enable/Disable Switch -->
      <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
        <div>
          <label class="text-white font-medium">Enable Article</label>
          <p class="text-gray-400 text-sm">Make this article visible to readers</p>
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

      <!-- Featured Article Switch -->
      <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
        <div>
          <label class="text-white font-medium">Featured Article</label>
          <p class="text-red-400 text-sm">Featured articles appear on the home page</p>
        </div>
        <button
          type="button"
          @click="formData.article_featured = !formData.article_featured"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="formData.article_featured ? 'bg-blue-600' : 'bg-gray-600'"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out"
            :class="formData.article_featured ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <!-- Article Category Selection -->
      <div>
        <label class="block text-white mb-2">Article Category</label>
        <select
          v-model="formData.article_catagory_id"
          :disabled="categoriesLoading"
          required
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Select a category</option>
          <option
            v-for="category in availableCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.catagory_name }}
          </option>
        </select>
        <p v-if="categoriesLoading" class="text-sm text-gray-400 mt-1">
          Loading categories...
        </p>
        <p v-else-if="availableCategories.length === 0" class="text-sm text-gray-400 mt-1">
          No categories available. Create categories first.
        </p>
        <p v-else class="text-sm text-gray-400 mt-1">
          {{ availableCategories.length }} categories available
        </p>
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
          @click="$router.push('/admin/articles')"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !formData.article_name.trim() || !formData.article_text.trim() || !formData.article_catagory_id"
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
import { useRouter } from 'vue-router'
import { useSupabaseAdminArticleStore } from '@/stores/admin/AdminArticleStore'
import { useSupabaseAdminArticleCategoryStore } from '@/stores/admin/AdminArticleCategoryStore'
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
const router = useRouter()
const articleStore = useSupabaseAdminArticleStore()
const categoryStore = useSupabaseAdminArticleCategoryStore()
const mediaStore = useMediaManagerStore()
const isSubmitting = ref(false)

// Local state for categories
const categories = ref([])
const categoriesLoading = ref(false)

const formData = ref({
  enable: false,
  article_featured: false,
  article_catagory_id: null,
  article_image_url: '',
  article_name: '',
  article_text: '',
})

// Get available categories from local state
const availableCategories = computed(() => categories.value)

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
  // Image preview will update automatically through computed properties
}

// Fetch categories
const fetchCategories = async () => {
  try {
    categoriesLoading.value = true
    const fetchedCategories = await categoryStore.fetchCategories()
    categories.value = fetchedCategories
  } catch (err) {
    console.error('DEBUG::AddArticle', 'Error fetching categories:', err)
  } finally {
    categoriesLoading.value = false
  }
}

// Initialize form data if in edit mode
onMounted(async () => {
  // Set the correct bucket and load images from media manager
  mediaStore.setBucket('articles')
  await mediaStore.fetchImages()

  // Load categories
  await fetchCategories()

  if (props.mode === 'edit' && props.article) {
    formData.value = {
      enable: props.article.enable,
      article_featured: props.article.article_featured || false,
      article_catagory_id: props.article.article_catagory_id || null,
      article_image_url: props.article.article_image_url || '',
      article_name: props.article.article_name,
      article_text: props.article.article_text,
    }
  }
})

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    if (props.mode === 'create') {
      await articleStore.createArticle(formData.value)
      // Show success toast and redirect
      console.log('DEBUG::AddArticle', 'Article created successfully')
      router.push('/admin/articles')
    } else {
      await articleStore.updateArticle(props.article.id, formData.value)
      emit('article-updated')
    }
  } catch (error) {
    console.error('DEBUG::AddArticle', 'Error submitting article:', error)
    // Error handling is done in the store
  } finally {
    isSubmitting.value = false
  }
}
</script>
