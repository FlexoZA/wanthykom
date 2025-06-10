import { defineStore } from 'pinia';
import { Client } from '@notionhq/client';

console.log('API Key:', import.meta.env.VITE_NOTION_API_KEY);

const notion = new Client({
  auth: import.meta.env.VITE_NOTION_API_KEY,
  notionVersion: '2022-06-28'
});

console.log('Notion client initialized:', notion);

export const useNotionPrefaceStore = defineStore('notionPreface', {
  state: () => ({
    pageData: {
      title: '',
      blocks: []
    },
    isLoading: false,
    error: null,
    hasMore: true,
    startCursor: null
  }),

  actions: {
    async fetchPrefacePage(pageId, loadMore = false) {
      if (!loadMore) {
        this.isLoading = true;
        this.error = null;
        this.blocks = [];
        this.hasMore = true;
        this.startCursor = null;
      }
      
      try {
        // Fetch page data (only on initial load)
        if (!loadMore) {
          const pageResponse = await fetch(`/api/notion/pages/${pageId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json'
            }
          });

          if (!pageResponse.ok) {
            throw new Error(`HTTP error! status: ${pageResponse.status}`);
          }

          const page = await pageResponse.json();
          this.pageData.title = page.properties.title.title[0]?.plain_text || '';
        }

        // Fetch blocks with pagination
        const blocksResponse = await fetch(`/api/notion/blocks/${pageId}/children${this.startCursor ? `?start_cursor=${this.startCursor}` : ''}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          }
        });

        if (!blocksResponse.ok) {
          throw new Error(`HTTP error! status: ${blocksResponse.status}`);
        }

        const blocksData = await blocksResponse.json();
        console.log('Blocks data:', blocksData);

        // Process blocks
        const newBlocks = blocksData.results
          .filter(block => ['paragraph', 'heading_1', 'heading_2', 'heading_3', 'image'].includes(block.type))
          .map(block => {
            if (block.type === 'image') {
              return {
                type: 'image',
                url: block.image.file?.url || block.image.external?.url || '',
                caption: block.image.caption?.map(cap => cap.plain_text).join('') || ''
              };
            } else {
              return {
                type: block.type,
                text: block[block.type].rich_text.map(text => ({
                  content: text.plain_text,
                  isBold: text.annotations.bold,
                  isItalic: text.annotations.italic,
                  isStrikethrough: text.annotations.strikethrough,
                  isUnderline: text.annotations.underline,
                  isCode: text.annotations.code,
                  color: text.annotations.color
                }))
              };
            }
          })
          .filter(block => {
            if (block.type === 'image') {
              return block.url.length > 0;
            } else {
              return block.text.some(t => t.content.length > 0);
            }
          });

        // Update state
        this.pageData.blocks = loadMore ? [...this.pageData.blocks, ...newBlocks] : newBlocks;
        this.hasMore = blocksData.has_more;
        this.startCursor = blocksData.next_cursor;

        return {
          blocks: newBlocks,
          hasMore: this.hasMore
        };
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  }
}); 