<template>
  <div>
    <!-- Loading Animation while fetching book data -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <LoadingAnimation />
    </div>

    <!-- Show AddBook component once data is loaded -->
    <AddBook
      v-else
      :book-id="bookId"
      @book-updated="$emit('book-updated')"
      @cancel="$router.push('/admin/books')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddBook from './AddBook.vue'
import LoadingAnimation from '../helpers/LoadingAnimation.vue'
import { useSupabaseAdminBookStore } from '@/stores/admin/AdminBookstore'

const props = defineProps({
  bookId: {
    type: String,
    required: true,
  },
})

defineEmits(['book-updated'])

const bookStore = useSupabaseAdminBookStore()
const isLoading = ref(true)

onMounted(async () => {
  try {
    console.log('DEBUG::UpdateBook', 'Loading book data for ID:', props.bookId)
    // Pre-fetch the book data to ensure it's available when AddBook component mounts
    await bookStore.fetchBook(props.bookId)
    console.log('DEBUG::UpdateBook', 'Book data loaded successfully')
  } catch (error) {
    console.error('DEBUG::UpdateBook', 'Error loading book data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
