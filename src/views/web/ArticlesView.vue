<template>
  <div class="relative">
    <ArticleList :show-featured-only="false" :category-id="categoryId" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ArticleList from '@/components/web/article/ArticleList.vue'
import { useSupabaseAdminArticleCategoryStore } from '@/stores/admin/AdminArticleCategoryStore'

const route = useRoute()
const categoryStore = useSupabaseAdminArticleCategoryStore()

const categoryId = ref(route.params.categoryId || null)
const categoryName = ref('')

// Function to fetch category name
const fetchCategoryName = async (id) => {
  if (!id) {
    categoryName.value = ''
    return
  }

  try {
    const category = await categoryStore.fetchCategory(id)
    categoryName.value = category.catagory_name
    console.log('DEBUG::ArticlesView', 'Category name:', categoryName.value)
  } catch (error) {
    console.error('DEBUG::ArticlesView', 'Error fetching category:', error)
    categoryName.value = ''
  }
}

// Watch for route changes
watch(() => route.params.categoryId, (newCategoryId) => {
  categoryId.value = newCategoryId || null
  fetchCategoryName(newCategoryId)
}, { immediate: true })

onMounted(() => {
  fetchCategoryName(categoryId.value)
})
</script>
