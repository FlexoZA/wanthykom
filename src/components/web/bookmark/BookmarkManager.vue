<template>
  <!-- Recall fade overlay: covers the screen while we jump to the passage,
       then fades out to reveal it in place (no visible scrolling). -->
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[75] bg-gray-900 transition-opacity duration-300"
      :class="fade ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    ></div>
  </Teleport>

  <!-- Selection popover: appears above highlighted text inside content -->
  <Teleport to="body">
    <Transition name="bm-pop">
      <div
        v-if="popover.show"
        class="fixed z-[80] -translate-x-1/2 -translate-y-full"
        :style="{ top: popover.top + 'px', left: popover.left + 'px' }"
      >
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-md bg-amber-500 hover:bg-amber-400 text-gray-900 text-sm font-semibold shadow-lg"
          @mousedown.prevent
          @click="saveSelection"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 2h12a1 1 0 011 1v18l-7-4-7 4V3a1 1 0 011-1z" />
          </svg>
          Bookmark
        </button>
      </div>
    </Transition>
  </Teleport>

  <!-- Hint beside the bookmark button: prompts while over text, and confirms
       briefly after a save. -->
  <Transition name="bm-pop">
    <div
      v-if="hintVisible || savedFlash"
      class="fixed bottom-4 right-20 z-50 h-12 flex items-center gap-1.5 px-3 rounded-full bg-gray-800/95 border border-gray-600 text-sm font-medium shadow-lg pointer-events-none whitespace-nowrap"
      :class="savedFlash ? 'text-green-300' : 'text-amber-300'"
    >
      <svg v-if="savedFlash" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
      {{ savedFlash ? 'Bookmark saved' : 'Highlight to bookmark' }}
    </div>
  </Transition>

  <!-- Floating button to open the saved bookmarks drawer -->
  <button
    type="button"
    class="fixed bottom-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-amber-400 shadow-lg border border-gray-600 transition-colors"
    aria-label="Open saved bookmarks"
    @click="drawerOpen = true"
  >
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 2h12a1 1 0 011 1v18l-7-4-7 4V3a1 1 0 011-1z" />
    </svg>
    <span
      v-if="bookmarkStore.count"
      class="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-amber-500 text-gray-900 text-xs font-bold"
    >
      {{ bookmarkStore.count }}
    </span>
  </button>

  <BookmarkDrawer
    :open="drawerOpen"
    :bookmarks="bookmarkStore.all"
    @close="drawerOpen = false"
    @recall="recall"
    @remove="bookmarkStore.remove($event)"
    @clear="bookmarkStore.clearAll()"
  />
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/web/bookmarkStore'
import { applyHighlights, scrollToBookmark } from '@/utils/highlight'
import BookmarkDrawer from '@/components/web/bookmark/BookmarkDrawer.vue'

const route = useRoute()
const router = useRouter()
const bookmarkStore = useBookmarkStore()

const drawerOpen = ref(false)
const popover = reactive({ show: false, top: 0, left: 0 })
const pending = ref(null)
const hintVisible = ref(false)
const savedFlash = ref(false)
const fade = ref(false)
let savedFlashTimer = null

let observer = null
let refreshTimer = null

const contentRoot = () => document.querySelector('main')

// --- Persistent highlight painting -----------------------------------------

const refresh = () => {
  const root = contentRoot()
  if (!root) return
  const matches = bookmarkStore.forView(route.path, route.query)
  // Pause the observer so fallback <mark> wrapping doesn't retrigger us.
  if (observer) observer.disconnect()
  applyHighlights(root, matches)
  if (observer) {
    observer.observe(root, { childList: true, subtree: true, characterData: true })
  }
}

const scheduleRefresh = () => {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(refresh, 80)
}

// --- Selection capture ------------------------------------------------------

const hidePopover = () => {
  popover.show = false
  pending.value = null
}

const nearestHeading = (node) => {
  const root = contentRoot()
  if (!root) return ''
  let label = ''
  for (const h of root.querySelectorAll('h1, h2, h3, h4')) {
    if (h.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) {
      label = h.textContent.trim()
    } else {
      break
    }
  }
  return label
}

const buildData = (range, text, contentEl) => {
  let prefix = ''
  let suffix = ''
  try {
    const pre = document.createRange()
    pre.setStart(contentEl, 0)
    pre.setEnd(range.startContainer, range.startOffset)
    prefix = pre.toString().slice(-40)
    const post = document.createRange()
    post.setStart(range.endContainer, range.endOffset)
    post.setEnd(contentEl, contentEl.childNodes.length)
    suffix = post.toString().slice(0, 40)
  } catch {
    /* context is best-effort */
  }
  return {
    text,
    prefix,
    suffix,
    location: nearestHeading(range.startContainer),
    route: { path: route.path, query: { ...route.query } },
  }
}

const captureSelection = () => {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return hidePopover()

  const text = sel.toString().replace(/\s+/g, ' ').trim()
  if (text.length < 2 || text.length > 2000) return hidePopover()

  const range = sel.getRangeAt(0)
  const node = range.commonAncestorContainer
  const el = node.nodeType === 1 ? node : node.parentElement
  const contentEl = el?.closest('.rich-content')
  if (!contentEl) return hidePopover()

  const rect = range.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return hidePopover()

  pending.value = buildData(range, text, contentEl)
  popover.top = Math.max(8, rect.top)
  popover.left = Math.min(
    window.innerWidth - 8,
    Math.max(8, rect.left + rect.width / 2),
  )
  popover.show = true
}

// Show a hint next to the bookmark button whenever the cursor is over content.
const handleHover = (e) => {
  bumpIdle()
  const overContent = !!e.target?.closest?.('.rich-content')
  const next = overContent && !popover.show && !drawerOpen.value
  if (next !== hintVisible.value) hintVisible.value = next
}

// Defer so the browser has finalized the selection before we read it.
const handleSelectionEnd = () => setTimeout(captureSelection, 0)
const handleSelectionChange = () => {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed) hidePopover()
}

const saveSelection = () => {
  if (!pending.value) return
  bookmarkStore.add(pending.value)
  hidePopover()
  window.getSelection()?.removeAllRanges()
  scheduleRefresh()

  // Briefly confirm the save in the hint pill beside the bookmark button.
  hintVisible.value = false
  savedFlash.value = true
  clearTimeout(savedFlashTimer)
  savedFlashTimer = setTimeout(() => {
    savedFlash.value = false
  }, 2000)
}

// --- Auto bookmark on stillness --------------------------------------------
// If the reader sits still (no mouse, scroll, key or touch) for a while, save
// a rolling "resume" bookmark for whatever paragraph is centred on screen.
const IDLE_MS = 60000

let idleTimer = null
let lastBump = 0

const caretAtCenter = () => {
  const x = Math.round(window.innerWidth / 2)
  const y = Math.round(window.innerHeight / 2)
  if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y)
    return pos ? { node: pos.offsetNode, offset: pos.offset } : null
  }
  if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y)
    return r ? { node: r.startContainer, offset: r.startOffset } : null
  }
  return null
}

const autoBookmarkAtCenter = () => {
  if (document.hidden || drawerOpen.value || popover.show) return
  const sel = window.getSelection()
  if (sel && !sel.isCollapsed) return // reader is actively selecting

  const caret = caretAtCenter()
  if (!caret?.node) return
  const el = caret.node.nodeType === 1 ? caret.node : caret.node.parentElement
  const contentEl = el?.closest('.rich-content')
  if (!contentEl) return

  const block = el.closest('p, li, h1, h2, h3, h4, blockquote, pre') || el
  if (!contentEl.contains(block)) return

  let text = block.textContent.replace(/\s+/g, ' ').trim()
  if (text.length < 12) return
  if (text.length > 400) text = text.slice(0, 400)

  // Skip if this passage is already bookmarked on this view.
  const existing = bookmarkStore.forView(route.path, route.query)
  if (existing.some((b) => b.text === text)) return

  let prefix = ''
  let suffix = ''
  try {
    const range = document.createRange()
    range.selectNodeContents(block)
    const pre = document.createRange()
    pre.setStart(contentEl, 0)
    pre.setEnd(range.startContainer, range.startOffset)
    prefix = pre.toString().slice(-40)
    const post = document.createRange()
    post.setStart(range.endContainer, range.endOffset)
    post.setEnd(contentEl, contentEl.childNodes.length)
    suffix = post.toString().slice(0, 40)
  } catch {
    /* context is best-effort */
  }

  bookmarkStore.upsertAuto({
    text,
    prefix,
    suffix,
    location: nearestHeading(block),
    route: { path: route.path, query: { ...route.query } },
  })
  scheduleRefresh()
}

const onIdle = () => autoBookmarkAtCenter()

// (Re)arm the idle timer on any activity. Fires once per idle period; the next
// activity re-arms it.
const resetIdle = () => {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(onIdle, IDLE_MS)
}
const bumpIdle = () => {
  const now = Date.now()
  if (now - lastBump < 500) return // throttle high-frequency events
  lastBump = now
  resetIdle()
}

const onScroll = () => {
  hidePopover()
  bumpIdle()
}

// --- Recall -----------------------------------------------------------------

const runRecall = () => {
  const id = bookmarkStore.recallId
  if (!id) return
  const bm = bookmarkStore.bookmarks.find((b) => b.id === id)
  if (!bm) return bookmarkStore.clearRecall()

  let tries = 0
  // Cycles to keep re-positioning AFTER the passage is first found, so the
  // final position absorbs late layout shifts (images decoding, more content
  // rendering) on a freshly navigated page. The screen stays covered by the
  // fade overlay throughout, so jumps are instant ('auto') and never seen.
  let settle = 0
  const iv = setInterval(() => {
    tries += 1
    const root = contentRoot()
    const found = root && scrollToBookmark(root, bm, 'auto')
    if (found) settle += 1

    if (settle >= 4 || tries > 30) {
      clearInterval(iv)
      bookmarkStore.clearRecall()
      // Let the final position paint, then fade the passage back into view.
      setTimeout(() => {
        fade.value = false
      }, 60)
    }
  }, 150)
}

const recall = (bm) => {
  drawerOpen.value = false
  bookmarkStore.requestRecall(bm.id)
  fade.value = true // cover the screen before navigating / jumping
  router
    .push(bm.route || { path: route.path })
    .catch(() => {})
    .finally(() => runRecall())
}

// --- Lifecycle --------------------------------------------------------------

watch(() => route.fullPath, scheduleRefresh)
watch(() => bookmarkStore.bookmarks.length, scheduleRefresh)

onMounted(() => {
  observer = new MutationObserver(scheduleRefresh)
  const root = contentRoot()
  if (root) {
    observer.observe(root, { childList: true, subtree: true, characterData: true })
  }
  refresh()

  document.addEventListener('mouseup', handleSelectionEnd)
  document.addEventListener('touchend', handleSelectionEnd)
  document.addEventListener('selectionchange', handleSelectionChange)
  document.addEventListener('mousemove', handleHover, { passive: true })
  document.addEventListener('keydown', resetIdle)
  document.addEventListener('touchstart', bumpIdle, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', hidePopover)

  resetIdle() // arm the idle timer after load
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(refreshTimer)
  clearTimeout(idleTimer)
  clearTimeout(savedFlashTimer)
  document.removeEventListener('mouseup', handleSelectionEnd)
  document.removeEventListener('touchend', handleSelectionEnd)
  document.removeEventListener('selectionchange', handleSelectionChange)
  document.removeEventListener('mousemove', handleHover)
  document.removeEventListener('keydown', resetIdle)
  document.removeEventListener('touchstart', bumpIdle)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', hidePopover)
})
</script>

<style scoped>
.bm-pop-enter-active,
.bm-pop-leave-active {
  transition: opacity 0.12s ease;
}
.bm-pop-enter-from,
.bm-pop-leave-to {
  opacity: 0;
}
</style>
