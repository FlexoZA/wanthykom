<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-white mb-6">
      {{ mode === 'create' ? 'Add New Book' : 'Edit Book' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Enable/Disable Switch -->
      <div class="flex items-center justify-between">
        <label class="text-white">Enable Book</label>
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

      <!-- Book Image Selection -->
      <div>
        <label class="block text-white mb-2">Book Image</label>
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
              v-model="formData.book_image_id"
              @change="updateSelectedImage"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select an image</option>
              <option
                v-for="image in availableImages"
                :key="image.id"
                :value="image.id"
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

      <!-- Book Name -->
      <div>
        <label class="block text-white mb-2">Book Name</label>
        <input
          v-model="formData.book_name"
          type="text"
          required
          :disabled="isSubmitting"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter book name"
        />
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="$emit('cancel')"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !formData.book_name.trim()"
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
          {{ isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Book' : 'Update Book' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'
import { useMediaManagerStore } from '@/stores/admin/mediaManagerStore'

const props = defineProps({
  bookId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['book-created', 'book-updated', 'cancel'])

const bookStore = useSupabaseAdminBookStore()
const mediaStore = useMediaManagerStore()
const isSubmitting = ref(false)

const formData = ref({
  enable: false,
  book_image_id: '',
  book_name: '',
})

const mode = computed(() => (props.bookId ? 'edit' : 'create'))

// Get available images from media store
const availableImages = computed(() => mediaStore.getImages)

// Get selected image details for thumbnail
const selectedImage = computed(() => {
  if (!formData.value.book_image_id) return null
  return availableImages.value.find(img => img.id === formData.value.book_image_id)
})

const selectedImageUrl = computed(() => selectedImage.value?.url || '')
const selectedImageName = computed(() => selectedImage.value?.name || '')

// Update selected image when dropdown changes
const updateSelectedImage = () => {
  console.log('DEBUG::AddBook', 'Selected image ID:', formData.value.book_image_id)
  console.log('DEBUG::AddBook', 'Selected image details:', selectedImage.value)
}

const handleSubmit = async () => {
  if (!formData.value.book_name.trim()) {
    return
  }

  try {
    isSubmitting.value = true
    console.log('DEBUG::AddBook', 'Submitting form:', formData.value)

    if (mode.value === 'create') {
      await bookStore.createBook(formData.value)
      console.log('DEBUG::AddBook', 'Book created successfully')
      emit('book-created')
    } else {
      await bookStore.updateBook(props.bookId, formData.value)
      console.log('DEBUG::AddBook', 'Book updated successfully')
      emit('book-updated')
    }

    // Reset form
    formData.value = {
      enable: false,
      book_image_id: '',
      book_name: '',
    }
  } catch (error) {
    console.error('DEBUG::AddBook', 'Error submitting form:', error)
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false
  }
}

// Load book data for editing
onMounted(async () => {
  // Load images from media manager
  await mediaStore.fetchImages()

  if (props.bookId) {
    try {
      console.log('DEBUG::AddBook', 'Loading book for editing:', props.bookId)
      const book = await bookStore.fetchBook(props.bookId)
      if (book) {
        formData.value = {
          enable: book.enable || false,
          book_image_id: book.book_image?.[0]?.id || '',
          book_name: book.book_name || '',
        }
        console.log('DEBUG::AddBook', 'Book data loaded:', formData.value)
      }
    } catch (error) {
      console.error('DEBUG::AddBook', 'Error loading book:', error)
    }
  }
})
</script>
