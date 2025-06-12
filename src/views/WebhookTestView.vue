<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Webhook Test</h1>

    <button
      @click="fetchData"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      :disabled="loading"
    >
      {{ loading ? 'Loading...' : 'Fetch Webhook Data' }}
    </button>

    <div v-if="error" class="text-red-500 mb-4">Error: {{ error }}</div>

    <div v-if="webhookData" class="bg-gray-100 p-4 rounded">
      <pre class="whitespace-pre-wrap">{{ JSON.stringify(webhookData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { useWebhookStore } from '@/stores/webhookStore'
import { storeToRefs } from 'pinia'

const store = useWebhookStore()
const { webhookData, loading, error } = storeToRefs(store)

const fetchData = () => {
  store.fetchWebhookData()
}
</script>
