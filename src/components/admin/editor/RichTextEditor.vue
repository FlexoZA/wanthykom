<template>
  <div
    class="rich-editor"
    :class="[
      isFullscreen
        ? 'fixed inset-0 z-50 flex flex-col bg-gray-900 p-4'
        : 'rounded-md border border-gray-600 bg-gray-700',
    ]"
  >
    <!-- Toolbar -->
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-1 border-b border-gray-600 bg-gray-800 p-2"
      :class="isFullscreen ? 'rounded-t-md' : 'rounded-t-md'"
    >
      <button
        v-for="item in toolbarItems"
        :key="item.key"
        type="button"
        :title="item.title"
        :disabled="disabled"
        @click="item.action"
        class="flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
        :class="item.isActive && item.isActive() ? 'bg-blue-600 text-white' : ''"
        v-html="item.label"
      />

      <div class="mx-1 h-5 w-px bg-gray-600" />

      <button
        type="button"
        title="Toggle fullscreen (Esc to exit)"
        @click="toggleFullscreen"
        class="flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!isFullscreen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 9H5V5M15 9h4V5M15 15h4v4M9 15H5v4"
          />
        </svg>
      </button>

      <!-- Save status indicator -->
      <div v-if="saveStatus" class="ml-auto flex items-center gap-1.5 px-2 text-xs">
        <span
          class="h-2 w-2 rounded-full"
          :class="{
            'bg-yellow-400 animate-pulse': saveStatus === 'saving',
            'bg-green-400': saveStatus === 'saved',
            'bg-red-400': saveStatus === 'error',
          }"
        />
        <span class="text-gray-400">{{ saveStatusLabel }}</span>
      </div>
    </div>

    <!-- Editable area -->
    <EditorContent
      :editor="editor"
      class="rich-content overflow-y-auto px-4 py-3 text-white focus:outline-none"
      :class="
        isFullscreen
          ? 'flex-1 rounded-b-md border border-t-0 border-gray-600 bg-gray-700'
          : 'min-h-[16rem] max-h-[60vh]'
      "
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Start writing…',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // Optional save status from a parent autosave: 'saving' | 'saved' | 'error' | ''
  saveStatus: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const isFullscreen = ref(false)

const saveStatusLabel = computed(
  () =>
    ({ saving: 'Saving…', saved: 'Saved', error: 'Save failed' })[
      props.saveStatus
    ] || '',
)

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: {
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
      },
    }),
    Placeholder.configure({ placeholder: () => props.placeholder }),
  ],
  onUpdate: ({ editor }) => {
    const html = editor.isEmpty ? '' : editor.getHTML()
    emit('update:modelValue', html)
  },
})

// Keep editor in sync when the bound value changes from outside (e.g. async load).
watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return
    const current = editor.value.isEmpty ? '' : editor.value.getHTML()
    if (value !== current) {
      editor.value.commands.setContent(value || '', { emitUpdate: false })
    }
  },
)

watch(
  () => props.disabled,
  (val) => {
    editor.value?.setEditable(!val)
  },
)

const toolbarItems = [
  {
    key: 'bold',
    label: '<strong>B</strong>',
    title: 'Bold (Ctrl+B)',
    action: () => editor.value.chain().focus().toggleBold().run(),
    isActive: () => editor.value?.isActive('bold'),
  },
  {
    key: 'italic',
    label: '<em>I</em>',
    title: 'Italic (Ctrl+I)',
    action: () => editor.value.chain().focus().toggleItalic().run(),
    isActive: () => editor.value?.isActive('italic'),
  },
  {
    key: 'underline',
    label: '<span style="text-decoration:underline">U</span>',
    title: 'Underline (Ctrl+U)',
    action: () => editor.value.chain().focus().toggleUnderline().run(),
    isActive: () => editor.value?.isActive('underline'),
  },
  {
    key: 'strike',
    label: '<span style="text-decoration:line-through">S</span>',
    title: 'Strikethrough',
    action: () => editor.value.chain().focus().toggleStrike().run(),
    isActive: () => editor.value?.isActive('strike'),
  },
  {
    key: 'h1',
    label: 'H1',
    title: 'Heading 1',
    action: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 1 }),
  },
  {
    key: 'h2',
    label: 'H2',
    title: 'Heading 2',
    action: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 2 }),
  },
  {
    key: 'h3',
    label: 'H3',
    title: 'Heading 3',
    action: () => editor.value.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 3 }),
  },
  {
    key: 'bulletList',
    label: '• List',
    title: 'Bullet list',
    action: () => editor.value.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value?.isActive('bulletList'),
  },
  {
    key: 'orderedList',
    label: '1. List',
    title: 'Numbered list',
    action: () => editor.value.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value?.isActive('orderedList'),
  },
  {
    key: 'blockquote',
    label: '&ldquo;&rdquo;',
    title: 'Quote',
    action: () => editor.value.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value?.isActive('blockquote'),
  },
  {
    key: 'link',
    label: '🔗',
    title: 'Add / edit link',
    action: () => setLink(),
    isActive: () => editor.value?.isActive('link'),
  },
  {
    key: 'hr',
    label: '―',
    title: 'Horizontal rule',
    action: () => editor.value.chain().focus().setHorizontalRule().run(),
  },
  {
    key: 'clear',
    label: '⨯',
    title: 'Clear formatting',
    action: () =>
      editor.value.chain().focus().unsetAllMarks().clearNodes().run(),
  },
  {
    key: 'undo',
    label: '↶',
    title: 'Undo (Ctrl+Z)',
    action: () => editor.value.chain().focus().undo().run(),
  },
  {
    key: 'redo',
    label: '↷',
    title: 'Redo (Ctrl+Shift+Z)',
    action: () => editor.value.chain().focus().redo().run(),
  },
]

function setLink() {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('Link URL', previousUrl || 'https://')
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run()
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function onKeydown(e) {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  editor.value?.destroy()
})
</script>
