import { defineStore } from 'pinia'

const WEBHOOK_URL = '/api/n8n/webhook/c80b7283-00e5-4e74-8c1a-5067eca53ad5'

export const useWebhookStore = defineStore('webhook', {
  state: () => ({
    webhookData: null,
    loading: false,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  }),

  actions: {
    async fetchWebhookData() {
      this.loading = true
      this.error = null
      this.status = 'loading'

      try {
        console.log('DEBUG::webhookStore', 'Sending request to webhook')
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })

        const data = await response.json()
        console.log('DEBUG::webhookStore', 'Response:', data)

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        if (Array.isArray(data)) {
          this.webhookData = data
          this.status = 'success'
        } else {
          throw new Error('Expected an array from webhook')
        }
      } catch (error) {
        console.log('DEBUG::webhookStore', error)
        this.error = error.message
        this.status = 'error'
      } finally {
        this.loading = false
      }
    },
  },
})
