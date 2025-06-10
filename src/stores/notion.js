import { defineStore } from 'pinia';
import { Client } from '@notionhq/client';

export const useNotionStore = defineStore('notion', {
  state: () => ({
    blocks: [],
    page: null,
    isLoading: false,
    error: null
  }),

  getters: {
    getBlockById: (state) => (id) => {
      return state.blocks.find(block => block.id === id);
    },
  },

  actions: {
    async fetchPageBlocks(pageId = '20e43e9f7da6805d803cd96ca0d8a889') {
      this.isLoading = true;
      this.error = null;
      
      try {
        const notion = new Client({
          auth: import.meta.env.VITE_NOTION_API_KEY.trim()
        });

        // Fetch the page
        const page = await notion.pages.retrieve({ page_id: pageId });
        this.page = page;

        // Fetch the page's blocks
        const response = await notion.blocks.children.list({
          block_id: pageId,
          page_size: 100, // Adjust as needed
        });

        this.blocks = response.results;
        return response.results;
      } catch (error) {
        console.error('Error fetching Notion data:', error);
        this.error = error.message || 'Failed to fetch data from Notion';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Helper method to get a specific block's children
    async fetchBlockChildren(blockId) {
      try {
        const notion = new Client({
          auth: import.meta.env.VITE_NOTION_API_KEY.trim()
        });

        const response = await notion.blocks.children.list({
          block_id: blockId,
          page_size: 100,
        });

        // Update the block in the store with its children
        const blockIndex = this.blocks.findIndex(b => b.id === blockId);
        if (blockIndex !== -1) {
          this.blocks[blockIndex].children = response.results;
        }

        return response.results;
      } catch (error) {
        console.error(`Error fetching children for block ${blockId}:`, error);
        throw error;
      }
    },
  },
});
