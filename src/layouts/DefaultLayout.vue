<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <!-- Top Heading -->
    <TopHeader />

    <!-- Main Layout: Content + Sidebar -->
    <div class="flex flex-1 w-full max-w-7xl mx-auto gap-0 md:gap-8 px-2 md:px-8 py-8 relative">
      <!-- Main Content Area -->
      <MainContent class="flex-1">
        <RouterView />
      </MainContent>

      <!-- Vertical Navigation -->
      <VerticalNav class="hidden md:block" />
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import TopHeader from '@/components/web/header/TopHeader.vue'
import VerticalNav from '@/components/web/navigation/VerticalNav.vue'
import MainContent from '@/components/MainContent.vue'
import AppFooter from '@/components/web/footer/AppFooter.vue'
</script>
