# Wanthykom

A modern web application built with Vue 3, Vite, and Supabase.

## Features

- **Admin Panel**
  - Protected admin routes with authentication
  - Clean and modern UI with fixed vertical menu
  - Dashboard view for admin content
  - Secure logout functionality with loading states

- **Authentication**
  - Email/password authentication with Supabase
  - Protected routes with navigation guards
  - Login form with loading states and error handling
  - Remember me functionality
  - Secure session management

## Project Structure

```
src/
├── components/
│   ├── admin/         # Admin-specific components
│   └── auth/          # Authentication components
├── layouts/
│   └── AdminLayout.vue # Admin panel layout with navigation
├── lib/
│   └── supabase.js    # Supabase client configuration
├── stores/
│   └── authentication/
│       └── authenticationStore.js # Auth state management
├── views/
│   ├── admin/
│   │   └── AdminDashboard.vue    # Admin dashboard view
│   └── auth/
│       └── LoginView.vue         # Login page
└── router/
    └── index.js       # Route configuration with auth guards
```

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

## Development

### Authentication Flow

- Users can access the admin panel at `/admin`
- Unauthenticated users are redirected to the login page
- After successful login, users are redirected to the admin dashboard
- Logout is available in the admin panel's vertical menu

### Admin Panel

- Fixed vertical menu for navigation
- Responsive layout with main content area
- Dashboard view for admin content
- Secure logout with loading states

### Using the Authentication Store

The application uses Pinia for state management, with a dedicated authentication store:

```javascript
import { useAuthStore } from '@/stores/authentication/authenticationStore'

// In your component setup
const authStore = useAuthStore()

// Sign in
const handleLogin = async (credentials) => {
  const { data, error } = await authStore.signIn(credentials.email, credentials.password)
  if (error) {
    // Handle error
    return
  }
  // Handle successful login
}

// Sign out
const handleLogout = async () => {
  const { error } = await authStore.signOut()
  if (error) {
    // Handle error
    return
  }
  // Handle successful logout
}

// Check current user
const currentUser = computed(() => authStore.getCurrentUser())
```

### Data Management with Supabase

#### Creating a Data Store
```javascript
// stores/supabaseDataStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useDataStore = defineStore('data', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch data
  const fetchItems = async () => {
    try {
      loading.value = true
      const { data, error: err } = await supabase
        .from('items')
        .select('*')
      
      if (err) throw err
      items.value = data
    } catch (err) {
      error.value = err.message
      console.error('DEBUG::DataStore', 'Error fetching items:', err)
    } finally {
      loading.value = false
    }
  }

  // Add new item
  const addItem = async (item) => {
    try {
      const { data, error: err } = await supabase
        .from('items')
        .insert([item])
        .select()
      
      if (err) throw err
      items.value.push(data[0])
    } catch (err) {
      error.value = err.message
      console.error('DEBUG::DataStore', 'Error adding item:', err)
    }
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem
  }
})
```

#### Using the Data Store in Components
```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}
        </li>
      </ul>
      <button @click="handleAddItem">Add Item</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDataStore } from '@/stores/supabaseDataStore'

const dataStore = useDataStore()
const { items, loading, error } = storeToRefs(dataStore)

onMounted(() => {
  dataStore.fetchItems()
})

const handleAddItem = async () => {
  await dataStore.addItem({ name: 'New Item' })
}
</script>
```

### Component Examples

#### Login Form Component
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" required />
    <input v-model="password" type="password" required />
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Signing in...' : 'Sign in' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])
const email = ref('')
const password = ref('')

const handleSubmit = () => {
  emit('login', {
    email: email.value,
    password: password.value
  })
}
</script>
```

#### Admin Layout Component
```vue
<template>
  <div class="min-h-screen bg-gray-900 flex">
    <!-- Vertical Menu -->
    <div class="w-64 bg-gray-800 fixed h-full">
      <nav>
        <RouterLink to="/admin">Dashboard</RouterLink>
      </nav>
      <button @click="handleLogout" :disabled="isLoggingOut">
        {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
      </button>
    </div>
    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <RouterView />
    </div>
  </div>
</template>
```

### Route Configuration

Protected routes are configured with navigation guards:

```javascript
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: AdminDashboard
      }
    ]
  },
  {
    path: '/login',
    component: LoginView
  }
]

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.getCurrentUser()) {
    next('/login')
  } else {
    next()
  }
})
```

### Real-time Data with Supabase

```javascript
// Subscribe to real-time changes
const subscription = supabase
  .channel('table-db-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'items' },
    (payload) => {
      console.log('DEBUG::RealTime', 'Change received:', payload)
      // Handle the change
      if (payload.eventType === 'INSERT') {
        items.value.push(payload.new)
      } else if (payload.eventType === 'UPDATE') {
        const index = items.value.findIndex(item => item.id === payload.new.id)
        if (index !== -1) {
          items.value[index] = payload.new
        }
      } else if (payload.eventType === 'DELETE') {
        items.value = items.value.filter(item => item.id !== payload.old.id)
      }
    }
  )
  .subscribe()

// Cleanup subscription
onUnmounted(() => {
  subscription.unsubscribe()
})
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
