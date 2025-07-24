<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Chapter Details</h1>
      <p class="text-gray-400 mt-2">View chapter information</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <ChapterView
      :chapter-id="chapterId"
      :book-id="bookId"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChapterView from '@/components/admin/chapter/ChapterView.vue'

const route = useRoute()
const router = useRouter()
const chapterId = ref(null)
const bookId = ref(null)

// Navigation is now handled directly in ChapterView component

onMounted(() => {
  // Get IDs from route params
  chapterId.value = route.params.id
  bookId.value = route.params.bookId
  console.log('DEBUG::ChapterDetailView', 'Mounted with chapterId:', chapterId.value, 'bookId:', bookId.value)

  if (!chapterId.value || !bookId.value) {
    // If missing params, redirect to books
    console.log('DEBUG::ChapterDetailView', 'Missing required params, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
