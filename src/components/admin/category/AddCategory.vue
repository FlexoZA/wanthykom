<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-white mb-6">
      {{ mode === 'create' ? 'Add New Category' : 'Edit Category' }}
    </h2>

    <!-- Error Message Display -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-md">
      <p class="text-red-300 text-sm">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Category Name -->
      <div>
        <label class="block text-white font-medium mb-2">Category Name</label>
        <input
          v-model="formData.catagory_name"
          type="text"
          required
          maxlength="255"
          @input="clearError"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter category name..."
        />
      </div>

      <!-- Language Selection -->
      <div>
        <label class="block text-white font-medium mb-2">Language</label>
        <select
          v-model="formData.language"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
        >
          <option v-for="lang in SUPPORTED_LANGUAGES" :key="lang" :value="lang">
            {{ LANGUAGE_LABELS[lang] }}
          </option>
        </select>
        <p class="text-sm text-gray-400 mt-1">
          The language readers must select to see articles in this category.
        </p>
      </div>

      <!-- Slug (cross-language link) -->
      <div>
        <label class="block text-white font-medium mb-2">Slug</label>
        <input
          v-model="formData.slug"
          type="text"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. dreams"
        />
        <p class="text-sm text-gray-400 mt-1">
          Links this category to its translations. Use the <strong>same slug</strong>
          on the matching category in each language (e.g. “dreams” on both Drome en
          Gesigte and Dreams and Visions).
        </p>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          @click="handleCancel"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {{ isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Category' : 'Update Category') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseAdminArticleCategoryStore } from '@/stores/admin/AdminArticleCategoryStore'
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '@/i18n/messages'

const props = defineProps({
  categoryId: {
    type: [String, Number],
    default: null,
  },
  category: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['category-created', 'category-updated', 'cancel'])

const router = useRouter()
const categoryStore = useSupabaseAdminArticleCategoryStore()
const isSubmitting = ref(false)
const errorMessage = ref('')

const mode = computed(() => (props.categoryId ? 'edit' : 'create'))

const formData = ref({
  catagory_name: props.category?.catagory_name || '',
  language: props.category?.language || 'af',
  slug: props.category?.slug || '',
})

const isFormValid = computed(() => formData.value.catagory_name.trim().length > 0)

const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

const handleCancel = () => {
  console.log('DEBUG::AddCategory', 'Cancel clicked, navigating back to categories list')
  router.push('/admin/categories')
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = ''
    console.log('DEBUG::AddCategory', 'Submitting form:', formData.value)

    const categoryData = {
      catagory_name: formData.value.catagory_name.trim(),
      language: formData.value.language,
      slug: formData.value.slug.trim() || null,
    }

    if (mode.value === 'create') {
      await categoryStore.createCategory(categoryData)
      console.log('DEBUG::AddCategory', 'Category created successfully')
      emit('category-created')
    } else {
      await categoryStore.updateCategory(props.categoryId, categoryData)
      console.log('DEBUG::AddCategory', 'Category updated successfully')
      emit('category-updated')
    }

    router.push('/admin/categories')
  } catch (error) {
    console.error('DEBUG::AddCategory', 'Error submitting form:', error)
    errorMessage.value = error.message || 'An error occurred while saving the category. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
