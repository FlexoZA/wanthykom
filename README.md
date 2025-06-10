# Wanthykom

A Vue 3 application using the Composition API, integrated with Notion API for data management.

## Features

- Vue 3 with Composition API
- Pinia for state management
- Vue Router for navigation
- Integration with Notion API
- ESLint + Prettier for code quality

## Prerequisites

- Node.js 16+ and npm 8+
- Notion API key (get it from [Notion Developers](https://developers.notion.com/))
- A Notion database with the required permissions

## Project Setup

1. Install dependencies:

```sh
npm install
```

2. Create a `.env` file in the root directory and add your Notion API key and database ID:

```
VITE_NOTION_API_KEY=your_notion_api_key
VITE_NOTION_DATABASE_ID=your_database_id
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
