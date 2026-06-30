<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Edit Category</h1>
      <p class="text-gray-400 mt-2">Update category details</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <UpdateCategory :category-id="categoryId" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UpdateCategory from '@/components/admin/category/UpdateCategory.vue'

const route = useRoute()

const categoryId = computed(() => route.params.id)
</script>
