<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-end">
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-400">
          <span class="font-medium">{{ images.length }}</span> images •
          <span class="font-medium">{{ mediaStore.formatFileSize(totalStorageSize) }}</span> used
        </div>
        <button
          @click="showUploadModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Upload Images
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center gap-4">
      <div class="flex-1 relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search images..."
          class="w-full bg-gray-700 border border-gray-600 rounded-lg text-white pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          class="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <button
        @click="refreshImages"
        :disabled="isLoading"
        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <svg
          class="w-5 h-5"
          :class="{ 'animate-spin': isLoading }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        {{ error }}
      </div>
      <button @click="mediaStore.clearError()" class="text-red-400 hover:text-red-300">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && images.length === 0" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading && filteredImages.length === 0 && !searchTerm"
      class="text-center py-12"
    >
      <svg
        class="w-16 h-16 mx-auto text-gray-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-300 mb-2">No images found</h3>
      <p class="text-gray-400 mb-4">Start by uploading your first image</p>
      <button
        @click="showUploadModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Upload Images
      </button>
    </div>

    <!-- No Search Results -->
    <div
      v-else-if="!isLoading && filteredImages.length === 0 && searchTerm"
      class="text-center py-12"
    >
      <svg
        class="w-16 h-16 mx-auto text-gray-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-300 mb-2">No images match your search</h3>
      <p class="text-gray-400">Try a different search term</p>
    </div>

    <!-- Images Grid -->
    <div
      v-else-if="filteredImages.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div
        v-for="image in filteredImages"
        :key="image.path"
        class="group relative bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-200"
        :class="{ 'ring-2 ring-blue-500': selectedImages.includes(image.path) }"
      >
        <!-- Selection Checkbox -->
        <div class="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            :checked="selectedImages.includes(image.path)"
            @change="toggleImageSelection(image.path)"
            class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </div>

        <!-- Image -->
        <div class="aspect-square relative overflow-hidden bg-gray-700">
          <img
            :src="image.url"
            :alt="image.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
            @click="openImagePreview(image)"
            @error="onImageError(image)"
            @load="onImageLoad(image)"
            loading="lazy"
          />
        </div>

        <!-- Image Info -->
        <div class="p-3">
          <h3 class="text-sm font-medium text-white truncate" :title="image.name">
            {{ image.name }}
          </h3>
          <div class="flex items-center justify-between mt-1 text-xs text-gray-400">
            <span>{{ mediaStore.formatFileSize(image.size) }}</span>
            <span>{{ formatDate(image.created_at) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div class="flex gap-1">
            <button
              @click="copyImageUrl(image)"
              class="bg-gray-900 bg-opacity-75 text-white p-1.5 rounded hover:bg-opacity-100 transition-colors"
              title="Copy URL"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </button>
            <button
              @click="deleteImage(image.path)"
              class="bg-red-600 bg-opacity-75 text-white p-1.5 rounded hover:bg-opacity-100 transition-colors"
              title="Delete"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Images Actions -->
    <div
      v-if="selectedImages.length > 0"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 flex items-center gap-4 shadow-lg"
    >
      <span class="text-white">{{ selectedImages.length }} selected</span>
      <div class="flex gap-2">
        <button
          @click="copySelectedUrls"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Copy URLs
        </button>
        <button
          @click="deleteSelectedImages"
          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Delete
        </button>
        <button
          @click="selectedImages = []"
          class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeUploadModal"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white">Upload Images</h2>
          <button @click="closeUploadModal" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Upload Area -->
        <div
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
          :class="{ 'border-blue-500 bg-blue-500 bg-opacity-10': isDragging }"
        >
          <svg
            class="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p class="text-gray-300 mb-2">Drag & drop images here</p>
          <p class="text-gray-400 text-sm mb-4">or</p>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          />
          <button
            @click="$refs.fileInput.click()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Select Images
          </button>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-300">Uploading...</span>
            <span class="text-sm text-gray-300">{{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="previewImage"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeImagePreview"
    >
      <div class="max-w-4xl max-h-screen p-4" @click.stop>
        <div class="bg-gray-800 rounded-lg overflow-hidden">
          <div class="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 class="text-lg font-medium text-white">{{ previewImage.name }}</h3>
            <button @click="closeImagePreview" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div class="p-4">
            <img
              :src="previewImage.url"
              :alt="previewImage.name"
              class="max-w-full max-h-96 mx-auto rounded"
            />
            <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-400">Size:</span>
                <span class="text-white ml-2">{{
                  mediaStore.formatFileSize(previewImage.size)
                }}</span>
              </div>
              <div>
                <span class="text-gray-400">Created:</span>
                <span class="text-white ml-2">{{ formatDate(previewImage.created_at) }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-gray-400">URL:</span>
                <div class="flex items-center gap-2 mt-1">
                  <input
                    :value="previewImage.url"
                    readonly
                    class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-xs"
                  />
                  <button
                    @click="copyImageUrl(previewImage)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-text="confirmDialog.confirmText"
      :cancel-text="confirmDialog.cancelText"
      @confirm="handleConfirmAction"
      @cancel="handleCancelAction"
      @close="handleCancelAction"
    />

    <!-- Notification Toast -->
    <NotificationToast
      :show="showToast"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMediaManagerStore } from '@/stores/admin/mediaManagerStore'
import ConfirmationDialog from '@/components/admin/dialogs/ConfirmationDialog.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

console.log('DEBUG::MediaManager', 'Component initializing')

// Store
const mediaStore = useMediaManagerStore()

// Reactive state
const searchTerm = ref('')
const selectedImages = ref([])
const showUploadModal = ref(false)
const previewImage = ref(null)
const isDragging = ref(false)

// Confirmation dialog state
const showConfirmDialog = ref(false)
const confirmDialog = ref({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  action: null,
  data: null,
})

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

// Computed properties
const images = computed(() => mediaStore.getImages)
const isLoading = computed(() => mediaStore.getIsLoading)
const isUploading = computed(() => mediaStore.getIsUploading)
const error = computed(() => mediaStore.getError)
const uploadProgress = computed(() => mediaStore.getUploadProgress)
const totalStorageSize = computed(() => mediaStore.getTotalStorageSize)

const filteredImages = computed(() => {
  if (!searchTerm.value) return images.value
  return mediaStore.searchImages(searchTerm.value)
})

// Methods
const refreshImages = async () => {
  console.log('DEBUG::MediaManager', 'Refreshing images')
  await mediaStore.fetchImages()
}

const toggleImageSelection = (imagePath) => {
  console.log('DEBUG::MediaManager', `Toggling selection for: ${imagePath}`)
  const index = selectedImages.value.indexOf(imagePath)
  if (index > -1) {
    selectedImages.value.splice(index, 1)
  } else {
    selectedImages.value.push(imagePath)
  }
}

const copyImageUrl = async (image) => {
  console.log('DEBUG::MediaManager', `Copying URL for: ${image.name}`)
  try {
    await navigator.clipboard.writeText(image.url)
    console.log('DEBUG::MediaManager', 'URL copied to clipboard')
    showToastNotification('success', 'URL copied', 'Image URL copied to clipboard')
  } catch (err) {
    console.error('DEBUG::MediaManager', 'Failed to copy URL:', err)
    showToastNotification('error', 'Copy failed', 'Failed to copy URL to clipboard')
  }
}

const copySelectedUrls = async () => {
  console.log('DEBUG::MediaManager', `Copying URLs for ${selectedImages.value.length} images`)
  const urls = selectedImages.value
    .map((path) => {
      const image = images.value.find((img) => img.path === path)
      return image?.url
    })
    .filter(Boolean)

  try {
    await navigator.clipboard.writeText(urls.join('\n'))
    console.log('DEBUG::MediaManager', 'URLs copied to clipboard')
    showToastNotification('success', 'URLs copied', `${urls.length} image URLs copied to clipboard`)
    selectedImages.value = []
  } catch (err) {
    console.error('DEBUG::MediaManager', 'Failed to copy URLs:', err)
    showToastNotification('error', 'Copy failed', 'Failed to copy URLs to clipboard')
  }
}

const deleteImage = async (imagePath) => {
  console.log('DEBUG::MediaManager', `Deleting image: ${imagePath}`)
  const image = images.value.find((img) => img.path === imagePath)
  const imageName = image ? image.name : 'this image'

  confirmDialog.value = {
    title: 'Delete Image',
    message: `Are you sure you want to delete "${imageName}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    action: 'deleteImage',
    data: imagePath,
  }
  showConfirmDialog.value = true
}

const deleteSelectedImages = async () => {
  console.log('DEBUG::MediaManager', `Deleting ${selectedImages.value.length} selected images`)

  confirmDialog.value = {
    title: 'Delete Multiple Images',
    message: `Are you sure you want to delete ${selectedImages.value.length} images? This action cannot be undone.`,
    confirmText: 'Delete All',
    cancelText: 'Cancel',
    action: 'deleteSelectedImages',
    data: [...selectedImages.value],
  }
  showConfirmDialog.value = true
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  console.log('DEBUG::MediaManager', `Selected ${files.length} files`)
  uploadFiles(files)
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files).filter((file) =>
    file.type.startsWith('image/'),
  )
  console.log('DEBUG::MediaManager', `Dropped ${files.length} image files`)
  uploadFiles(files)
}

const uploadFiles = async (files) => {
  if (files.length === 0) return

  console.log('DEBUG::MediaManager', `Uploading ${files.length} files`)
  const result = await mediaStore.uploadMultipleImages(files)

  if (result.success) {
    console.log('DEBUG::MediaManager', 'All files uploaded successfully')
    closeUploadModal()
    showToastNotification(
      'success',
      'Upload complete',
      `${files.length} images uploaded successfully`,
    )
  } else {
    console.log(
      'DEBUG::MediaManager',
      `Upload completed with ${result.successCount} success, ${result.failureCount} failures`,
    )
    const successCount = result.successCount || 0
    const failureCount = result.failureCount || 0

    if (successCount > 0) {
      closeUploadModal()
      showToastNotification(
        'error',
        'Partial upload',
        `${successCount} images uploaded, ${failureCount} failed`,
      )
    } else {
      showToastNotification('error', 'Upload failed', result.error || 'Failed to upload images')
    }
  }
}

const openImagePreview = (image) => {
  console.log('DEBUG::MediaManager', `Opening preview for: ${image.name}`)
  previewImage.value = image
}

const closeImagePreview = () => {
  previewImage.value = null
}

const closeUploadModal = () => {
  showUploadModal.value = false
  isDragging.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

// Image loading handlers
const onImageError = (image) => {
  console.error('DEBUG::MediaManager', `Failed to load image: ${image.name}`, 'URL:', image.url)
}

const onImageLoad = (image) => {
  console.log('DEBUG::MediaManager', `Successfully loaded image: ${image.name}`)
}

// Confirmation dialog handlers
const handleConfirmAction = async () => {
  console.log('DEBUG::MediaManager', `Executing confirmed action: ${confirmDialog.value.action}`)
  showConfirmDialog.value = false

  if (confirmDialog.value.action === 'deleteImage') {
    const result = await mediaStore.deleteImage(confirmDialog.value.data)
    if (result.success) {
      console.log('DEBUG::MediaManager', 'Image deleted successfully')
      // Remove from selection if selected
      const index = selectedImages.value.indexOf(confirmDialog.value.data)
      if (index > -1) {
        selectedImages.value.splice(index, 1)
      }
      showToastNotification('success', 'Image deleted', 'Image has been successfully deleted')
    } else {
      showToastNotification('error', 'Delete failed', result.error || 'Failed to delete image')
    }
  } else if (confirmDialog.value.action === 'deleteSelectedImages') {
    const result = await mediaStore.deleteMultipleImages(confirmDialog.value.data)
    if (result.success) {
      console.log('DEBUG::MediaManager', 'Selected images deleted successfully')
      selectedImages.value = []
      showToastNotification(
        'success',
        'Images deleted',
        `${confirmDialog.value.data.length} images have been successfully deleted`,
      )
    } else {
      const successCount = result.successCount || 0
      const failureCount = result.failureCount || 0
      if (successCount > 0) {
        showToastNotification(
          'error',
          'Partial deletion',
          `${successCount} images deleted, ${failureCount} failed`,
        )
      } else {
        showToastNotification('error', 'Delete failed', result.error || 'Failed to delete images')
      }
    }
  }

  // Reset dialog
  confirmDialog.value = {
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    action: null,
    data: null,
  }
}

const handleCancelAction = () => {
  console.log('DEBUG::MediaManager', 'Cancelled confirmation dialog')
  showConfirmDialog.value = false
  confirmDialog.value = {
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    action: null,
    data: null,
  }
}

// Toast notification helpers
const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::MediaManager', `Showing ${type} toast: ${title}`)
  toast.value = {
    type,
    title,
    message,
    duration,
  }
  showToast.value = true
}

const hideToast = () => {
  showToast.value = false
}

// Drag and drop handlers
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

// Initialize component
onMounted(async () => {
  console.log('DEBUG::MediaManager', 'Component mounted, setting bucket to articles')
  // Set bucket to articles as specified
  mediaStore.setBucket('articles')
  // Fetch initial images
  await refreshImages()
})

// Watch for drag events on the upload modal
watch(showUploadModal, (newValue) => {
  if (newValue) {
    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
  } else {
    document.removeEventListener('dragenter', handleDragEnter)
    document.removeEventListener('dragleave', handleDragLeave)
  }
})
</script>
