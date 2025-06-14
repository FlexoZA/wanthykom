# Want hy kom

A Vue 3 application using the Composition API, integrated with Supabase for data management.

## Project Structure

```
wanthykom/
├── public/                  # Static files
├── src/
│   ├── assets/              # Static assets (images, fonts, etc.)
│   ├── components/          # Reusable Vue components
│   │   ├── book/           # Book related components
│   │   │   └── BookList.vue # Book listing and display component
│   │   ├── header/          # Header related components
│   │   ├── navigation/      # Navigation components
│   │   │   └── VerticalNav.vue # Vertical navigation sidebar
│   │   ├── footer/          # Footer components
│   │   ├── icons/           # Icon components
│   │   ├── helpers/         # Helper components
│   │   │   ├── FormattedText.vue    # Text formatting component
│   │   │   ├── FormattedHeading.vue # Heading formatting component
│   │   │   └── NotificationToast.vue # Reusable notification component
│   │   └── MainContent.vue  # Main content wrapper
│   ├── composables/         # Vue 3 composables
│   ├── router/              # Vue Router configuration
│   ├── stores/              # Pinia stores
│   │   ├── supabaseBookStore.js    # Supabase store for books
│   │   ├── supabaseArticleStore.js # Supabase store for articles
│   │   └── counter.js       # Example counter store
│   ├── views/               # Page components
│   │   ├── HomeView.vue     # Landing page view
│   │   └── BookView.vue     # Book display view
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

## Features

### Core Features

- Vue 3 with Composition API
- Pinia for state management
- Vue Router for navigation
- Integration with Supabase
- ESLint + Prettier for code quality
- Tailwind CSS for styling
- Environment-based configuration
- Responsive design
- Dark mode optimized

### Components

- **Book Components:**
  - **BookList.vue:** Displays books with their chapters and images
    - Hierarchical display of book name, images, and chapters
    - Responsive image handling
    - Chapter text formatting
    - Smooth scrolling to selected chapters
    - Dynamic chapter navigation

- **Header Components:** Top bar with the main page heading and subheading
- **Navigation Components:** 
  - **VerticalNav.vue:** Vertical navigation sidebar on the left (visible on desktop)
    - Responsive design (hidden on mobile)
    - Expandable book sections with chapter dropdowns
    - Active route highlighting
    - Sticky positioning
    - Automatic expansion of selected book
    - Collapsible chapter lists
- **MainContent.vue:** Main content area, optimized for reading with a medium-dark background
- **Footer Components:** Footer at the bottom of the page

### Helper Components

- **FormattedText.vue:** Handles text formatting
  - Supports bold, italic, strikethrough, underline
  - Supports code blocks
  - Supports text colors
- **FormattedHeading.vue:** Handles heading formatting
  - Supports h1, h2, h3
  - Maintains consistent styling
  - Integrates with FormattedText
- **NotificationToast.vue:** Reusable notification component
  - Supports multiple notification types (info, success, error, cache)
  - Auto-dismiss with fade animation
  - Uses v-model for two-way binding
  - Built with Composition API

### Using the Supabase Stores

The application includes Pinia stores for interacting with Supabase:

#### Book Store
```javascript
import { useSupabaseBookStore } from '@/stores/supabaseBookStore'

// In your component setup
const bookStore = useSupabaseBookStore()

// Fetch books
const loadBooks = async () => {
  try {
    await bookStore.fetchBooks()
    console.log('Fetched books:', bookStore.getBooks)
  } catch (error) {
    console.error('Failed to load books:', error)
  }
}

// Access book data
const books = computed(() => bookStore.getBooks)
const selectedBook = computed(() => bookStore.getSelectedBook)
const isLoading = computed(() => bookStore.getIsLoading)
```

#### Article Store
```javascript
import { useSupabaseArticleStore } from '@/stores/supabaseArticleStore'

// In your component setup
const articleStore = useSupabaseArticleStore()

// Fetch articles
const loadArticles = async () => {
  try {
    await articleStore.fetchArticles()
    console.log('Fetched articles:', articleStore.getArticles)
  } catch (error) {
    console.error('Failed to load articles:', error)
  }
}

// Access article data
const articles = computed(() => articleStore.getArticles)
const isLoading = computed(() => articleStore.getIsLoading)
```

## Prerequisites

- Node.js 16+ and npm 8+
- Supabase account and project

## Supabase Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Add the following to your `.env` file:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Project Setup

1. Install dependencies:

```sh
npm install
```

2. Create a `.env` file in the root directory and add your Supabase credentials:

```env
# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token

# Supabase
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_LOGS=false

# Development
VITE_DEV_SERVER_PORT=5173
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
