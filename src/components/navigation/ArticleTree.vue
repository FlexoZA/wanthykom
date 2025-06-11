<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="text-gray-400 py-2 px-3">
      Loading articles...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-red-400 py-2 px-3">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="!items || items.length === 0" class="text-gray-400 py-2 px-3">
      No articles found (Debug: {{ debugInfo }})
    </div>

    <!-- Tree structure -->
    <ul v-else class="space-y-1">
      <li v-for="item in items" :key="item.id" class="text-gray-300">
        <!-- Parent item with children -->
        <div v-if="item.children" class="parent-item">
          <button
            @click="toggleItem(item.id)"
            class="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-700': isExpanded(item.id) }"
          >
            <span class="font-medium text-gray-200">{{ item.title }}</span>
            <span 
              class="transform transition-transform duration-200 text-gray-400"
              :class="{ 'rotate-90': isExpanded(item.id) }"
            >
              ›
            </span>
          </button>
          <div 
            v-show="isExpanded(item.id)"
            class="ml-4 mt-1 space-y-1 transition-all duration-200"
          >
            <RouterLink
              v-for="child in item.children"
              :key="child.id"
              :to="`/article/${child.id}`"
              class="block py-1 px-3 rounded hover:bg-gray-700 transition-colors"
              active-class="bg-gray-700 font-semibold"
            >
              {{ child.title }}
            </RouterLink>
          </div>
        </div>

        <!-- Leaf item (no children) -->
        <RouterLink
          v-else
          :to="`/article/${item.id}`"
          class="block py-2 px-3 rounded hover:bg-gray-700 transition-colors"
          active-class="bg-gray-700 font-semibold"
        >
          {{ item.title }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const expandedItems = ref(new Set())

const toggleItem = (id) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

const isExpanded = (id) => expandedItems.value.has(id)

const debugInfo = computed(() => {
  if (!props.items) return 'items is null'
  if (!Array.isArray(props.items)) return `items is not an array: ${typeof props.items}`
  return `items length: ${props.items.length}, items: ${JSON.stringify(props.items)}`
})
</script>

<style scoped>
.parent-item button {
  text-align: left;
}

.parent-item button span:last-child {
  font-size: 1.2em;
  line-height: 1;
}
</style> 