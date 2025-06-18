import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase.js'

/**
 * Media Manager Store for handling Supabase Storage operations
 * Manages images, uploads, downloads, and storage bucket operations
 */
export const useMediaManagerStore = defineStore('mediaManager', () => {
  // State
  const images = ref([])
  const isLoading = ref(false)
  const isUploading = ref(false)
  const error = ref(null)
  const currentBucket = ref('images') // Default bucket name
  const uploadProgress = ref(0)

  // Getters
  const getImages = computed(() => images.value)
  const getIsLoading = computed(() => isLoading.value)
  const getIsUploading = computed(() => isUploading.value)
  const getError = computed(() => error.value)
  const getCurrentBucket = computed(() => currentBucket.value)
  const getUploadProgress = computed(() => uploadProgress.value)

  /**
   * Set the current storage bucket
   * @param {string} bucketName - Name of the storage bucket
   */
  const setBucket = (bucketName) => {
    console.log('DEBUG::mediaManagerStore', `Setting bucket to: ${bucketName}`)
    currentBucket.value = bucketName
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Fetch all images from the current bucket
   * @param {string} folder - Optional folder path within bucket
   */
  const fetchImages = async (folder = '') => {
    console.log(
      'DEBUG::mediaManagerStore',
      `Fetching images from bucket: ${currentBucket.value}, folder: ${folder}`,
    )

    try {
      isLoading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase.storage
        .from(currentBucket.value)
        .list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (fetchError) {
        console.error('DEBUG::mediaManagerStore', 'Error fetching images:', fetchError)
        throw fetchError
      }

      // Filter to only include image files
      const imageFiles = data.filter((file) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
        return isImage && file.name !== '.emptyFolderPlaceholder'
      })

      // Get public URLs for each image
      const imagesWithUrls = imageFiles.map((file) => {
        const filePath = folder ? `${folder}/${file.name}` : file.name
        const { data: urlData } = supabase.storage.from(currentBucket.value).getPublicUrl(filePath)

        console.log(
          'DEBUG::mediaManagerStore',
          `Generated URL for ${file.name}:`,
          urlData.publicUrl,
        )

        return {
          id: file.id,
          name: file.name,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          updated_at: file.updated_at,
          path: filePath,
          url: urlData.publicUrl,
          bucket: currentBucket.value,
          folder: folder,
        }
      })

      images.value = imagesWithUrls
      console.log(
        'DEBUG::mediaManagerStore',
        `Successfully fetched ${imagesWithUrls.length} images`,
      )
    } catch (err) {
      console.error('DEBUG::mediaManagerStore', 'Failed to fetch images:', err)
      error.value = err.message || 'Failed to fetch images'
      images.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Upload a single image file
   * @param {File} file - Image file to upload
   * @param {string} folder - Optional folder path within bucket
   * @param {string} fileName - Optional custom filename
   */
  const uploadImage = async (file, folder = '', fileName = null) => {
    console.log('DEBUG::mediaManagerStore', `Uploading image: ${file.name}`)

    try {
      isUploading.value = true
      uploadProgress.value = 0
      error.value = null

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('Image file size must be less than 10MB')
      }

      // Generate unique filename if not provided
      const timestamp = new Date().getTime()
      const fileExtension = file.name.split('.').pop()
      const finalFileName = fileName || `image_${timestamp}.${fileExtension}`
      const filePath = folder ? `${folder}/${finalFileName}` : finalFileName

      // Upload file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from(currentBucket.value)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('DEBUG::mediaManagerStore', 'Upload error:', uploadError)
        throw uploadError
      }

      uploadProgress.value = 100
      console.log('DEBUG::mediaManagerStore', `Successfully uploaded: ${finalFileName}`)

      // Refresh images list
      await fetchImages(folder)

      return {
        success: true,
        path: data.path,
        fileName: finalFileName,
      }
    } catch (err) {
      console.error('DEBUG::mediaManagerStore', 'Upload failed:', err)
      error.value = err.message || 'Failed to upload image'
      return {
        success: false,
        error: err.message,
      }
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Upload multiple image files
   * @param {File[]} files - Array of image files to upload
   * @param {string} folder - Optional folder path within bucket
   */
  const uploadMultipleImages = async (files, folder = '') => {
    console.log('DEBUG::mediaManagerStore', `Uploading ${files.length} images`)

    try {
      isUploading.value = true
      error.value = null

      const results = []
      let completedUploads = 0

      for (const file of files) {
        const result = await uploadImage(file, folder)
        results.push(result)

        completedUploads++
        uploadProgress.value = Math.round((completedUploads / files.length) * 100)
      }

      const successCount = results.filter((r) => r.success).length
      const failureCount = results.filter((r) => !r.success).length

      console.log(
        'DEBUG::mediaManagerStore',
        `Upload complete: ${successCount} success, ${failureCount} failed`,
      )

      return {
        success: failureCount === 0,
        results,
        successCount,
        failureCount,
      }
    } catch (err) {
      console.error('DEBUG::mediaManagerStore', 'Multiple upload failed:', err)
      error.value = err.message || 'Failed to upload images'
      return {
        success: false,
        error: err.message,
      }
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Delete an image from storage
   * @param {string} imagePath - Path of the image to delete
   */
  const deleteImage = async (imagePath) => {
    console.log('DEBUG::mediaManagerStore', `Deleting image: ${imagePath}`)

    try {
      isLoading.value = true
      error.value = null

      const { error: deleteError } = await supabase.storage
        .from(currentBucket.value)
        .remove([imagePath])

      if (deleteError) {
        console.error('DEBUG::mediaManagerStore', 'Delete error:', deleteError)
        throw deleteError
      }

      // Remove from local images array
      images.value = images.value.filter((img) => img.path !== imagePath)

      console.log('DEBUG::mediaManagerStore', `Successfully deleted: ${imagePath}`)
      return { success: true }
    } catch (err) {
      console.error('DEBUG::mediaManagerStore', 'Delete failed:', err)
      error.value = err.message || 'Failed to delete image'
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete multiple images from storage
   * @param {string[]} imagePaths - Array of image paths to delete
   */
  const deleteMultipleImages = async (imagePaths) => {
    console.log('DEBUG::mediaManagerStore', `Deleting ${imagePaths.length} images`)

    try {
      isLoading.value = true
      error.value = null

      const { error: deleteError } = await supabase.storage
        .from(currentBucket.value)
        .remove(imagePaths)

      if (deleteError) {
        console.error('DEBUG::mediaManagerStore', 'Multiple delete error:', deleteError)
        throw deleteError
      }

      // Remove from local images array
      images.value = images.value.filter((img) => !imagePaths.includes(img.path))

      console.log('DEBUG::mediaManagerStore', `Successfully deleted ${imagePaths.length} images`)
      return { success: true }
    } catch (err) {
      console.error('DEBUG::mediaManagerStore', 'Multiple delete failed:', err)
      error.value = err.message || 'Failed to delete images'
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get public URL for an image
   * @param {string} imagePath - Path of the image
   */
  const getImageUrl = (imagePath) => {
    const { data } = supabase.storage.from(currentBucket.value).getPublicUrl(imagePath)

    return data.publicUrl
  }

  /**
   * Create a signed URL for temporary access
   * @param {string} imagePath - Path of the image
   * @param {number} expiresIn - Expiration time in seconds (default: 3600)
   */
  const createSignedUrl = async (imagePath, expiresIn = 3600) => {
    try {
      const { data, error: signError } = await supabase.storage
        .from(currentBucket.value)
        .createSignedUrl(imagePath, expiresIn)

      if (signError) {
        console.error('DEBUG::mediaManagerStore', 'Signed URL error:', signError)
        throw signError
      }

      return { success: true, signedUrl: data.signedUrl }
    } catch (err) {
      console.error('DEBUG::mediaManagerStore', 'Create signed URL failed:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Search images by name
   * @param {string} searchTerm - Search term to filter images
   */
  const searchImages = (searchTerm) => {
    if (!searchTerm) return images.value

    return images.value.filter((image) =>
      image.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  /**
   * Get images by folder
   * @param {string} folderName - Folder name to filter images
   */
  const getImagesByFolder = (folderName) => {
    return images.value.filter((image) => image.folder === folderName)
  }

  /**
   * Get total storage size used
   */
  const getTotalStorageSize = computed(() => {
    return images.value.reduce((total, image) => total + (image.size || 0), 0)
  })

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    // State
    images,
    isLoading,
    isUploading,
    error,
    currentBucket,
    uploadProgress,

    // Getters
    getImages,
    getIsLoading,
    getIsUploading,
    getError,
    getCurrentBucket,
    getUploadProgress,
    getTotalStorageSize,

    // Actions
    setBucket,
    clearError,
    fetchImages,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    deleteMultipleImages,
    getImageUrl,
    createSignedUrl,
    searchImages,
    getImagesByFolder,
    formatFileSize,
  }
})
