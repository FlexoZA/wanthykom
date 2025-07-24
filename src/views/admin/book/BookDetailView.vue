<template>
  <div class="p-6">
    <BookView
      :book-id="$route.params.id"
      @edit-book="(id) => $router.push(`/admin/books/${id}/edit`)"
      @back="$router.push('/admin/books')"
    />
  </div>
</template>

<script setup>
import BookView from '@/components/admin/book/BookView.vue'
</script>
