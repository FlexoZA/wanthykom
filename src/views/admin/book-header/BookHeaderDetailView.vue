<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Book Header Details</h1>
      <p class="text-gray-400 mt-2">View book header information</p>
    </div>

    <hr class="border-gray-700 mb-6" />

    <!-- Book Header View Component -->
    <BookHeaderView
      :book-header-id="bookHeaderId"
      @edit-book-header="handleEditBookHeader"
      @back="handleBack"
    />

    <!-- Notification Toast -->
    <NotificationToast
      :show="showToast"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookHeaderView from '@/components/admin/book-header/BookHeaderView.vue'
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

const route = useRoute()
const router = useRouter()
const bookId = ref(route.params.bookId)
const bookHeaderId = ref(route.params.id)

// Toast notification state
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  message: '',
  duration: 5000,
})

const handleEditBookHeader = (headerId) => {
  console.log('DEBUG::BookHeaderDetailView', 'Navigating to edit book header:', headerId)
  router.push(`/admin/books/${bookId.value}/headers/${headerId}/edit`)
}

const handleBack = () => {
  console.log('DEBUG::BookHeaderDetailView', 'Navigating back to book headers list')
  router.push(`/admin/books/${bookId.value}/headers`)
}

const hideToast = () => {
  showToast.value = false
}

onMounted(() => {
  const routeBookId = route.params.bookId
  const routeHeaderId = route.params.id
  console.log('DEBUG::BookHeaderDetailView', 'Mounted with bookId:', routeBookId, 'headerId:', routeHeaderId)

  if (routeBookId && routeHeaderId) {
    bookId.value = routeBookId
    bookHeaderId.value = routeHeaderId
  } else {
    // If missing parameters, redirect to books
    console.log('DEBUG::BookHeaderDetailView', 'Missing parameters, redirecting to books')
    router.push('/admin/books')
  }
})
</script>
