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

- **Media Manager System**

  - Comprehensive image management with Supabase Storage integration
  - Grid-based image display with responsive design
  - Drag & drop upload with progress tracking
  - Batch operations (select, delete, copy URLs)
  - Real-time search and filtering
  - Image preview modal with metadata display
  - Storage analytics and file size management
  - Custom confirmation dialogs for safe deletion
  - Toast notifications for operation feedback
  - Custom loading animations for better UX

- **UI Component System**
  - **ConfirmationDialog**: Reusable modal dialogs for user confirmations
  - **NotificationToast**: Toast notification system with success/error/info types
  - **LoadingAnimation**: Custom ripple loading animation component
  - All components use Tailwind CSS with consistent dark theme
  - Accessible design with proper focus management
  - Auto-dismiss functionality and manual controls

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
│   │   ├── dialogs/
│   │   │   └── ConfirmationDialog.vue  # Reusable confirmation modal
│   │   ├── helpers/
│   │   │   └── LoadingAnimation.vue    # Custom loading animation
│   │   ├── media/
│   │   │   └── MediaManager.vue        # Media management interface
│   │   └── notification/
│   │       └── NotificationToast.vue   # Toast notification system
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
│   │   └── mediaManagerStore.js   # Media management state
│   ├── authentication/
│   │   └── authenticationStore.js  # Auth state management
│   ├── supabase/           # Supabase-specific stores
│   ├── supabaseArticleStore.js     # Article data management
│   ├── supabaseBookStore.js        # Book data management
│   └── unsplashImageStore.js       # Image service integration
└── views/
    ├── admin/
    │   ├── AdminDashboard.vue      # Admin dashboard view
    │   └── media/
    │       └── MediaView.vue       # Media management view
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

## UI Component System

The application features a comprehensive set of reusable UI components built with Vue 3 Composition API and Tailwind CSS. These components provide consistent user experience patterns throughout the application with proper accessibility and responsive design.

### ConfirmationDialog Component

A reusable modal dialog component for user confirmations, particularly useful for destructive actions like deletions.

#### Features

- **Tailwind CSS Styling**: Dark theme consistent with application design
- **Customizable Content**: Configurable title, message, and button text
- **Event-Driven**: Emits `confirm`, `cancel`, and `close` events
- **Backdrop Control**: Optional backdrop clicking to close dialog
- **Accessibility**: Proper focus management and keyboard navigation
- **Warning Design**: Visual warning indicators for destructive actions

#### Usage

```vue
<template>
  <ConfirmationDialog
    :show="showConfirmDialog"
    title="Delete Image"
    message="Are you sure you want to delete this image? This action cannot be undone."
    confirm-text="Delete"
    cancel-text="Cancel"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleCancel"
  />
</template>

<script setup>
import ConfirmationDialog from '@/components/admin/dialogs/ConfirmationDialog.vue'

const showConfirmDialog = ref(false)

const handleConfirm = () => {
  // Execute the action
  showConfirmDialog.value = false
}

const handleCancel = () => {
  showConfirmDialog.value = false
}
</script>
```

#### Props

- **`show`**: Boolean - Controls dialog visibility
- **`title`**: String - Dialog title (default: "Confirm Action")
- **`message`**: String - Confirmation message
- **`confirmText`**: String - Confirm button text (default: "Confirm")
- **`cancelText`**: String - Cancel button text (default: "Cancel")
- **`allowBackdropClose`**: Boolean - Allow closing by clicking backdrop (default: true)

### NotificationToast Component

A comprehensive toast notification system for providing user feedback on operations with automatic dismissal and progress indicators.

#### Features

- **Multiple Types**: Success, error, and info notifications with appropriate icons
- **Auto-Dismiss**: Configurable auto-dismiss duration with visual progress bar
- **Manual Control**: Close button for immediate dismissal
- **Smooth Animations**: Enter/exit transitions using Tailwind CSS
- **Progress Indicator**: Visual countdown showing remaining display time
- **Consistent Theming**: Dark theme matching application design
- **Flexible Content**: Support for title and optional message

#### Usage

```vue
<template>
  <NotificationToast
    :show="showToast"
    :type="toast.type"
    :title="toast.title"
    :message="toast.message"
    :duration="5000"
    @close="hideToast"
  />
</template>

<script setup>
import NotificationToast from '@/components/admin/notification/NotificationToast.vue'

const showToast = ref(false)
const toast = ref({
  type: 'success',
  title: 'Operation Complete',
  message: 'Your action was successful',
})

const showNotification = (type, title, message = '') => {
  toast.value = { type, title, message }
  showToast.value = true
}

const hideToast = () => {
  showToast.value = false
}

// Usage examples
showNotification('success', 'Upload Complete', '5 images uploaded successfully')
showNotification('error', 'Upload Failed', 'Please check your connection')
showNotification('info', 'Processing', 'Your request is being processed')
</script>
```

#### Props

- **`show`**: Boolean - Controls toast visibility
- **`type`**: String - Toast type: 'success', 'error', 'info' (default: 'info')
- **`title`**: String - Toast title (required)
- **`message`**: String - Optional additional message
- **`duration`**: Number - Auto-dismiss duration in milliseconds (default: 5000)
- **`autoDismiss`**: Boolean - Enable auto-dismiss (default: true)

#### Toast Types

- **Success**: Green theme with checkmark icon for successful operations
- **Error**: Red theme with warning icon for failed operations
- **Info**: Blue theme with info icon for general notifications

### LoadingAnimation Component

A custom ripple loading animation that replaces generic spinners with a more visually appealing loading indicator.

#### Features

- **Ripple Effect**: Dual-ring ripple animation with staggered timing
- **Custom Colors**: Uses application brand colors (pink and cyan)
- **Responsive Size**: Configurable dimensions for different use cases
- **Smooth Animation**: CSS-based animation with cubic-bezier easing
- **Zero Dependencies**: Pure CSS animation without external libraries

#### Usage

```vue
<template>
  <div v-if="isLoading" class="flex items-center justify-center py-12">
    <LoadingAnimation />
  </div>
</template>

<script setup>
import LoadingAnimation from '@/components/admin/helpers/LoadingAnimation.vue'

const isLoading = ref(true)
</script>
```

#### Animation Details

- **Duration**: 1 second per cycle
- **Easing**: Cubic-bezier(0, 0.2, 0.8, 1) for smooth acceleration
- **Colors**: Primary ring (#e90c59), Secondary ring (#46dff0)
- **Size**: 200px × 200px container with scalable content

### Integration Examples

#### MediaManager Integration

The MediaManager component demonstrates comprehensive integration of all UI components:

```vue
<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading && images.length === 0">
      <LoadingAnimation />
    </div>

    <!-- Content with action buttons -->
    <button @click="deleteImage(imagePath)">Delete</button>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      @confirm="handleConfirmAction"
      @cancel="handleCancelAction"
    />

    <!-- Toast Notifications -->
    <NotificationToast
      :show="showToast"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      @close="hideToast"
    />
  </div>
</template>
```

#### Component Communication Flow

1. **User Action**: User clicks delete button
2. **Confirmation**: ConfirmationDialog shown with specific message
3. **Action Execution**: On confirm, operation executes
4. **Feedback**: NotificationToast shows success/error result
5. **State Reset**: Components return to initial state

### Design Consistency

All UI components follow consistent design principles:

- **Dark Theme**: Gray-800/900 backgrounds with proper contrast
- **Tailwind Classes**: Consistent spacing, typography, and color schemes
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, and focus management
- **Animation**: Smooth transitions using Tailwind's transition utilities

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
  .select(
    `
    article_name,
    article_text,
    article_image (
      article_image_url
    )
  `,
  )
  .order('created_at', { ascending: false })
```

This approach:

- Fetches articles and their related images in a single query
- Orders articles by creation date (newest first)
- Maintains referential integrity between articles and images
- Provides efficient data loading with minimal API calls

## Admin Article Management System

The application features a comprehensive admin article management system that allows administrators to create, view, edit, and delete articles through a modern, component-based interface. The system uses Vue 3's Composition API throughout and provides a seamless user experience without page reloads.

### Features

- **Complete CRUD Operations**: Create, read, update, and delete articles
- **Component-Based Architecture**: Modern Vue 3 components with event-driven communication
- **Rich Form Interface**: Article creation and editing with validation
- **Real-Time Updates**: Immediate UI updates after operations
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Loading States**: Visual feedback during all operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Optimized for all screen sizes
- **Enable/Disable Toggle**: Custom switch component for article status
- **Image Support**: Dropdown for article image selection (extensible)
- **Date Tracking**: Automatic creation and update timestamp management

### Architecture Overview

The admin article system uses a component-based architecture that manages different views through local state rather than routing:

```
ArticlesView (Main Container)
├── AdminArticleList (List all articles)
├── AddArticle (Create/Edit form)
├── ArticleView (View single article)
└── UpdateArticle (Edit wrapper component)
```

### Database Structure

The admin system works with the same database structure as the public article system but includes additional fields for management:

```sql
-- Enhanced articles table for admin management
article (
  id: uuid (primary key)
  article_name: text
  article_text: text
  enable: boolean (default: false)
  created_at: timestamp
  updated_at: timestamp
  user_id: uuid (for RLS policies)
)

-- Article images (unchanged)
article_image (
  id: uuid (primary key)
  article_id: uuid (foreign key)
  article_image_url: text
)
```

### Admin Article Store (`supabaseAdminArticleStore.js`)

The admin store provides comprehensive CRUD operations with proper error handling:

```javascript
import { useSupabaseAdminArticleStore } from '@/stores/admin/supabaseAdminArticleStore'

// In your component
const articleStore = useSupabaseAdminArticleStore()

// Fetch all articles
await articleStore.fetchArticles()

// Fetch single article
const article = await articleStore.fetchArticle(articleId)

// Create new article
await articleStore.createArticle({
  article_name: 'Title',
  article_text: 'Content',
  enable: true,
})

// Update existing article
await articleStore.updateArticle(articleId, {
  article_name: 'Updated Title',
  article_text: 'Updated Content',
  enable: false,
})

// Delete article
await articleStore.deleteArticle(articleId)

// Access reactive state
const articles = computed(() => articleStore.getArticles)
const isLoading = computed(() => articleStore.getIsLoading)
const error = computed(() => articleStore.getError)
```

#### Store Methods

- **`fetchArticles()`**: Retrieves all articles with images and metadata
- **`fetchArticle(id)`**: Retrieves a single article by ID
- **`createArticle(data)`**: Creates a new article with automatic timestamps
- **`updateArticle(id, data)`**: Updates an existing article with new timestamp
- **`deleteArticle(id)`**: Safely deletes an article and refreshes the list
- **Getters**: `getArticles`, `getIsLoading`, `getError` for reactive state access

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

### Article List Component (`AdminArticleList.vue`)

Displays all articles in a responsive grid with action buttons:

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
              v-if="article.article_image?.length"
              :src="article.article_image[0].article_image_url"
            />
            <div v-else class="bg-gray-600 flex items-center justify-center">
              <svg><!-- Image placeholder icon --></svg>
            </div>
          </div>

          <!-- Article Details -->
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white">{{ article.article_name }}</h3>
              <span
                :class="article.enable ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
              >
                {{ article.enable ? 'Enabled' : 'Disabled' }}
              </span>
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
- **Action Buttons**: View, edit, and delete with clear visual hierarchy
- **Image Handling**: Displays article images or placeholder icons
- **Date Formatting**: Human-readable creation and update dates
- **Delete Confirmation**: Requires user confirmation before deletion

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

      <!-- Article Image Dropdown -->
      <div>
        <label class="block text-white mb-2">Article Image</label>
        <select
          v-model="formData.article_image_id"
          class="w-full bg-gray-700 border border-gray-600 rounded-md text-white"
        >
          <option value="">Select an image</option>
          <!-- Extensible for future image management -->
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
          :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          {{ isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Article' : 'Update Article' }}
        </button>
      </div>
    </form>
  </div>
</template>
```

#### Form Features

- **Dual Mode**: Handles both creation and editing with the same component
- **Custom Toggle Switch**: Beautiful enable/disable toggle with smooth animations
- **Form Validation**: Required fields with proper input types
- **Loading States**: Disabled inputs and loading text during submission
- **Auto-Population**: Pre-fills form data when editing existing articles
- **Responsive Design**: Optimized layout for all screen sizes
- **Event Communication**: Emits events for parent component handling

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
      <!-- Status Badge -->
      <div class="mb-6">
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

The system uses a clean event-driven architecture:

```javascript
// Component events flow
AdminArticleList
├── @create-article → ArticlesView → Switch to create mode
├── @view-article → ArticlesView → Switch to view mode
├── @edit-article → ArticlesView → Switch to edit mode
└── @delete-article → ArticlesView → Call store delete method

AddArticle
├── @article-created → ArticlesView → Return to list
├── @article-updated → ArticlesView → Return to list
└── @cancel → ArticlesView → Return to list

ArticleView
├── @edit-article → ArticlesView → Switch to edit mode
└── @back → ArticlesView → Return to list
```

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
// → User fills form and submits
// → Store creates article in database
// → UI returns to list with new article visible
```

#### Editing an Article

```javascript
// User clicks "Edit Article" on an article
// → ArticlesView switches to edit mode with article ID
// → UpdateArticle component fetches article data
// → AddArticle component renders in edit mode with pre-filled data
// → User modifies and submits
// → Store updates article with new timestamp
// → UI returns to list with updated article
```

#### Deleting an Article

```javascript
// User clicks "Delete" button
// → Confirmation dialog appears
// → User confirms deletion
// → Store deletes article from database
// → List automatically updates (article removed)
```

### Benefits of Component Architecture

- **No Page Reloads**: Seamless user experience with instant updates
- **Reusable Components**: Single form handles both create and edit operations
- **Clean State Management**: Local state eliminates routing complexity
- **Better Performance**: No unnecessary route changes or component re-mounting
- **Easier Testing**: Components can be tested in isolation
- **Maintainable Code**: Clear separation of concerns and event-driven communication
- **Scalable Design**: Easy to add new features or modify existing ones

This admin article management system provides a modern, efficient interface for content management while maintaining clean architecture principles and excellent user experience.

## Media Manager System

The application features a comprehensive media management system built with Supabase Storage integration, providing administrators with powerful tools to manage, organize, and deploy images across the application. The system offers a modern, responsive interface with drag-and-drop functionality and real-time storage analytics.

### Features

- **Supabase Storage Integration**: Direct integration with Supabase Storage buckets for reliable, scalable file management
- **Grid-Based Interface**: Responsive image grid that adapts from 1-5 columns based on screen size
- **Drag & Drop Upload**: Intuitive drag-and-drop interface with visual feedback and progress tracking
- **Batch Operations**: Multi-select functionality for bulk actions (delete, copy URLs)
- **Real-Time Search**: Instant filtering of images by filename with live results
- **Image Preview Modal**: Full-size preview with detailed metadata and URL management
- **Storage Analytics**: Real-time display of image count and total storage usage
- **File Validation**: Automatic validation of file types and size limits (10MB max)
- **Responsive Design**: Optimized experience across all device sizes
- **Error Handling**: Comprehensive error handling with user-friendly feedback
- **Loading States**: Visual feedback during all operations (upload, delete, fetch)

### Architecture Overview

The media manager uses a clean separation of concerns with Pinia state management:

```
MediaView (Route Container)
└── MediaManager (Main Component)
    ├── Image Grid Display
    ├── Upload Modal
    ├── Preview Modal
    └── Batch Selection Actions

MediaManagerStore (Pinia Store)
├── Supabase Storage API Integration
├── File Upload/Delete Operations
├── URL Generation & Management
└── State Management
```

### Database Structure

The media manager works directly with Supabase Storage, requiring proper bucket configuration:

```sql
-- Supabase Storage Bucket Configuration
Storage Bucket: 'articles'
├── Public Access: Enabled for image display
├── File Size Limit: 10MB per file
├── Allowed Types: jpg, jpeg, png, gif, webp, svg
└── RLS Policies: Configured for admin access
```

### Media Manager Store (`mediaManagerStore.js`)

The store provides complete storage management with reactive state:

```javascript
import { useMediaManagerStore } from '@/stores/admin/mediaManagerStore'

// In your component
const mediaStore = useMediaManagerStore()

// Set storage bucket
mediaStore.setBucket('articles')

// Fetch images
await mediaStore.fetchImages()

// Upload single image
const result = await mediaStore.uploadImage(file, 'uploads')

// Upload multiple images
const result = await mediaStore.uploadMultipleImages(files, 'gallery')

// Delete image
await mediaStore.deleteImage('path/to/image.jpg')

// Access reactive state
const images = computed(() => mediaStore.getImages)
const isLoading = computed(() => mediaStore.getIsLoading)
const uploadProgress = computed(() => mediaStore.getUploadProgress)
```

#### Store Methods

- **`setBucket(bucketName)`**: Switch between different storage buckets
- **`fetchImages(folder)`**: Retrieve images from specified folder
- **`uploadImage(file, folder, fileName)`**: Upload single image with validation
- **`uploadMultipleImages(files, folder)`**: Batch upload with progress tracking
- **`deleteImage(imagePath)`**: Delete single image from storage
- **`deleteMultipleImages(imagePaths)`**: Batch delete operations
- **`getImageUrl(imagePath)`**: Generate public URLs for images
- **`createSignedUrl(imagePath, expiresIn)`**: Create temporary access URLs
- **`searchImages(searchTerm)`**: Filter images by filename
- **`formatFileSize(bytes)`**: Human-readable file size formatting

### Media Manager Component (`MediaManager.vue`)

The main interface component with comprehensive functionality:

```vue
<template>
  <div class="space-y-6">
    <!-- Header with Storage Stats -->
    <div class="flex items-center justify-end">
      <div class="text-sm text-gray-400">
        <span>{{ images.length }}</span> images •
        <span>{{ mediaStore.formatFileSize(totalStorageSize) }}</span> used
      </div>
      <button @click="showUploadModal = true">Upload Images</button>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center gap-4">
      <input v-model="searchTerm" placeholder="Search images..." />
      <button @click="refreshImages">Refresh</button>
    </div>

    <!-- Responsive Image Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div v-for="image in filteredImages" :key="image.path" class="group relative">
        <!-- Selection Checkbox -->
        <input type="checkbox" @change="toggleImageSelection(image.path)" />

        <!-- Image Display -->
        <img :src="image.url" @click="openImagePreview(image)" />

        <!-- Hover Actions -->
        <div class="opacity-0 group-hover:opacity-100">
          <button @click="copyImageUrl(image)">Copy URL</button>
          <button @click="deleteImage(image.path)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Upload Modal with Drag & Drop -->
    <div v-if="showUploadModal" class="modal">
      <div @drop="handleDrop" @dragover.prevent>
        <p>Drag & drop images here or click to select</p>
        <input type="file" multiple accept="image/*" @change="handleFileSelect" />
      </div>
    </div>
  </div>
</template>
```

#### Component Features

- **Responsive Grid**: Automatically adjusts column count based on screen size
- **Drag & Drop**: Visual feedback during drag operations with file validation
- **Multi-Selection**: Checkbox-based selection with batch operation toolbar
- **Hover Actions**: Context-sensitive actions that appear on image hover
- **Modal System**: Upload and preview modals with backdrop interaction
- **Search Integration**: Real-time filtering with search term highlighting
- **Loading States**: Skeleton loading and progress indicators

### Storage Configuration

#### Supabase Storage Setup

```javascript
// Required Supabase Storage Configuration

1. Create Storage Bucket:
   - Name: 'articles' (or your preferred bucket name)
   - Public: true (for image display)

2. Set RLS Policies:
   - Allow authenticated users to upload
   - Allow public read access for images
   - Allow authenticated users to delete their uploads

3. Configure CORS (if needed):
   - Allow your domain for cross-origin requests
```

#### File Upload Validation

```javascript
// Built-in validation rules
const validation = {
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  fileNaming: 'image_[timestamp].[extension]', // Automatic unique naming
}
```

### Usage Examples

#### Basic Integration

```javascript
// In a Vue component
import { useMediaManagerStore } from '@/stores/admin/mediaManagerStore'

export default {
  setup() {
    const mediaStore = useMediaManagerStore()

    // Initialize with specific bucket
    onMounted(async () => {
      mediaStore.setBucket('articles')
      await mediaStore.fetchImages()
    })

    return { mediaStore }
  },
}
```

#### Upload with Progress Tracking

```javascript
const uploadFiles = async (files) => {
  const result = await mediaStore.uploadMultipleImages(files, 'uploads')

  if (result.success) {
    console.log(`Uploaded ${result.successCount} files successfully`)
  } else {
    console.log(`${result.failureCount} files failed to upload`)
  }
}
```

#### Image URL Management

```javascript
// Get public URL
const imageUrl = mediaStore.getImageUrl('uploads/image.jpg')

// Create temporary signed URL
const { signedUrl } = await mediaStore.createSignedUrl('private/image.jpg', 3600)
```

### Data Flow

1. **Component Mount**: MediaManager component initializes and sets bucket
2. **Image Fetching**: Store queries Supabase Storage for file list
3. **URL Generation**: Public URLs are generated for each image
4. **Grid Display**: Images are rendered in responsive grid layout
5. **User Interactions**: Upload, delete, search operations update state
6. **Real-Time Updates**: UI reflects changes immediately through reactive state

### Performance Optimizations

- **Lazy Loading**: Images load only when visible in viewport
- **Batch Operations**: Multiple files processed efficiently in sequence
- **Caching**: Public URLs are cached to prevent regeneration
- **Debounced Search**: Search input is debounced for performance
- **Progressive Loading**: Large image grids load progressively
- **Memory Management**: Unused image references are cleaned up

### Security Features

- **File Type Validation**: Only image files are accepted
- **Size Limits**: 10MB maximum file size prevents abuse
- **RLS Integration**: Leverages Supabase Row Level Security
- **Secure URLs**: Public URLs are generated securely through Supabase
- **User Authentication**: All operations require valid admin authentication

### Error Handling

- **Network Errors**: Graceful handling of connection issues
- **Upload Failures**: Individual file failures don't block batch operations
- **Storage Limits**: Clear messaging when storage limits are reached
- **File Validation**: User-friendly error messages for invalid files
- **Permission Errors**: Proper feedback for authorization issues

### Integration with Article System

The media manager integrates seamlessly with the article management system:

```javascript
// Article form integration
const selectImageFromMedia = async () => {
  const selectedImage = await mediaStore.getImages.find((img) => img.selected)
  articleForm.image_url = selectedImage.url
}
```

This media manager system provides a professional-grade solution for content management, offering both power and simplicity for administrators while maintaining excellent performance and user experience.

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
        <img
          :src="selectedBook.book_image[0].book_image_url"
          class="w-full h-80 object-cover rounded-lg"
        />
      </div>

      <!-- Book Headers (Introduction/Summary) -->
      <div
        v-if="selectedBook.book_header && selectedBook.book_header.length > 0"
        class="mb-6 space-y-4"
      >
        <div
          v-for="header in selectedBook.book_header"
          :key="header.book_header_name"
          class="bg-gray-800 p-4 rounded-lg"
        >
          <h3 class="text-lg font-semibold text-gray-200 mb-2">{{ header.book_header_name }}</h3>
          <p class="text-gray-300">{{ header.book_header_text }}</p>
        </div>
      </div>

      <!-- Chapters -->
      <div v-if="selectedBook.chapter && selectedBook.chapter.length > 0" class="space-y-8">
        <div
          v-for="chapter in selectedBook.chapter"
          :key="chapter.chapter_name"
          class="border-t border-gray-700 pt-6"
          :ref="
            (el) => {
              if (el) chapterRefs[chapter.chapter_name] = el
            }
          "
        >
          <h3 class="text-xl font-semibold text-gray-200 mb-4">{{ chapter.chapter_name }}</h3>

          <!-- Chapter Image -->
          <div v-if="chapter.chapter_image && chapter.chapter_image.length > 0" class="mb-4">
            <img
              :src="chapter.chapter_image[0].chapter_image_url"
              class="w-full h-48 object-cover rounded-lg"
            />
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
      <div
        class="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700"
        :class="{ 'bg-gray-700': isBookActive(book.book_name) }"
        @click="toggleBook(book.book_name)"
      >
        <RouterLink
          :to="{ name: 'books', query: { book: book.book_name } }"
          class="font-semibold flex-grow"
        >
          {{ book.book_name }}
        </RouterLink>
        <span>{{ expandedBooks[book.book_name] ? '▼' : '▶' }}</span>
      </div>

      <!-- Chapter Links -->
      <div v-if="expandedBooks[book.book_name] && book.chapter" class="ml-4 mt-2 space-y-1">
        <RouterLink
          v-for="chapter in book.chapter"
          :key="chapter.chapter_name"
          :to="{ name: 'books', query: { book: book.book_name, chapter: chapter.chapter_name } }"
          class="block py-1 px-3 rounded hover:bg-gray-700 text-sm"
        >
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
  .select(
    `
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
  `,
  )
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
  <nav
    class="hidden md:flex flex-col gap-2 py-8 px-4 bg-gray-800 text-gray-200 w-56 min-w-[12rem] border-l border-gray-700 sticky top-0 h-[calc(100vh-4rem)]"
  >
    <!-- Home Link -->
    <RouterLink
      to="/"
      class="py-2 px-3 rounded hover:bg-gray-700 transition-colors mb-4 font-semibold"
      active-class="bg-gray-700"
    >
      Voorwoord
    </RouterLink>

    <!-- Dynamic Book Navigation -->
    <div v-for="book in books" :key="book.book_name" class="mb-4">
      <!-- Book Header with Toggle -->
      <div
        class="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700 transition-colors cursor-pointer"
        :class="{ 'bg-gray-700': isBookActive(book.book_name) }"
        @click="toggleBook(book.book_name)"
      >
        <RouterLink
          :to="{ name: 'books', query: { book: book.book_name } }"
          class="font-semibold flex-grow"
        >
          {{ book.book_name }}
        </RouterLink>
        <span class="ml-2">{{ expandedBooks[book.book_name] ? '▼' : '▶' }}</span>
      </div>

      <!-- Collapsible Chapter List -->
      <div v-if="expandedBooks[book.book_name] && book.chapter" class="ml-4 mt-2 space-y-1">
        <RouterLink
          v-for="chapter in book.chapter"
          :key="chapter.chapter_name"
          :to="{ name: 'books', query: { book: book.book_name, chapter: chapter.chapter_name } }"
          class="block py-1 px-3 rounded hover:bg-gray-700 transition-colors text-sm"
          :class="{ 'bg-gray-700': isChapterActive(book.book_name, chapter.chapter_name) }"
        >
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
  return (
    route.name === 'books' && route.query.book === bookName && route.query.chapter === chapterName
  )
}

// Smart toggle functionality (accordion-style)
const toggleBook = (bookName) => {
  // Close all other books
  Object.keys(expandedBooks.value).forEach((key) => {
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
watch(
  () => route.query.book,
  (newBook) => {
    if (newBook) {
      // Close all other books
      Object.keys(expandedBooks.value).forEach((key) => {
        if (key !== newBook) {
          expandedBooks.value[key] = false
        }
      })
      // Expand the selected book
      expandedBooks.value[newBook] = true
    } else {
      // If no book is selected, close all books
      Object.keys(expandedBooks.value).forEach((key) => {
        expandedBooks.value[key] = false
      })
    }
  },
  { immediate: true },
)
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
- **Input Validation**: Real-time form validation with comprehensive password requirements
- **Password Visibility Toggle**: Show/hide password functionality for better user experience
- **Secure Logout**: Safe logout with loading states and proper session cleanup
- **Remember Me**: Optional session persistence
- **Error Handling**: User-friendly error messages for authentication failures
- **Auto-Redirect**: Automatic redirection after successful login/logout
- **Loading States**: Visual feedback during authentication operations

### Validation System

The application includes a comprehensive validation system that ensures data integrity and provides immediate feedback to users during form input.

#### Validation Utilities (`validation.js`)

The validation system is built around a centralized utility file that defines validation rules and functions:

```javascript
// Password validation rules
export const passwordRules = {
  minLength: 8,
  requiresNumber: true,
  requiresSpecial: true,
  requiresUppercase: true,
}

// Email validation pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validation functions
export const validatePassword = (password) => {
  if (!password) return ''
  const errors = []

  if (password.length < passwordRules.minLength) {
    errors.push(`Password must be at least ${passwordRules.minLength} characters`)
  }
  if (passwordRules.requiresNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (passwordRules.requiresSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  if (passwordRules.requiresUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  return errors.length ? errors.join('. ') : ''
}

export const validateEmail = (email) => {
  if (!email) return ''
  return emailPattern.test(email) ? '' : 'Please enter a valid email address'
}
```

#### Password Requirements

The system enforces the following password requirements:

- **Minimum Length**: 8 characters
- **Numbers**: At least one numeric digit (0-9)
- **Special Characters**: At least one special character (!@#$%^&\*(),.?":{}|<>)
- **Uppercase Letters**: At least one uppercase letter (A-Z)

#### Email Validation

Email validation uses a robust regex pattern that checks for:

- Valid email format with @ symbol
- Domain with proper structure
- No whitespace or invalid characters

#### Integration with Login Form

The validation system is seamlessly integrated into the `LoginDialog.vue` component:

```javascript
// Import validation functions
import { validateEmail, validatePassword } from '@/utils/validation'

// Validation states
const emailError = ref('')
const passwordError = ref('')

// Real-time validation methods
const validateEmailField = () => {
  emailError.value = validateEmail(email.value)
}

const validatePasswordField = () => {
  passwordError.value = validatePassword(password.value)
}

// Form validation computed property
const isFormValid = computed(() => {
  return email.value && password.value && !emailError.value && !passwordError.value
})
```

#### Validation Features

- **Real-Time Validation**: Validation occurs on field blur for immediate feedback
- **Visual Feedback**: Input borders change color (red) when validation fails
- **Error Messages**: Clear, user-friendly error messages below each field
- **Form State Management**: Submit button is disabled when form is invalid
- **Progressive Enhancement**: Validation runs before form submission as a final check

#### Password Visibility Toggle

The login form includes a password visibility toggle for enhanced user experience:

```vue
<div class="relative mt-1">
  <input
    :type="showPassword ? 'text' : 'password'"
    v-model="password"
    // ... other props
  />
  <button
    type="button"
    @click="togglePasswordVisibility"
    class="absolute inset-y-0 right-0 pr-3 flex items-center"
  >
    <!-- Eye icons for show/hide state -->
  </button>
</div>
```

##### Toggle Features

- **Dynamic Input Type**: Switches between `password` and `text` input types
- **Visual Icons**: Eye icons that change based on visibility state
- **Accessibility**: Proper button labeling and keyboard navigation
- **Disabled State**: Toggle is disabled during form submission
- **Consistent Styling**: Matches the overall form design

#### Usage Examples

```javascript
// Basic validation
const emailError = validateEmail('user@example.com') // Returns ''
const emailError = validateEmail('invalid-email') // Returns error message

const passwordError = validatePassword('Password123!') // Returns ''
const passwordError = validatePassword('weak') // Returns detailed error message

// In components
import { validateEmail, validatePassword } from '@/utils/validation'

// Reactive validation
const isEmailValid = computed(() => !validateEmail(email.value))
const isPasswordValid = computed(() => !validatePassword(password.value))
```

#### Benefits

- **Improved Security**: Enforces strong password requirements
- **Better User Experience**: Real-time feedback prevents form submission errors
- **Consistency**: Centralized validation rules ensure consistent behavior
- **Maintainability**: Easy to update validation rules across the application
- **Accessibility**: Clear error messages help users understand requirements
- **Progressive Enhancement**: Works with or without JavaScript

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
      const {
        data: { session: initialSession },
        error,
      } = await supabase.auth.getSession()
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
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
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
        <input
          v-model="email"
          type="email"
          required
          :disabled="isLoading"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Enter your email"
        />

        <!-- Password Input -->
        <input
          v-model="password"
          type="password"
          required
          :disabled="isLoading"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          placeholder="Enter your password"
        />

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input v-model="rememberMe" type="checkbox" :disabled="isLoading" />
            <span class="ml-2 text-sm text-gray-300">Remember me</span>
          </label>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-400">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
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
