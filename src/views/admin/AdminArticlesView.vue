<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Articles Management</h1>
      <p class="text-gray-400 mt-2">Manage your articles</p>
    </div>
    
    <AdminArticleList />
  </div>
</template>

<script setup>
import AdminArticleList from '@/components/admin/article/AdminArticleList.vue'
</script> 