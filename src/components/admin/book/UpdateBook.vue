<template>
  <AddBook
    :book-id="bookId"
    @book-updated="$emit('book-updated')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup>
import AddBook from './AddBook.vue'

defineProps({
  bookId: {
    type: String,
    required: true,
  },
})

defineEmits(['book-updated', 'cancel'])
</script>
