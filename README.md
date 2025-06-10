# Wanthykom

A Vue 3 application using the Composition API, integrated with Notion API for data management.

## Project Structure

```
wanthykom/
├── public/                  # Static files
├── src/
│   ├── assets/              # Static assets (images, fonts, etc.)
│   ├── components/          # Reusable Vue components
│   │   ├── AppFooter.vue    # Footer component
│   │   ├── MainContent.vue  # Main content wrapper
│   │   ├── PageHeadings.vue # Page headings (top bar)
│   │   └── VerticalNav.vue  # Vertical navigation sidebar
│   ├── composables/         # Vue 3 composables
│   ├── router/              # Vue Router configuration
│   ├── stores/              # Pinia stores
│   │   ├── notion.js        # Notion API store
│   │   └── counter.js       # Example counter store
│   ├── views/               # Page components
│   ├── App.vue              # Root Vue component
│   └── main.js              # Application entry point
├── .env                     # Environment variables
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
└── vite.config.js
```

## Layout Overview

The app uses a modern, responsive layout powered by Tailwind CSS:

- **PageHeadings.vue:** Top bar with the main page heading and subheading.
- **VerticalNav.vue:** Vertical navigation sidebar on the left (visible on desktop).
- **MainContent.vue:** Main content area, optimized for reading with a medium-dark background and readable text.
- **AppFooter.vue:** Footer at the bottom of the page.

All layout components are found in `src/components/` and are used in `App.vue` to compose the main layout.

### Customizing the Layout
- To add or change navigation links, edit `VerticalNav.vue`.
- To change the main heading or subheading, edit `PageHeadings.vue`.
- To adjust the reading experience (colors, spacing), modify the Tailwind classes in `MainContent.vue`.
- The footer content can be updated in `AppFooter.vue`.

### Example Layout Usage in App.vue

```vue
<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <PageHeadings />
    <div class="flex flex-1 w-full max-w-7xl mx-auto gap-0 md:gap-8 px-2 md:px-8 py-8">
      <VerticalNav class="hidden md:flex" />
      <MainContent>
        <RouterView />
      </MainContent>
    </div>
    <AppFooter />
  </div>
</template>
```

## Features

- Vue 3 with Composition API
- Pinia for state management
- Vue Router for navigation
- Integration with Notion API
- ESLint + Prettier for code quality
- Tailwind CSS for styling
- Environment-based configuration

## Prerequisites

- Node.js 16+ and npm 8+
- Notion API key (get it from [Notion Developers](https://developers.notion.com/))
- A Notion page with the required permissions (share the page with your integration)

## Notion Integration Setup

1. Create a new integration in [Notion Integrations](https://www.notion.so/my-integrations)
2. Note the "Internal Integration Token" (this is your API key)
3. Share your Notion page with the integration:
   - Open the page in Notion
   - Click "Share" in the top-right corner
   - Click "Invite" and select your integration
4. Copy the page ID from the URL (the part after the last hyphen)
5. Add the following to your `.env` file:
   ```
   VITE_NOTION_API_KEY=your_integration_token
   ```

## Project Setup

1. Install dependencies:

```sh
npm install
```

2. Create a `.env` file in the root directory and add your Notion API key:

```env
# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token

# Notion API
VITE_NOTION_API_KEY=your_notion_api_key

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_LOGS=false

# Development
VITE_DEV_SERVER_PORT=5173
```

## Using the Notion Store

The application includes a Pinia store for interacting with the Notion API. Here's how to use it in your components:

```javascript
import { useNotionStore } from '@/stores/notion';

// In your component setup
const notionStore = useNotionStore();

// Fetch page blocks
const loadPage = async () => {
  try {
    const blocks = await notionStore.fetchPageBlocks('your_page_id');
    console.log('Fetched blocks:', blocks);
  } catch (error) {
    console.error('Failed to load page:', error);
  }
};

// Access page data and blocks
const page = computed(() => notionStore.page);
const isLoading = computed(() => notionStore.isLoading);
```

### Development Server

Start the development server with hot-reload:

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
