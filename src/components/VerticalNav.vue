<template>
  <nav class="hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56 min-w-[12rem] border-r border-gray-700">
    <RouterLink to="/" class="py-2 px-3 rounded hover:bg-gray-700 transition-colors" active-class="bg-gray-700 font-semibold">Home</RouterLink>
    <RouterLink to="/about" class="py-2 px-3 rounded hover:bg-gray-700 transition-colors" active-class="bg-gray-700 font-semibold">About</RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
