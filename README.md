# Wanthykom

A modern web application built with Vue 3, Vite, and Supabase.

## Features

- **Article System**
  - Rich content display with text and images
  - Responsive design with proper loading states
  - Articles ordered by creation date
  - Error handling and user-friendly feedback

- **Book Reading System**
  - Multi-chapter books with navigation
  - Smart collapsible sidebar navigation
  - Deep-linking to specific books and chapters
  - Smooth scrolling and URL-based chapter selection
  - Book headers and chapter-specific images

- **Dynamic Layout System**
  - Automatic layout switching based on routes
  - Separate public and admin interfaces
  - Responsive design with mobile optimization

- **Authentication System**
  - Supabase Auth integration with session management
  - Protected routes with navigation guards
  - Modal login dialog with loading states
  - Secure logout functionality
  - Remember me and error handling

- **Navigation System**
  - Sticky vertical navigation for books and chapters
  - Auto-expanding navigation based on current location
  - Responsive design (hidden on mobile)
  - Active state highlighting

## Project Structure

```
src/
├── App.vue
├── assets/
│   ├── images/           # Image assets
│   ├── logo.svg          # Application logo
│   └── main.css          # Global styles
├── components/
│   ├── admin/            # Admin-specific components
│   ├── article/
│   │   └── ArticleList.vue    # Article display component
│   ├── auth/
│   │   └── LoginDialog.vue    # Login dialog component
│   ├── book/
│   │   └── BookList.vue       # Book display with chapters
│   ├── footer/
│   │   └── AppFooter.vue      # Application footer
│   ├── header/
│   │   └── TopHeader.vue      # Application header
│   ├── helpers/
│   │   └── NotificationToast.vue  # Toast notifications
│   ├── icons/
│   │   ├── IconCommunity.vue
│   │   ├── IconDocumentation.vue
│   │   ├── IconEcosystem.vue
│   │   ├── IconSupport.vue
│   │   └── IconTooling.vue
│   ├── MainContent.vue       # Main content wrapper
│   └── navigation/
│       └── VerticalNav.vue   # Vertical navigation component
├── layouts/
│   ├── AdminLayout.vue       # Admin panel layout
│   └── DefaultLayout.vue     # Default public layout
├── lib/
│   └── supabase.js          # Supabase client configuration
├── main.js                  # Application entry point
├── router/
│   └── index.js            # Route configuration with layouts
├── stores/
│   ├── admin/              # Admin-specific stores
│   ├── authentication/
│   │   └── authenticationStore.js  # Auth state management
│   ├── supabase/           # Supabase-specific stores
│   ├── supabaseArticleStore.js     # Article data management
│   ├── supabaseBookStore.js        # Book data management
│   └── unsplashImageStore.js       # Image service integration
└── views/
    ├── admin/
    │   └── AdminDashboard.vue      # Admin dashboard view
    ├── auth/
    │   └── LoginView.vue           # Login page
    ├── BookView.vue                # Book reading interface
    └── HomeView.vue                # Home page with articles
```

## Layout System

The application uses a dynamic layout system that automatically switches between different layouts based on the current route. This provides a clean separation between public-facing pages and administrative interfaces.

### How It Works

1. **Dynamic Layout Component**: The root `App.vue` uses a dynamic component that renders the appropriate layout based on the route's metadata:

```vue
<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>
</template>
```

2. **Route-Based Layout Selection**: Each route specifies its layout in the `meta.layout` field:

```javascript
// Public routes use default layout
{
  path: '/',
  name: 'home',
  component: () => import('@/views/HomeView.vue'),
  meta: { layout: 'default' }
}

// Admin routes use admin layout
{
  path: '/admin',
  name: 'admin',
  component: () => import('@/views/admin/AdminDashboard.vue'),
  meta: { 
    layout: 'admin',
    requiresAuth: true 
  }
}
```

3. **Layout Resolution**: A router guard automatically resolves the layout component:

```javascript
router.beforeEach((to, from, next) => {
  const layout = to.meta.layout || 'default'
  to.meta.layoutComponent = layout === 'default' ? DefaultLayout : AdminLayout
  next()
})
```

### Available Layouts

#### Default Layout (`DefaultLayout.vue`)
- **Purpose**: Public-facing pages (home, books)
- **Features**:
  - Top header with branding
  - Main content area with sidebar navigation
  - Responsive design (sidebar hidden on mobile)
  - Footer
  - Gradient background styling

```vue
<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <TopHeader />
    <div class="flex flex-1 w-full max-w-7xl mx-auto gap-0 md:gap-8 px-2 md:px-8 py-8 relative">
      <MainContent class="flex-1">
        <RouterView />
      </MainContent>
      <VerticalNav class="hidden md:block" />
    </div>
    <AppFooter />
  </div>
</template>
```

#### Admin Layout (`AdminLayout.vue`)
- **Purpose**: Administrative interface
- **Features**:
  - Fixed vertical sidebar with admin navigation
  - Secure logout button with loading states
  - Full-height layout optimized for admin tasks
  - Dark theme styling

```vue
<template>
  <div class="min-h-screen bg-gray-900 flex">
    <!-- Fixed Sidebar -->
    <div class="w-64 bg-gray-800 fixed h-full">
      <nav><!-- Admin navigation --></nav>
      <button @click="handleLogout">Logout</button>
    </div>
    <!-- Main Content -->
    <div class="flex-1 ml-64 p-8">
      <RouterView />
    </div>
  </div>
</template>
```

### Layout Components

- **TopHeader.vue**: Application header for public pages
- **VerticalNav.vue**: Navigation sidebar for public pages
- **MainContent.vue**: Content wrapper component
- **AppFooter.vue**: Application footer

This system provides:
- **Automatic layout switching** based on routes
- **Clean separation** between public and admin interfaces
- **Consistent styling** within each layout type
- **Easy maintenance** - layout changes affect all relevant pages

## Article System

The application features a comprehensive article management system that displays articles with rich content including text and images. Articles are fetched from Supabase and displayed on the home page with a clean, responsive design.

### Features

- **Rich Content Display**: Articles support both text content and associated images
- **Responsive Images**: Article images are displayed with proper aspect ratios and responsive styling
- **Loading States**: Proper loading indicators while fetching articles
- **Error Handling**: Graceful error handling with user-friendly error messages
- **Automatic Ordering**: Articles are ordered by creation date (newest first)
- **Prose Styling**: Article text uses Tailwind's prose classes for optimal readability

### Database Structure

The article system uses two main Supabase tables:

```sql
-- Main articles table
article (
  id: uuid (primary key)
  article_name: text
  article_text: text
  created_at: timestamp
)

-- Article images table (one-to-many relationship)
article_image (
  id: uuid (primary key)
  article_id: uuid (foreign key)
  article_image_url: text
)
```

### Article Store (`supabaseArticleStore.js`)

The article store manages all article data and API interactions:

```javascript
import { useSupabaseArticleStore } from '@/stores/supabaseArticleStore'

// In your component
const articleStore = useSupabaseArticleStore()

// Fetch articles
await articleStore.fetchArticles()

// Access article data
const articles = computed(() => articleStore.getArticles)
const isLoading = computed(() => articleStore.getIsLoading)
const error = computed(() => articleStore.getError)
```

#### Store Methods

- **`fetchArticles()`**: Fetches all articles with their associated images from Supabase
- **`getArticles`**: Getter for the current articles array
- **`getIsLoading`**: Getter for loading state
- **`getError`**: Getter for error state

### Article Component (`ArticleList.vue`)

The main article display component with the following features:

```vue
<template>
  <div class="space-y-8">
    <div v-if="isLoading" class="text-gray-400">Loading articles...</div>
    <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>
    <div v-else>
      <div v-for="article in articles" :key="article.id">
        <h2 class="text-2xl font-bold text-gray-100 mb-4">{{ article.article_name }}</h2>
        
        <!-- Article Image -->
        <div v-if="article.article_image && article.article_image.length > 0" class="mb-6">
          <img
            :src="article.article_image[0].article_image_url"
            :alt="article.article_name"
            class="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <!-- Article Content -->
        <div class="prose prose-invert max-w-none">
          <p class="text-gray-300 whitespace-pre-wrap">{{ article.article_text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
```

#### Component Features

- **Conditional Rendering**: Shows loading, error, or content states appropriately
- **Image Handling**: Safely displays the first image if available
- **Text Formatting**: Preserves line breaks with `whitespace-pre-wrap`
- **Responsive Design**: Images and text adapt to different screen sizes
- **Dark Theme**: Styled for dark backgrounds with proper contrast

### Usage in Views

Articles are integrated into the home page (`HomeView.vue`):

```vue
<template>
  <div class="relative">
    <ArticleList />
  </div>
</template>

<script setup>
import ArticleList from '@/components/article/ArticleList.vue'
</script>
```

### Data Flow

1. **Home Page Load**: `HomeView.vue` renders `ArticleList.vue`
2. **Component Mount**: `ArticleList.vue` calls `articleStore.fetchArticles()` on mount
3. **API Request**: Store executes Supabase query with image relations
4. **Data Processing**: Articles and images are fetched and stored in the Pinia store
5. **Reactive Display**: Component reactively displays articles as they load

### Supabase Query

The store uses a relational query to fetch articles with their images:

```javascript
const { data, error } = await supabase
  .from('article')
  .select(`
    article_name,
    article_text,
    article_image (
      article_image_url
    )
  `)
  .order('created_at', { ascending: false })
```

This approach:
- Fetches articles and their related images in a single query
- Orders articles by creation date (newest first)
- Maintains referential integrity between articles and images
- Provides efficient data loading with minimal API calls

## Book System

The application features a sophisticated book reading system that displays books with chapters, navigation, and deep-linking capabilities. Books support rich content including headers, chapters with individual images, and smart navigation with URL-based chapter selection.

### Features

- **Multi-Chapter Books**: Books contain multiple chapters with individual content and images
- **Smart Navigation**: Collapsible sidebar navigation with book and chapter selection
- **Deep Linking**: URL-based navigation to specific books and chapters (`/books?book=BookName&chapter=ChapterName`)
- **Smooth Scrolling**: Automatic scrolling to selected chapters
- **Rich Content**: Support for book images, headers, and chapter-specific images
- **Responsive Design**: Sidebar navigation hidden on mobile, content adapts to screen size
- **Book Headers**: Introduction/summary sections for each book
- **Loading States**: Proper loading indicators and error handling
- **Auto-Expand Navigation**: Automatically expands the selected book's chapter list

### Database Structure

The book system uses a complex relational structure with four main tables:

```sql
-- Main books table
book (
  id: uuid (primary key)
  book_name: text
  created_at: timestamp
)

-- Book headers (introduction/summary sections)
book_header (
  id: uuid (primary key)
  book_id: uuid (foreign key)
  book_header_name: text
  book_header_text: text
)

-- Book chapters
chapter (
  id: uuid (primary key)
  book_id: uuid (foreign key)
  chapter_name: text
  chapter_text: text
  created_at: timestamp
)

-- Book cover images
book_image (
  id: uuid (primary key)
  book_id: uuid (foreign key)
  book_image_url: text
)

-- Chapter images
chapter_image (
  id: uuid (primary key)
  chapter_id: uuid (foreign key)
  chapter_image_url: text
)
```

### Book Store (`supabaseBookStore.js`)

The book store manages book data, selection, and navigation state:

```javascript
import { useSupabaseBookStore } from '@/stores/supabaseBookStore'

// In your component
const bookStore = useSupabaseBookStore()

// Fetch all books with chapters
await bookStore.fetchBooks()

// Select a specific book
bookStore.setSelectedBook(book)

// Access book data
const books = computed(() => bookStore.getBooks)
const selectedBook = computed(() => bookStore.getSelectedBook)
const isLoading = computed(() => bookStore.getIsLoading)
const error = computed(() => bookStore.getError)
```

#### Store Methods

- **`fetchBooks()`**: Fetches all books with their headers, chapters, and images
- **`setSelectedBook(book)`**: Sets the currently selected book for display
- **`getBooks`**: Getter for all available books
- **`getSelectedBook`**: Getter for the currently selected book
- **`getIsLoading`**: Getter for loading state
- **`getError`**: Getter for error state

### Book Component (`BookList.vue`)

The main book display component with advanced features:

```vue
<template>
  <div class="space-y-8">
    <div v-if="isLoading" class="text-gray-400">Loading Books...</div>
    <div v-else-if="error" class="text-red-400">Error: {{ error }}</div>
    <div v-else-if="!selectedBook" class="text-gray-400">Select a book from the navigation</div>
    <div v-else>
      <!-- Book Title -->
      <h2 class="text-2xl font-bold text-gray-100 mb-4">{{ selectedBook.book_name }}</h2>
      
      <!-- Book Cover Image -->
      <div v-if="selectedBook.book_image && selectedBook.book_image.length > 0" class="mb-6">
        <img :src="selectedBook.book_image[0].book_image_url" class="w-full h-80 object-cover rounded-lg" />
      </div>

      <!-- Book Headers (Introduction/Summary) -->
      <div v-if="selectedBook.book_header && selectedBook.book_header.length > 0" class="mb-6 space-y-4">
        <div v-for="header in selectedBook.book_header" :key="header.book_header_name" 
             class="bg-gray-800 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-200 mb-2">{{ header.book_header_name }}</h3>
          <p class="text-gray-300">{{ header.book_header_text }}</p>
        </div>
      </div>

      <!-- Chapters -->
      <div v-if="selectedBook.chapter && selectedBook.chapter.length > 0" class="space-y-8">
        <div v-for="chapter in selectedBook.chapter" :key="chapter.chapter_name" 
             class="border-t border-gray-700 pt-6"
             :ref="el => { if (el) chapterRefs[chapter.chapter_name] = el }">
          <h3 class="text-xl font-semibold text-gray-200 mb-4">{{ chapter.chapter_name }}</h3>
          
          <!-- Chapter Image -->
          <div v-if="chapter.chapter_image && chapter.chapter_image.length > 0" class="mb-4">
            <img :src="chapter.chapter_image[0].chapter_image_url" 
                 class="w-full h-48 object-cover rounded-lg" />
          </div>

          <!-- Chapter Content -->
          <div class="prose prose-invert max-w-none">
            <p class="text-gray-300 whitespace-pre-wrap">{{ chapter.chapter_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

#### Component Features

- **URL-Based Selection**: Automatically selects books and chapters based on URL query parameters
- **Chapter Scrolling**: Smooth scrolling to chapters when selected from navigation
- **Template Refs**: Uses Vue 3's template refs to manage chapter scroll positions
- **Rich Content Display**: Shows book headers, chapter images, and formatted text
- **Conditional Rendering**: Handles all loading, error, and empty states

### Navigation System (`VerticalNav.vue`)

The book navigation provides an intuitive way to browse books and chapters:

```vue
<template>
  <nav class="hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56">
    <!-- Back to home -->
    <RouterLink to="/" class="py-2 px-3 rounded hover:bg-gray-700">Voorwoord</RouterLink>

    <!-- Book Navigation -->
    <div v-for="book in books" :key="book.book_name" class="mb-4">
      <div class="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700"
           :class="{ 'bg-gray-700': isBookActive(book.book_name) }"
           @click="toggleBook(book.book_name)">
        <RouterLink :to="{ name: 'books', query: { book: book.book_name }}" 
                   class="font-semibold flex-grow">
          {{ book.book_name }}
        </RouterLink>
        <span>{{ expandedBooks[book.book_name] ? '▼' : '▶' }}</span>
      </div>

      <!-- Chapter Links -->
      <div v-if="expandedBooks[book.book_name] && book.chapter" class="ml-4 mt-2 space-y-1">
        <RouterLink v-for="chapter in book.chapter" :key="chapter.chapter_name"
                   :to="{ name: 'books', query: { book: book.book_name, chapter: chapter.chapter_name }}"
                   class="block py-1 px-3 rounded hover:bg-gray-700 text-sm">
          {{ chapter.chapter_name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
```

#### Navigation Features

- **Collapsible Books**: Click to expand/collapse chapter lists
- **Active State Highlighting**: Shows current book and chapter selection
- **Auto-Expand**: Automatically expands the selected book's chapters
- **Deep Linking**: All navigation links include proper query parameters
- **Responsive**: Hidden on mobile devices

### URL-Based Navigation

The book system supports sophisticated URL-based navigation:

```javascript
// Book selection
/books?book=BookName

// Chapter selection with auto-scroll
/books?book=BookName&chapter=ChapterName
```

#### URL Handling Features

- **Route Watchers**: Automatically respond to URL changes
- **Book Selection**: URL changes trigger book selection in the store
- **Chapter Scrolling**: Chapter query parameters trigger smooth scrolling
- **State Synchronization**: URL state stays in sync with component state

### Data Flow

1. **Page Load**: `BookView.vue` renders `BookList.vue`
2. **Data Fetching**: Component fetches all books with chapters and images
3. **Navigation Setup**: `VerticalNav.vue` displays book/chapter navigation
4. **URL Processing**: Route watchers process query parameters
5. **Book Selection**: Selected book is set in the store
6. **Chapter Navigation**: Chapter links trigger scrolling to specific sections
7. **State Updates**: All components stay synchronized through reactive stores

### Supabase Query

The store uses a complex relational query to fetch complete book data:

```javascript
const { data, error } = await supabase
  .from('book')
  .select(`
    book_name,
    book_header (
      book_header_name,
      book_header_text
    ),
    chapter (
      chapter_name,
      chapter_text,
      chapter_image (
        chapter_image_url
      )
    ),
    book_image (
      book_image_url
    )
  `)
  .order('created_at', { ascending: true })
```

This approach:
- Fetches books with all related data in a single query
- Maintains proper relationships between books, chapters, headers, and images
- Orders books by creation date
- Sorts chapters within each book by creation date
- Provides efficient data loading with minimal API overhead

## Default Layout Navigation System

The default layout features a sophisticated vertical navigation system (`VerticalNav.vue`) that provides intuitive browsing of books and chapters. The navigation is sticky, responsive, and integrates seamlessly with the URL-based routing system.

### Features

- **Sticky Sidebar**: Navigation stays visible while scrolling through content
- **Responsive Design**: Hidden on mobile devices, visible on desktop
- **Collapsible Tree Structure**: Books can be expanded/collapsed to show chapters
- **Active State Highlighting**: Current book and chapter are visually highlighted
- **Auto-Expansion**: Automatically expands the currently selected book
- **Smart Toggle**: Clicking a book collapses all others (accordion-style)
- **Deep Linking Integration**: All navigation items use proper URL query parameters
- **Smooth Transitions**: Hover effects and state changes with CSS transitions

### Navigation Structure

```vue
<template>
  <nav class="hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56 min-w-[12rem] border-l border-gray-700 sticky top-0 h-[calc(100vh-4rem)]">
    <!-- Home Link -->
    <RouterLink to="/" class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold" active-class="bg-gray-700">
      Voorwoord
    </RouterLink>

    <!-- Dynamic Book Navigation -->
    <div v-for="book in books" :key="book.book_name" class="mb-4">
      <!-- Book Header with Toggle -->
      <div class="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700 transition-colors cursor-pointer"
           :class="{ 'bg-gray-700': isBookActive(book.book_name) }"
           @click="toggleBook(book.book_name)">
        <RouterLink :to="{ name: 'books', query: { book: book.book_name }}" 
                   class="font-semibold flex-grow">
          {{ book.book_name }}
        </RouterLink>
        <span class="ml-2">{{ expandedBooks[book.book_name] ? '▼' : '▶' }}</span>
      </div>

      <!-- Collapsible Chapter List -->
      <div v-if="expandedBooks[book.book_name] && book.chapter" class="ml-4 mt-2 space-y-1">
        <RouterLink v-for="chapter in book.chapter" :key="chapter.chapter_name"
                   :to="{ name: 'books', query: { book: book.book_name, chapter: chapter.chapter_name }}"
                   class="block py-1 px-3 rounded hover:bg-gray-700 transition-colors text-sm"
                   :class="{ 'bg-gray-700': isChapterActive(book.book_name, chapter.chapter_name) }">
          {{ chapter.chapter_name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
```

### Navigation Logic

The navigation component uses sophisticated state management for optimal user experience:

```javascript
// Active state detection
const isBookActive = (bookName) => {
  return route.name === 'books' && route.query.book === bookName
}

const isChapterActive = (bookName, chapterName) => {
  return route.name === 'books' && 
         route.query.book === bookName && 
         route.query.chapter === chapterName
}

// Smart toggle functionality (accordion-style)
const toggleBook = (bookName) => {
  // Close all other books
  Object.keys(expandedBooks.value).forEach(key => {
    if (key !== bookName) {
      expandedBooks.value[key] = false
    }
  })
  // Toggle the clicked book
  expandedBooks.value[bookName] = !expandedBooks.value[bookName]
}
```

### Auto-Expansion System

The navigation automatically responds to URL changes and expands the appropriate book:

```javascript
// Watch for route changes to automatically expand the selected book
watch(() => route.query.book, (newBook) => {
  if (newBook) {
    // Close all other books
    Object.keys(expandedBooks.value).forEach(key => {
      if (key !== newBook) {
        expandedBooks.value[key] = false
      }
    })
    // Expand the selected book
    expandedBooks.value[newBook] = true
  } else {
    // If no book is selected, close all books
    Object.keys(expandedBooks.value).forEach(key => {
      expandedBooks.value[key] = false
    })
  }
}, { immediate: true })
```

### Integration with Default Layout

The navigation is seamlessly integrated into the default layout:

```vue
<!-- DefaultLayout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <TopHeader />
    <div class="flex flex-1 w-full max-w-7xl mx-auto gap-0 md:gap-8 px-2 md:px-8 py-8 relative">
      <!-- Main Content -->
      <MainContent class="flex-1">
        <RouterView />
      </MainContent>
      <!-- Vertical Navigation -->
      <VerticalNav class="hidden md:block" />
    </div>
    <AppFooter />
  </div>
</template>
```

### Responsive Behavior

- **Desktop (md and up)**: Navigation is visible as a fixed-width sidebar
- **Mobile (below md)**: Navigation is completely hidden to maximize content space
- **Tablet**: Users rely on other navigation methods or landscape orientation

### Styling Features

- **Dark Theme**: Consistent with the application's dark color scheme
- **Hover Effects**: Smooth transitions on hover states
- **Active States**: Clear visual indication of current location
- **Typography Hierarchy**: Book names are bold, chapters are smaller and indented
- **Spacing**: Proper spacing between navigation levels and items

### CSS Classes and Layout

```css
/* Navigation container */
.navigation-container {
  @apply hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56 min-w-[12rem] border-l border-gray-700 sticky top-0 h-[calc(100vh-4rem)];
}

/* Book links */
.book-link {
  @apply flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700 transition-colors cursor-pointer;
}

/* Chapter links */
.chapter-link {
  @apply block py-1 px-3 rounded hover:bg-gray-700 transition-colors text-sm;
}

/* Active states */
.active-item {
  @apply bg-gray-700;
}
```

### Navigation Data Flow

1. **Component Mount**: Fetches books from Supabase store
2. **Route Detection**: Monitors current route and query parameters
3. **Auto-Expansion**: Expands relevant book based on current URL
4. **User Interaction**: Handles clicks for manual book expansion/collapse
5. **State Synchronization**: Keeps navigation state in sync with URL
6. **Active Highlighting**: Updates visual states based on current location

### Benefits

- **Intuitive Browsing**: Users can easily navigate between books and chapters
- **Context Awareness**: Always shows where the user is in the content hierarchy
- **Efficient Space Usage**: Collapsible design prevents overwhelming the interface
- **Mobile Optimization**: Responsive design prioritizes content on small screens
- **URL Synchronization**: Navigation state persists across page refreshes
- **Accessibility**: Proper semantic HTML and keyboard navigation support

This navigation system transforms the application from a simple content viewer into a sophisticated digital library interface, providing users with powerful tools to explore and navigate complex, multi-chapter content.

## Authentication System

The application features a robust authentication system built with Supabase Auth, providing secure user management with session handling, protected routes, and a complete login/logout flow. The system uses Pinia for state management and Vue Router guards for route protection.

### Features

- **Supabase Integration**: Built on Supabase Auth for secure, scalable authentication
- **Session Management**: Automatic session handling with persistence across page refreshes
- **Protected Routes**: Route guards that redirect unauthenticated users to login
- **Modal Login Dialog**: Reusable login component with loading states and error handling
- **Secure Logout**: Safe logout with loading states and proper session cleanup
- **Remember Me**: Optional session persistence
- **Error Handling**: User-friendly error messages for authentication failures
- **Auto-Redirect**: Automatic redirection after successful login/logout
- **Loading States**: Visual feedback during authentication operations

### Authentication Store (`authenticationStore.js`)

The authentication store manages user state, sessions, and authentication operations:

```javascript
import { useAuthStore } from '@/stores/authentication/authenticationStore'

// In your component
const authStore = useAuthStore()

// Initialize authentication state
await authStore.initialize()

// Sign in a user
const { data, error } = await authStore.signIn(email, password)

// Sign out current user
const { error } = await authStore.signOut()

// Get current user
const currentUser = authStore.getCurrentUser()

// Get current session
const currentSession = authStore.getSession()

// Access reactive state
const user = computed(() => authStore.user)
const loading = computed(() => authStore.loading)
```

#### Store Architecture

The store uses Vue 3's Composition API with Pinia:

```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(true)

  // Initialize auth state and set up listeners
  const initialize = async () => {
    try {
      // Get initial session
      const { data: { session: initialSession }, error } = await supabase.auth.getSession()
      if (error) throw error

      session.value = initialSession
      user.value = initialSession?.user ?? null
      loading.value = false

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } catch (error) {
      console.error('Error initializing auth:', error.message)
      loading.value = false
    }
  }

  return { user, session, loading, initialize, signIn, signOut, getCurrentUser, getSession }
})
```

#### Store Methods

- **`initialize()`**: Sets up auth state and listeners
- **`signIn(email, password)`**: Authenticates user with email/password
- **`signOut()`**: Signs out current user and clears session
- **`getCurrentUser()`**: Returns current user object
- **`getSession()`**: Returns current session object

### Login Components

#### LoginDialog Component (`LoginDialog.vue`)

A reusable modal dialog for authentication:

```vue
<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl relative">
      <!-- Close button -->
      <button @click="emit('update:modelValue', false)" class="absolute top-4 right-4">×</button>

      <div class="text-center">
        <h2 class="text-3xl font-bold text-white">Login</h2>
        <p class="mt-2 text-gray-400">Sign in to your account</p>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <!-- Email Input -->
        <input v-model="email" type="email" required :disabled="isLoading" 
               class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white" 
               placeholder="Enter your email" />

        <!-- Password Input -->
        <input v-model="password" type="password" required :disabled="isLoading"
               class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
               placeholder="Enter your password" />

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input v-model="rememberMe" type="checkbox" :disabled="isLoading" />
            <span class="ml-2 text-sm text-gray-300">Remember me</span>
          </label>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-400">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="isLoading" 
                class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>
```

#### Component Features

- **Modal Overlay**: Full-screen overlay with backdrop blur
- **Loading States**: Disabled inputs and loading spinner during authentication
- **Error Display**: Shows authentication errors to users
- **Form Validation**: Required fields with proper input types
- **Remember Me**: Checkbox for session persistence
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper labels and keyboard navigation

#### LoginView Component (`LoginView.vue`)

The dedicated login page that handles authentication flow:

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-md p-4">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-white">Login Required</h1>
        <p class="text-gray-400 mt-2">Please log in to access the admin panel</p>
      </div>

      <LoginDialog
        ref="loginDialog"
        v-model="showLogin"
        :is-loading="isLoading"
        @login="handleLogin"
      />
    </div>
  </div>
</template>

<script setup>
const handleLogin = async (credentials) => {
  try {
    isLoading.value = true
    const { data, error } = await authStore.signIn(credentials.email, credentials.password)
    
    if (error) {
      loginDialog.value?.setError(error.message)
      return
    }

    router.push('/admin')
  } catch (error) {
    loginDialog.value?.setError(error.message || 'An error occurred during login')
  } finally {
    isLoading.value = false
  }
}
</script>
```

### Route Protection

The application uses Vue Router navigation guards to protect admin routes:

```javascript
// Router configuration with auth guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if not already done
  if (!isAuthInitialized) {
    await authStore.initialize()
    isAuthInitialized = true
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const currentUser = authStore.getCurrentUser()

  // If route requires auth and user is not logged in, redirect to login
  if (requiresAuth && !currentUser) {
    console.log('Auth required, redirecting to login')
    next({ name: 'login' })
    return
  }

  next()
})
```

#### Protected Routes

Routes that require authentication are marked with `meta.requiresAuth`:

```javascript
{
  path: '/admin',
  name: 'admin',
  component: () => import('@/views/admin/AdminDashboard.vue'),
  meta: {
    layout: 'admin',
    requiresAuth: true  // This route requires authentication
  }
}
```

### Logout Functionality

The admin layout includes secure logout functionality:

```javascript
// AdminLayout.vue logout handler
const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    const { error } = await authStore.signOut()
    
    if (error) {
      console.error('Logout failed:', error.message)
      return
    }

    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
```

### Authentication Flow

1. **App Initialization**: Auth store initializes and checks for existing session
2. **Route Access**: User attempts to access protected route
3. **Auth Check**: Router guard checks if route requires authentication
4. **Login Redirect**: Unauthenticated users are redirected to login page
5. **Login Process**: User enters credentials in login dialog
6. **Authentication**: Supabase validates credentials and creates session
7. **State Update**: Auth store updates user and session state
8. **Route Access**: User is redirected to intended route or admin dashboard
9. **Session Persistence**: Session persists across page refreshes
10. **Logout**: User can securely logout from admin panel

### Security Features

- **Secure Session Storage**: Sessions are managed by Supabase
- **Token-Based Authentication**: Uses JWT tokens for secure communication
- **Route Protection**: Server-side route protection through navigation guards
- **Session Validation**: Automatic session validation on app initialization
- **Secure Logout**: Proper session cleanup on logout
- **Error Handling**: Secure error messages that don't expose system details

### Usage Examples

#### Check Authentication Status
```javascript
// In any component
const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.getCurrentUser())
```

#### Conditional Rendering Based on Auth
```vue
<template>
  <div v-if="isAuthenticated">
    <p>Welcome, {{ user.email }}!</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <button @click="showLogin = true">Login</button>
  </div>
</template>
```

#### Programmatic Navigation
```javascript
// Redirect to login
router.push('/login')

// Redirect to admin after login
router.push('/admin')
```

This authentication system provides enterprise-grade security while maintaining a smooth user experience, ensuring that sensitive admin functionality is properly protected while keeping the public content accessible to all users.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- Vue 3 with Composition API
- Vite for build tooling
- Tailwind CSS for styling
- Supabase for authentication and backend
- Vue Router for navigation
- Pinia for state management

## Security

- Protected routes with authentication checks
- Secure session management with Supabase
- Environment variables for sensitive data
- Loading states to prevent multiple submissions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
