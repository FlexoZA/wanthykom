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

      <!-- Article Image Dropdown -->
      <div>
        <label class="block text-white mb-2">Article Image</label>
        <select
          v-model="formData.article_image_id"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Select an image</option>
          <!-- We'll populate this later -->
        </select>
      </div>

      <!-- Article Name/Title -->
      <div>
        <label class="block text-white mb-2">Article Title</label>
        <input
          type="text"
          v-model="formData.article_name"
          required
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
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Article' : 'Update Article' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseAdminArticleStore } from '@/stores/admin/supabaseAdminArticleStore'

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
const isSubmitting = ref(false)

const formData = ref({
  enable: false,
  article_image_id: '',
  article_name: '',
  article_text: '',
})

// Initialize form data if in edit mode
onMounted(() => {
  if (props.mode === 'edit' && props.article) {
    formData.value = {
      enable: props.article.enable,
      article_image_id: props.article.article_image?.[0]?.id || '',
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
      article_image_id: '',
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
