<script setup>
import PageHeadings from '@/components/PageHeadings.vue'
import VerticalNav from '@/components/VerticalNav.vue'
import MainContent from '@/components/MainContent.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <!-- Top Heading -->
    <PageHeadings />

    <!-- Main Layout: Sidebar + Content -->
    <div class="flex flex-1 w-full max-w-7xl mx-auto gap-0 md:gap-8 px-2 md:px-8 py-8">
      <!-- Vertical Navigation -->
      <VerticalNav />

      <!-- Main Content Area -->
      <MainContent>
        <RouterView />
      </MainContent>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
