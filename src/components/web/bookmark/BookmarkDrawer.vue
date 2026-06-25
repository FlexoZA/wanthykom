<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="bm-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] bg-black/50"
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Drawer -->
    <Transition name="bm-slide">
      <aside
        v-if="open"
        class="fixed top-0 right-0 z-[70] h-full w-80 max-w-[85vw] flex flex-col bg-gray-800 text-gray-200 border-l border-gray-700 shadow-2xl"
        role="dialog"
        aria-label="Saved bookmarks"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2h12a1 1 0 011 1v18l-7-4-7 4V3a1 1 0 011-1z" />
            </svg>
            Bookmarks
            <span v-if="bookmarks.length" class="text-sm font-normal text-gray-400">
              ({{ bookmarks.length }})
            </span>
          </h2>
          <button
            @click="$emit('close')"
            class="p-1 hover:bg-gray-700 rounded"
            aria-label="Close bookmarks"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-if="bookmarks.length === 0"
          class="flex-1 flex flex-col items-center justify-center text-center px-6 text-gray-400 gap-3"
        >
          <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
          </svg>
          <p class="text-sm">No bookmarks yet.</p>
          <p class="text-xs text-gray-500">
            Select any text while reading and tap “Bookmark” to save it here.
          </p>
        </div>

        <!-- List -->
        <ul v-else class="flex-1 overflow-y-auto divide-y divide-gray-700">
          <li
            v-for="bm in bookmarks"
            :key="bm.id"
            class="group p-4 hover:bg-gray-700/50 transition-colors"
          >
            <button
              class="w-full text-left"
              @click="$emit('recall', bm)"
              title="Jump to this passage"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  v-if="bm.auto"
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gray-600 text-gray-300"
                >
                  Auto
                </span>
                <p v-if="bm.location" class="text-xs font-semibold text-amber-400/90 truncate">
                  {{ bm.location }}
                </p>
              </div>
              <p class="text-sm text-gray-200 line-clamp-3">“{{ bm.text }}”</p>
              <p class="text-xs text-gray-500 mt-2">
                {{ bm.auto ? 'Auto-saved · ' : '' }}{{ formatDate(bm.createdAt) }}
              </p>
            </button>
            <div class="mt-2 flex items-center gap-3">
              <button
                @click="$emit('recall', bm)"
                class="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Go to passage
              </button>
              <button
                @click="$emit('remove', bm.id)"
                class="text-xs text-red-400 hover:text-red-300 font-medium ml-auto"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>

        <!-- Footer -->
        <div v-if="bookmarks.length" class="px-4 py-3 border-t border-gray-700">
          <button
            @click="$emit('clear')"
            class="w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
          >
            Clear all bookmarks
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  bookmarks: { type: Array, default: () => [] },
})

defineEmits(['close', 'recall', 'remove', 'clear'])

const formatDate = (ts) =>
  new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>

<style scoped>
.bm-fade-enter-active,
.bm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.bm-fade-enter-from,
.bm-fade-leave-to {
  opacity: 0;
}
.bm-slide-enter-active,
.bm-slide-leave-active {
  transition: transform 0.25s ease;
}
.bm-slide-enter-from,
.bm-slide-leave-to {
  transform: translateX(100%);
}
</style>
