<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Create Category</h1>
      <p class="text-gray-400 mt-2">Add a new article category</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <AddCategory />
  </div>
</template>

<script setup>
import AddCategory from '@/components/admin/category/AddCategory.vue'
</script>
