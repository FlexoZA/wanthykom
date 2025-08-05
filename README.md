# Wanthykom

A modern web application built with Vue 3, Vite, and Supabase for content management and book reading.

## Features

- **Article System**: Rich content management with categorization, featured article support, and responsive display
- **Book Reading System**: Multi-chapter books with smart navigation, deep-linking, and chapter-specific content
- **Admin Management Systems**: Complete CRUD operations for articles, books, chapters, and headers following consistent patterns
- **Authentication System**: Secure Supabase Auth integration with protected routes and session management
- **Media Manager System**: Comprehensive image management with drag & drop uploads and storage analytics
- **UI Component System**: Reusable components with consistent dark theme and accessibility

## Architecture

All admin systems follow consistent patterns:
- **Component Architecture**: MainView → EntityList → AddEntity → EntityView → UpdateEntity
- **Event-Driven Communication**: Vue events for component communication
- **Form Features**: Dual-mode forms with validation, loading states, and MediaManager integration
- **Store Pattern**: Pinia stores with standard CRUD methods and reactive getters
- **UI Consistency**: Shared components, toast notifications, and confirmation dialogs

## Database Schema

**Core Tables:**
- `article` - Articles with categories, featured status, and enable flags
- `article_catagory` - Article categories for organization
- `book` - Books with multi-chapter support
- `book_header` - Book introduction/summary sections
- `chapter` - Book chapters with images and content
- `*_image` tables - One-to-many image relationships

**Key Features:**
- Row Level Security (RLS) for access control
- Foreign key relationships with cascade deletes
- `enable` fields for public/admin visibility control
- `article_featured` for home vs articles page separation
- Supabase Storage integration for media files

## Project Structure

```
src/
├── App.vue
├── assets/
│   ├── logo.svg          # Application logo
│   └── main.css          # Global styles
├── components/
│   ├── admin/            # Admin-specific components
│   │   ├── article/
│   │   │   ├── AddArticle.vue          # Article creation/editing form
│   │   │   ├── AdminArticleList.vue    # Admin article list view
│   │   │   ├── ArticleView.vue         # Single article view
│   │   │   └── UpdateArticle.vue       # Article update wrapper
│   │   ├── book/
│   │   │   ├── AddBook.vue             # Book creation/editing form
│   │   │   ├── BookList.vue            # Admin book list view
│   │   │   ├── BookView.vue            # Single book view
│   │   │   └── UpdateBook.vue          # Book update wrapper
│   │   ├── book-header/
│   │   │   ├── AddBookHeader.vue       # Book header creation/editing form
│   │   │   ├── BookHeaderList.vue      # Admin book header list view
│   │   │   ├── BookHeaderView.vue      # Single book header view
│   │   │   └── UpdateBookHeader.vue    # Book header update wrapper
│   │   ├── chapter/
│   │   │   ├── AddChapter.vue          # Chapter creation/editing form
│   │   │   ├── ChapterList.vue         # Admin chapter list view
│   │   │   ├── ChapterView.vue         # Single chapter view
│   │   │   └── UpdateChapter.vue       # Chapter update wrapper
│   │   ├── dialogs/
│   │   │   └── ConfirmationDialog.vue  # Reusable confirmation modal
│   │   ├── helpers/
│   │   │   └── LoadingAnimation.vue    # Custom loading animation
│   │   ├── media/
│   │   │   └── MediaManager.vue        # Media management interface
│   │   ├── navigation/
│   │   │   └── AdminNavigation.vue     # Admin panel navigation
│   │   └── notification/
│   │       └── NotificationToast.vue   # Toast notification system
│   ├── auth/
│   │   └── LoginDialog.vue             # Login dialog component
│   ├── icons/
│   │   ├── IconCommunity.vue
│   │   ├── IconDocumentation.vue
│   │   ├── IconEcosystem.vue
│   │   ├── IconSupport.vue
│   │   └── IconTooling.vue
│   ├── web/                # Public-facing web components
│   │   ├── article/
│   │   │   └── ArticleList.vue         # Public article display
│   │   ├── book/
│   │   │   └── BookList.vue            # Book display with chapters
│   │   ├── footer/
│   │   │   └── AppFooter.vue           # Application footer
│   │   ├── header/
│   │   │   └── TopHeader.vue           # Application header
│   │   ├── helpers/
│   │   │   └── NotificationToast.vue   # Web notification toast
│   │   └── navigation/
│   │       └── VerticalNav.vue         # Vertical navigation component
│   └── MainContent.vue                 # Main content wrapper
├── layouts/
│   ├── AdminLayout.vue                 # Admin panel layout
│   └── DefaultLayout.vue               # Default public layout
├── lib/
│   └── supabase.js                     # Supabase client configuration
├── main.js                             # Application entry point
├── router/
│   └── index.js                        # Route configuration with layouts
├── stores/
│   ├── admin/                          # Admin-specific stores
│   │   ├── AdminArticleStore.js        # Admin article management
│   │   ├── AdminArticleCategoryStore.js # Admin article category management
│   │   ├── AdminBookHeaderStore.js     # Admin book header management
│   │   ├── AdminBookstore.js           # Admin book management
│   │   ├── AdminChapterStore.js        # Admin chapter management
│   │   └── mediaManagerStore.js        # Media management state
│   ├── authentication/
│   │   └── authenticationStore.js      # Auth state management
│   └── web/                            # Public web stores
│       ├── supabaseArticleStore.js     # Public article data management
│       ├── supabaseArticleCategoryStore.js # Public article category management
│       ├── supabaseBookStore.js        # Book data management
│       └── unsplashImageStore.js       # Image service integration
├── utils/
│   └── validation.js                   # Form validation utilities
└── views/
    ├── admin/
    │   ├── AdminDashboard.vue          # Admin dashboard view
    │   ├── article/
    │   │   └── ArticlesView.vue        # Admin articles management
    │   ├── book/
    │   │   └── BooksView.vue           # Admin books management
    │   ├── book-header/
    │   │   └── BookHeadersView.vue     # Admin book headers management
    │   ├── chapter/
    │   │   └── ChaptersView.vue        # Admin chapters management
    │   └── media/
    │       └── MediaManagerView.vue    # Media management view
    ├── auth/
    │   └── LoginView.vue               # Login page
    └── web/                            # Public web views
        ├── BookView.vue                # Book reading interface
        └── HomeView.vue                # Home page with articles
```

## Layout System

Dynamic layout switching between public (`DefaultLayout`) and admin (`AdminLayout`) interfaces based on route metadata. Public layout includes header, sidebar navigation, and footer. Admin layout has fixed sidebar with navigation and logout functionality.

## UI Components

**Core Components:**
- **ConfirmationDialog**: Modal dialogs for user confirmations with customizable content
- **NotificationToast**: Toast notifications (success/error/info) with auto-dismiss and progress indicators  
- **LoadingAnimation**: Custom ripple loading animation with brand colors

All components use Tailwind CSS with consistent dark theme, accessibility features, and responsive design.

## Article System

Displays articles with rich content (text and images) on the home page. Features categorization with dropdown selection, featured article support for home vs articles page separation, and responsive design with loading states.

## Category-Based Navigation System

Dynamic category navigation that displays article categories as main menu items, with smart filtering to show only categories containing enabled, non-featured articles.



## Admin Systems

All admin systems follow the [Architecture](#architecture) patterns for consistent CRUD operations:

### Article Management
Complete article CRUD with category management, featured article toggles, and reactive state updates.

### Architecture Overview

The admin article system follows the standard [Common Admin Patterns](#common-admin-patterns) described above, with the following specific implementation:

```
ArticlesView (Main Container)
├── AdminArticleList (List all articles)
├── AddArticle (Create/Edit form)
├── ArticleView (View single article)
└── UpdateArticle (Edit wrapper component)
```

### Database Structure

The admin article system works with the same database structure defined in the [Database Schema](#database-schema) section, with full access to all fields including administrative controls.

### Admin Article Store (`AdminArticleStore.js`)

The admin store provides comprehensive CRUD operations with reactive state management using Pinia:

```javascript
import { useSupabaseAdminArticleStore } from '@/stores/admin/AdminArticleStore'

// In your component
const articleStore = useSupabaseAdminArticleStore()

// Fetch all articles with categories and metadata
await articleStore.fetchArticles()

// Fetch single article
const article = await articleStore.fetchArticle(articleId)

// Create new article
await articleStore.createArticle({
  article_name: 'Title',
  article_text: 'Content',
  article_catagory_id: 1, // Required category selection
  enable: true,
})

// Update existing article
await articleStore.updateArticle(articleId, {
  article_name: 'Updated Title',
  article_text: 'Updated Content',
  article_catagory_id: 2,
  enable: false,
})

// Delete article (automatically refreshes list)
await articleStore.deleteArticle(articleId)

// Access reactive state
const articles = computed(() => articleStore.getArticles)
const isLoading = computed(() => articleStore.getIsLoading)
const error = computed(() => articleStore.getError)
```

#### Store Methods

- **`fetchArticles()`**: Retrieves all articles with categories and metadata, updates reactive state
- **`fetchArticle(id)`**: Retrieves a single article by ID
- **`createArticle(data)`**: Creates a new article with automatic timestamps and refreshes list
- **`updateArticle(id, data)`**: Updates an existing article with new timestamp and refreshes list
- **`deleteArticle(id)`**: Safely deletes an article and automatically refreshes the list
- **Getters**: `getArticles`, `getIsLoading`, `getError` for reactive state access

#### Store Architecture

The store uses Pinia's `defineStore` pattern with reactive state management:

```javascript
export const useSupabaseAdminArticleStore = defineStore('supabaseAdminArticle', () => {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Computed getters
  const getArticles = computed(() => articles.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)

  // All CRUD operations automatically update reactive state
  // No manual refresh calls needed in components
})

### Main Container (`ArticlesView.vue`)

The main container manages different views through local state:

```vue
<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Articles Management</h1>
      <p class="text-gray-400 mt-2">Manage your articles</p>
    </div>

    <!-- Dynamic Component Rendering -->
    <AdminArticleList
      v-if="currentView === 'list'"
      @create-article="currentView = 'create'"
      @view-article="handleViewArticle"
      @edit-article="handleEditArticle"
      @delete-article="handleDeleteArticle"
    />

    <AddArticle
      v-else-if="currentView === 'create'"
      @article-created="handleArticleCreated"
      @cancel="currentView = 'list'"
    />

    <ArticleView
      v-else-if="currentView === 'view'"
      :article-id="selectedArticleId"
      @edit-article="handleEditArticle"
      @back="currentView = 'list'"
    />

    <UpdateArticle
      v-else-if="currentView === 'edit'"
      :article-id="selectedArticleId"
      @article-updated="handleArticleUpdated"
      @cancel="currentView = 'list'"
    />
  </div>
</template>
```

#### State Management

```javascript
const currentView = ref('list') // 'list' | 'create' | 'view' | 'edit'
const selectedArticleId = ref(null)

// Event handlers for seamless navigation
const handleViewArticle = (articleId) => {
  selectedArticleId.value = articleId
  currentView.value = 'view'
}

const handleEditArticle = (articleId) => {
  selectedArticleId.value = articleId
  currentView.value = 'edit'
}

const handleDeleteArticle = async (articleId) => {
  await articleStore.deleteArticle(articleId)
  // List automatically updates through reactive store
}
```

### Article List Component (`ArticleList.vue`)

Displays all articles in a responsive grid with action buttons using reactive store data:

```vue
<template>
  <div class="space-y-4">
    <!-- Create Button -->
    <div class="flex justify-end">
      <button @click="$emit('create-article')" class="bg-green-600 hover:bg-green-700">
        <svg><!-- Plus icon --></svg>
        Create New Article
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="grid gap-4">
      <div v-for="article in articles" :key="article.id" class="bg-gray-800 rounded-lg p-4">
        <div class="flex gap-4">
          <!-- Article Image -->
          <div class="w-24 h-24">
            <img
              v-if="article.article_image_url"
              :src="article.article_image_url"
            />
            <div v-else class="bg-gray-600 flex items-center justify-center">
              <svg><!-- Image placeholder icon --></svg>
            </div>
          </div>

          <!-- Article Details -->
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white">{{ article.article_name }}</h3>
              <div class="flex items-center gap-2">
                <!-- Category Badge -->
                <span
                  v-if="article.article_catagory && article.article_catagory.catagory_name"
                  class="px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-300"
                >
                  {{ article.article_catagory.catagory_name }}
                </span>
                <!-- Status Badge -->
                <span
                  :class="article.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ article.enable ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>

            <p class="text-gray-400 mb-3">{{ article.article_text.substring(0, 120) }}...</p>

            <!-- Timestamps -->
            <div class="text-xs text-gray-500 mb-3">
              <div>Created: {{ formatDate(article.created_at) }}</div>
              <div>
                Last updated:
                {{ article.updated_at ? formatDate(article.updated_at) : 'No updates yet' }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <button @click="viewArticle(article.id)" class="bg-blue-600 hover:bg-blue-700">
                  View Article
                </button>
                <button @click="editArticle(article.id)" class="bg-gray-600 hover:bg-gray-700">
                  Edit Article
                </button>
              </div>
              <button @click="deleteArticle(article.id)" class="bg-red-600 hover:bg-red-700">
                <svg><!-- Trash icon --></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

#### List Features

- **Responsive Grid**: Adapts to different screen sizes
- **Article Previews**: Shows title, truncated content, and metadata
- **Status Indicators**: Visual badges for enabled/disabled articles
- **Category Display**: Purple badges showing article categories
- **Action Buttons**: View, edit, and delete with clear visual hierarchy
- **Image Handling**: Displays article images or placeholder icons
- **Date Formatting**: Human-readable creation and update dates
- **Delete Confirmation**: Requires user confirmation before deletion
- **Reactive Updates**: Automatically updates when store data changes
- **No Manual Refresh**: List updates automatically after operations

### Article Form Component (`AddArticle.vue`)

A versatile form component that handles both creation and editing:

```vue
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-white mb-6">
      {{ mode === 'create' ? 'Add New Article' : 'Edit Article' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Enable/Disable Toggle -->
      <div class="flex items-center justify-between">
        <label class="text-white">Enable Article</label>
        <button
          type="button"
          @click="formData.enable = !formData.enable"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          :class="formData.enable ? 'bg-green-600' : 'bg-gray-600'"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="formData.enable ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <!-- Article Category Selection -->
      <div>
        <label class="block text-white mb-2">Article Category</label>
        <select
          v-model="formData.article_catagory_id"
          :disabled="categoriesLoading"
          required
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Select a category</option>
          <option
            v-for="category in availableCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.catagory_name }}
          </option>
        </select>
      </div>

      <!-- Article Title -->
      <div>
        <label class="block text-white mb-2">Article Title</label>
        <input
          v-model="formData.article_name"
          type="text"
          required
          class="w-full bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Enter article title"
        />
      </div>

      <!-- Article Content -->
      <div>
        <label class="block text-white mb-2">Article Text</label>
        <textarea
          v-model="formData.article_text"
          required
          rows="10"
          class="w-full bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Enter article content"
        ></textarea>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-2">
        <button
          v-if="mode === 'create'"
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !formData.article_name.trim() || !formData.article_text.trim() || !formData.article_catagory_id"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {{ isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Article' : 'Update Article' }}
        </button>
      </div>
    </form>
  </div>
</template>
```

#### Form Features

The article form implements all [Common Form Features](#common-form-features) with these article-specific additions:

- **Required Category Selection**: Category selection is required for all articles
- **Category Integration**: Dropdown populated from article category store
- **Button State Management**: Submit button disabled until all required fields are filled

### Article View Component (`ArticleView.vue`)

Displays a single article with full content and metadata:

```vue
<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">View Article</h1>
      <div class="flex gap-2">
        <button @click="$emit('edit-article', articleId)" class="bg-blue-600 hover:bg-blue-700">
          <svg><!-- Edit icon --></svg>
          Edit Article
        </button>
        <button @click="$emit('back')" class="bg-gray-600 hover:bg-gray-700">
          <svg><!-- Back icon --></svg>
          Back to Articles
        </button>
      </div>
    </div>

    <div v-if="article" class="bg-gray-800 rounded-lg p-6">
      <!-- Status and Category Badges -->
      <div class="mb-6 flex items-center gap-2">
        <span
          v-if="article.article_catagory && article.article_catagory.catagory_name"
          class="px-3 py-1 text-sm rounded-full bg-purple-900 text-purple-300"
        >
          {{ article.article_catagory.catagory_name }}
        </span>
        <span
          :class="article.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
          class="px-3 py-1 text-sm rounded-full"
        >
          {{ article.enable ? 'Enabled' : 'Disabled' }}
        </span>
      </div>

      <!-- Article Image -->
      <div v-if="article.article_image?.length" class="mb-6">
        <img
          :src="article.article_image[0].article_image_url"
          :alt="article.article_name"
          class="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <!-- Article Content -->
      <h2 class="text-3xl font-bold text-white mb-4">{{ article.article_name }}</h2>
      <div class="prose prose-invert max-w-none">
        <p class="text-gray-300 whitespace-pre-wrap">{{ article.article_text }}</p>
      </div>

      <!-- Metadata -->
      <div class="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
        <div>Created: {{ formatDate(article.created_at) }}</div>
        <div>
          Last updated: {{ article.updated_at ? formatDate(article.updated_at) : 'No updates yet' }}
        </div>
      </div>
    </div>
  </div>
</template>
```

### Event-Driven Communication

The system uses the standard event-driven architecture described in [Common Admin Patterns](#common-admin-patterns), with article-specific event names.

### Security and Data Integrity

- **Row Level Security (RLS)**: Supabase RLS policies protect article operations
- **User Authentication**: All operations require valid admin authentication
- **Input Validation**: Form validation prevents invalid data submission
- **Error Handling**: Comprehensive error handling with user feedback
- **Transaction Safety**: Database operations are atomic and safe
- **Confirmation Dialogs**: Destructive operations require user confirmation

### Performance Optimizations

- **Reactive Updates**: UI updates immediately without full page reloads
- **Efficient Queries**: Single queries fetch related data (articles with images)
- **Component Reuse**: Single form component handles both create and edit
- **Lazy Loading**: Components are loaded only when needed
- **State Management**: Centralized state prevents unnecessary API calls
- **Image Optimization**: Responsive images with proper sizing

### Usage Examples

#### Creating a New Article

```javascript
// User clicks "Create New Article"
// → ArticlesView switches to create mode
// → AddArticle component renders in create mode
// → User fills form (including required category selection) and submits
// → Store creates article in database and automatically refreshes list
// → UI returns to list with new article visible immediately
```

#### Editing an Article

```javascript
// User clicks "Edit Article" on an article
// → ArticlesView switches to edit mode with article ID
// → UpdateArticle component fetches article data
// → AddArticle component renders in edit mode with pre-filled data
// → User modifies and submits
// → Store updates article with new timestamp and automatically refreshes list
// → UI returns to list with updated article visible immediately
```

#### Deleting an Article

```javascript
// User clicks "Delete" button
// → Confirmation dialog appears
// → User confirms deletion
// → Store deletes article from database and automatically refreshes list
// → List updates immediately (article removed) without manual refresh
```

This admin article management system provides a modern, efficient interface for content management while following the established [Common Admin Patterns](#common-admin-patterns) for consistency across the application.

### Article Category System
CRUD operations for organizing articles with dropdown selection and badge display in admin interface.

### Book System
Multi-chapter books with smart navigation, deep-linking, and rich content support including headers and chapter-specific images.

### Chapter Management System
CRUD operations for book chapters with MediaManager integration following standard admin patterns.

### Book Header Management System
CRUD operations for book introduction and summary sections following standard admin patterns.



## Authentication System

Secure Supabase Auth integration with session management, protected routes, and comprehensive form validation.

### Validation System
- **Password Requirements**: 8+ characters, numbers, special characters, uppercase letters
- **Email Validation**: Robust regex pattern validation
- **Real-Time Feedback**: Validation on field blur with visual indicators
- **Password Visibility Toggle**: Show/hide functionality for better UX

### Security Features
- Row Level Security (RLS) policies on all tables
- JWT token-based authentication
- Secure session storage and cleanup
- Protected routes with navigation guards

## Navigation System

### Default Layout Navigation
Sticky sidebar with collapsible tree structure, active state highlighting, and deep linking integration for books and chapters.

### Admin Navigation
Fixed sidebar with admin section links and secure logout functionality.

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
