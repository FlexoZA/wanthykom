# Wanthykom

A Vue 3 application using the Composition API, integrated with Notion API for data management.

## Project Structure

```
wanthykom/
├── public/                  # Static files
├── src/
│   ├── assets/              # Static assets (images, fonts, etc.)
│   ├── components/          # Reusable Vue components
│   │   ├── header/          # Header related components
│   │   ├── navigation/      # Navigation components
│   │   ├── footer/          # Footer components
│   │   ├── icons/           # Icon components
│   │   ├── helpers/         # Helper components
│   │   │   ├── FormattedText.vue    # Text formatting component
│   │   │   └── FormattedHeading.vue # Heading formatting component
│   │   ├── notion/          # Notion-specific components
│   │   │   └── NotionLandingContent.vue # Landing page content
│   │   └── MainContent.vue  # Main content wrapper
│   ├── composables/         # Vue 3 composables
│   ├── router/              # Vue Router configuration
│   ├── stores/              # Pinia stores
│   │   ├── notion.js        # Notion API store for page blocks
│   │   ├── notionPrefaceStore.js # Notion store for landing page
│   │   └── counter.js       # Example counter store
│   ├── views/               # Page components
│   │   └── HomeView.vue     # Landing page view
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

- **Header Components:** Top bar with the main page heading and subheading.
- **Navigation Components:** Vertical navigation sidebar on the left (visible on desktop).
- **MainContent.vue:** Main content area, optimized for reading with a medium-dark background and readable text.
- **Footer Components:** Footer at the bottom of the page.

### Component Structure

#### Notion Integration Components
- **NotionLandingContent.vue:** Displays Notion content with infinite scroll
  - Handles loading states
  - Supports images with captions
  - Supports formatted text (bold, italic, etc.)
  - Supports headings (h1, h2, h3)
  - Implements infinite scroll for long content

#### Helper Components
- **FormattedText.vue:** Handles text formatting from Notion
  - Supports bold, italic, strikethrough, underline
  - Supports code blocks
  - Supports text colors
- **FormattedHeading.vue:** Handles heading formatting
  - Supports h1, h2, h3
  - Maintains consistent styling
  - Integrates with FormattedText

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
- Infinite scroll for Notion content
- Responsive design
- Dark mode optimized

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

## Using the Notion Stores

The application includes two Pinia stores for interacting with the Notion API:

### Main Notion Store
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

### Preface Store (Landing Page)
```javascript
import { useNotionPrefaceStore } from '@/stores/notionPrefaceStore';

// In your component setup
const prefaceStore = useNotionPrefaceStore();

// Fetch the preface page
const loadPreface = async () => {
  try {
    const page = await prefaceStore.fetchPrefacePage('your_page_id');
    console.log('Fetched preface page:', page);
  } catch (error) {
    console.error('Failed to load preface page:', error);
  }
};

// Access page data
const title = computed(() => prefaceStore.getPageTitle);
const description = computed(() => prefaceStore.getPageDescription);
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
