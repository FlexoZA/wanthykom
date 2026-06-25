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
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChapterView from '@/components/admin/chapter/ChapterView.vue'

const route = useRoute()
const router = useRouter()

// Derive IDs synchronously from the route so the child <ChapterView> receives
// the correct id on its initial mount (otherwise its first fetch runs with null).
const chapterId = computed(() => route.params.id)
const bookId = computed(() => route.params.bookId)

onMounted(() => {
  console.log('DEBUG::ChapterDetailView', 'Mounted with chapterId:', chapterId.value, 'bookId:', bookId.value)
  if (!chapterId.value || !bookId.value) {
    console.log('DEBUG::ChapterDetailView', 'Missing required params, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
