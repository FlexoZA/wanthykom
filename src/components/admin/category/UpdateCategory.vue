<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="text-gray-400 text-center py-8">
    <LoadingAnimation />
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="text-red-400 text-center py-8">
    <p>{{ error }}</p>
  </div>

  <!-- Edit Form -->
  <AddCategory
    v-else-if="category"
    :category-id="categoryId"
    :category="category"
    @category-updated="$emit('category-updated')"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddCategory from '@/components/admin/category/AddCategory.vue'
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'
import { useSupabaseAdminArticleCategoryStore } from '@/stores/admin/AdminArticleCategoryStore'

const props = defineProps({
  categoryId: {
    type: [String, Number],
    required: true,
  },
})

defineEmits(['category-updated'])

const categoryStore = useSupabaseAdminArticleCategoryStore()

const category = ref(null)
const isLoading = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    console.log('DEBUG::UpdateCategory', 'Loading category for editing:', props.categoryId)
    category.value = await categoryStore.fetchCategory(props.categoryId)
    if (!category.value) {
      error.value = 'Category not found'
    }
  } catch (err) {
    console.error('DEBUG::UpdateCategory', 'Error loading category:', err)
    error.value = 'Failed to load category data: ' + err.message
  } finally {
    isLoading.value = false
  }
})
</script>
