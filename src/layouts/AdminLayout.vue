<template>
  <div class="min-h-screen bg-gray-900 flex">
    <AdminNavigation />

    <!-- Main Content -->
    <div class="flex-1 ml-64 p-8">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import AdminNavigation from '@/components/admin/navigation/AdminNavigation.vue'
</script> 