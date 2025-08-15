<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <!-- Top Heading -->
    <TopHeader />

    <!-- Main Layout: Content + Sidebar -->
    <div class="flex flex-1 w-full max-w-7xl mx-auto gap-0 md:gap-8 px-2 md:px-8 py-8 relative">
      <!-- Main Content Area -->
      <MainContent>
        <RouterView />
      </MainContent>

      <!-- Vertical Navigation -->
      <VerticalNav />
    </div>

    <!-- Footer -->
    <AppFooter />

    <!-- Inactivity Refresh Button -->
    <div
      v-if="showRefresh"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <button
        type="button"
        class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white shadow-lg border border-blue-400/50"
        @click="reloadPage"
      >
        Refresh to get the latest content
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import TopHeader from '@/components/web/header/TopHeader.vue'
import VerticalNav from '@/components/web/navigation/VerticalNav.vue'
import MainContent from '@/components/MainContent.vue'
import AppFooter from '@/components/web/footer/AppFooter.vue'

// Inactivity detection (memory-only, no storage)
const route = useRoute()
const INACTIVITY_MS = 4 * 60 * 60 * 1000 // 4 hours
// For testing (10 seconds), uncomment the next line and comment the line above
// const INACTIVITY_MS = 10 * 1000

const CHECK_INTERVAL_MS = 60 * 1000 // check every 1 minute
// For testing (check quickly), uncomment the next line and comment the line above
// const CHECK_INTERVAL_MS = 1000
const lastActiveAtMs = ref(Date.now())
const hasTriggeredInactivity = ref(false)

const shouldShowForRoute = computed(() => route.name !== 'login')
const showRefresh = computed(() => shouldShowForRoute.value && hasTriggeredInactivity.value)

const markActivity = () => {
  if (!hasTriggeredInactivity.value) {
    lastActiveAtMs.value = Date.now()
  }
}

let intervalId = null

const startInactivityCheck = () => {
  // Periodically check for inactivity
  intervalId = window.setInterval(() => {
    if (!hasTriggeredInactivity.value) {
      const idleForMs = Date.now() - lastActiveAtMs.value
      if (idleForMs >= INACTIVITY_MS) {
        hasTriggeredInactivity.value = true
      }
    }
  }, CHECK_INTERVAL_MS)
}

const stopInactivityCheck = () => {
  if (intervalId) {
    window.clearInterval(intervalId)
    intervalId = null
  }
}

const handleVisibilityOrFocus = () => {
  // If the tab comes back into view, re-evaluate immediately
  if (!hasTriggeredInactivity.value) {
    const idleForMs = Date.now() - lastActiveAtMs.value
    if (idleForMs >= INACTIVITY_MS) {
      hasTriggeredInactivity.value = true
    }
  }
}

const reloadPage = () => {
  window.location.reload()
}

onMounted(() => {
  window.addEventListener('mousemove', markActivity, { passive: true })
  window.addEventListener('keydown', markActivity)
  window.addEventListener('scroll', markActivity, { passive: true })
  window.addEventListener('touchstart', markActivity, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityOrFocus)
  window.addEventListener('focus', handleVisibilityOrFocus)
  startInactivityCheck()
})

onBeforeUnmount(() => {
  stopInactivityCheck()
  window.removeEventListener('mousemove', markActivity)
  window.removeEventListener('keydown', markActivity)
  window.removeEventListener('scroll', markActivity)
  window.removeEventListener('touchstart', markActivity)
  document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
  window.removeEventListener('focus', handleVisibilityOrFocus)
})
</script>
