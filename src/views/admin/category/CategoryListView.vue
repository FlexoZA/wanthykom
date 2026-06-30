<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Categories Management</h1>
      <p class="text-gray-400 mt-2">Manage your article categories</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <CategoryList ref="categoryListRef" @delete-category="handleDeleteCategory" />

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
import { ref } from 'vue'
import CategoryList from '@/components/admin/category/CategoryList.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'
import { useSupabaseAdminArticleCategoryStore } from '@/stores/admin/AdminArticleCategoryStore'

const categoryStore = useSupabaseAdminArticleCategoryStore()
const categoryListRef = ref(null)

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const showToastNotification = (type, title, message = '', duration = 5000) => {
  console.log('DEBUG::CategoryListView', `Showing ${type} toast: ${title}`)
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

const handleDeleteCategory = async (categoryId) => {
  try {
    console.log('DEBUG::CategoryListView', 'Deleting category:', categoryId)
    await categoryStore.deleteCategory(categoryId)
    console.log('DEBUG::CategoryListView', 'Category deleted successfully')
    showToastNotification('success', 'Category Deleted', 'Category has been successfully deleted')
    await categoryListRef.value?.loadCategories()
  } catch (err) {
    console.error('DEBUG::CategoryListView', 'Error deleting category:', err)
    showToastNotification('error', 'Delete Failed', 'An error occurred while deleting the category')
  }
}

defineExpose({
  showToastNotification,
})
</script>
