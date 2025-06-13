<template>
  <nav
    class="hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56 min-w-[12rem] border-l border-gray-700 sticky top-0 h-[calc(100vh-4rem)]"
  >
    <!-- Back to landing page -->
    <RouterLink
      to="/"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
    >
      Want hy kom
    </RouterLink>
    <RouterLink
      to="/books"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
    >
      Deel 1
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
