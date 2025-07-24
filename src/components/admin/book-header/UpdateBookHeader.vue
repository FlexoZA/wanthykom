<template>
  <div>
    <!-- Loading Animation while fetching book header data -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Show AddBookHeader component once data is loaded -->
    <AddBookHeader
      v-else
      :book-id="bookId"
      :book-header-id="bookHeaderId"
      @book-header-updated="handleBookHeaderUpdated"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddBookHeader from './AddBookHeader.vue'
import LoadingAnimation from '../helpers/LoadingAnimation.vue'
import { useSupabaseAdminBookHeaderStore } from '@/stores/admin/AdminBookHeaderStore'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
  bookHeaderId: {
    type: [String, Number],
    required: true,
  },
})

defineEmits(['book-header-updated', 'cancel'])

const route = useRoute()
const router = useRouter()
const bookHeaderStore = useSupabaseAdminBookHeaderStore()
const isLoading = ref(true)

const handleBookHeaderUpdated = () => {
  const bookId = route.params.bookId
  console.log('DEBUG::UpdateBookHeader', 'Book header updated, navigating back to list')
  router.push(`/admin/books/${bookId}/headers`)
}

const handleCancel = () => {
  const bookId = route.params.bookId
  console.log('DEBUG::UpdateBookHeader', 'Cancel clicked, navigating back to list')
  router.push(`/admin/books/${bookId}/headers`)
}

onMounted(async () => {
  try {
    console.log('DEBUG::UpdateBookHeader', 'Loading book header data for ID:', props.bookHeaderId)
    // Pre-fetch the book header data to ensure it's available when AddBookHeader component mounts
    await bookHeaderStore.fetchBookHeader(props.bookHeaderId)
    console.log('DEBUG::UpdateBookHeader', 'Book header data loaded successfully')
  } catch (error) {
    console.error('DEBUG::UpdateBookHeader', 'Error loading book header data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
