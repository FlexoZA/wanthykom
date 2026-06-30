<template>
  <div class="space-y-4">
    <!-- Create New Category Button -->
    <div class="flex justify-end items-center">
      <button
        @click="createCategory"
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
        Create New Category
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showDeleteDialog"
      :title="`Delete Category: ${categoryToDelete?.catagory_name}`"
      :message="`Are you sure you want to delete '${categoryToDelete?.catagory_name}'? This action cannot be undone.`"
      confirm-text="Delete Category"
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
      <p>Error loading categories: {{ error }}</p>
      <button
        @click="loadCategories"
        class="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="categories.length === 0" class="text-gray-400 text-center py-8">
      <p>No categories found</p>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid gap-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3 min-w-0">
            <h3 class="text-lg font-semibold text-white truncate">
              {{ category.catagory_name }}
            </h3>
            <span class="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300 uppercase">
              {{ LANGUAGE_LABELS[category.language] || category.language || 'af' }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="editCategory(category.id)"
              class="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Edit Category
            </button>
            <button
              @click="deleteCategory(category.id)"
              class="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              title="Delete category"
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseAdminArticleCategoryStore } from '@/stores/admin/AdminArticleCategoryStore'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import ConfirmationDialog from '@/components/admin/dialogs/ConfirmationDialog.vue'
import { LANGUAGE_LABELS } from '@/i18n/messages'

const emit = defineEmits(['delete-category'])

const router = useRouter()
const categoryStore = useSupabaseAdminArticleCategoryStore()

const categories = ref([])
const isLoading = ref(false)
const error = ref(null)

// Dialog state
const showDeleteDialog = ref(false)
const categoryToDelete = ref(null)

const loadCategories = async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('DEBUG::CategoryList', 'Fetching categories')
    categories.value = await categoryStore.fetchCategories()
    console.log('DEBUG::CategoryList', 'Categories fetched:', categories.value.length)
  } catch (err) {
    console.error('DEBUG::CategoryList', 'Error fetching categories:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const createCategory = () => {
  console.log('DEBUG::CategoryList', 'Navigating to create category')
  router.push('/admin/categories/create')
}

const editCategory = (categoryId) => {
  console.log('DEBUG::CategoryList', 'Navigating to edit category:', categoryId)
  router.push(`/admin/categories/${categoryId}/edit`)
}

const deleteCategory = (categoryId) => {
  console.log('DEBUG::CategoryList', 'Delete category:', categoryId)
  const category = categories.value.find((c) => c.id === categoryId)
  categoryToDelete.value = category
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  console.log('DEBUG::CategoryList', 'Confirmed delete for category:', categoryToDelete.value?.id)
  if (categoryToDelete.value) {
    emit('delete-category', categoryToDelete.value.id)
  }
  cancelDelete()
}

const cancelDelete = () => {
  console.log('DEBUG::CategoryList', 'Cancelled delete')
  showDeleteDialog.value = false
  categoryToDelete.value = null
}

// Expose so the parent view can refresh the list after a delete.
defineExpose({ loadCategories })

onMounted(loadCategories)
</script>
