<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Media Manager</h1>
      <p class="text-gray-400 mt-2">Manage your media</p>
    </div>

    <hr class="border-gray-700 mb-6" />
    <MediaManager />
  </div>
</template>

<script setup>
import MediaManager from '@/components/admin/media/MediaManager.vue'
</script>
