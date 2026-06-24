import { ref, watch, onBeforeUnmount } from 'vue'

/**
 * Debounced autosave for admin forms.
 *
 * - Edit mode: calls `save(data)` (e.g. a store update) after the user stops
 *   typing, and reflects progress via `status` ('idle' | 'saving' | 'saved' | 'error').
 * - Create mode: there is no record yet, so the form data is stashed in
 *   localStorage under `draftKey` and can be restored on reload via `loadDraft()`.
 *
 * @param {import('vue').Ref<object>} source   reactive form data to watch
 * @param {object} options
 * @param {boolean} options.enabled            whether DB autosave is active (edit mode)
 * @param {(data: object) => Promise<any>} options.save   persist callback (edit mode)
 * @param {string}  options.draftKey           localStorage key for create-mode drafts
 * @param {number}  [options.delay=1500]       debounce in ms
 */
export function useAutosave(source, options) {
  const {
    enabled = false,
    save = null,
    draftKey = null,
    delay = 1500,
  } = options || {}

  const status = ref('') // '' (idle) | saving | saved | error
  const lastSavedAt = ref(null)

  let timer = null
  let resetTimer = null
  // Skip the very first watch tick caused by loading initial/edit data.
  let primed = false

  function clearTimers() {
    if (timer) clearTimeout(timer)
    if (resetTimer) clearTimeout(resetTimer)
  }

  async function flush() {
    const snapshot = JSON.parse(JSON.stringify(source.value))

    if (draftKey) {
      try {
        localStorage.setItem(draftKey, JSON.stringify(snapshot))
      } catch {
        /* storage full / unavailable — drafts are best-effort */
      }
    }

    if (!enabled || typeof save !== 'function') {
      // Create mode: draft saved locally, surface a brief "saved" pulse.
      if (draftKey) {
        status.value = 'saved'
        if (resetTimer) clearTimeout(resetTimer)
        resetTimer = setTimeout(() => (status.value = ''), 2000)
      }
      return
    }

    try {
      status.value = 'saving'
      await save(snapshot)
      status.value = 'saved'
      lastSavedAt.value = new Date()
    } catch (err) {
      console.error('useAutosave: save failed', err)
      status.value = 'error'
    }
  }

  /** Force an immediate save (e.g. before manual submit). */
  async function flushNow() {
    clearTimers()
    await flush()
  }

  /** Load a previously stashed create-mode draft, or null. */
  function loadDraft() {
    if (!draftKey) return null
    try {
      const raw = localStorage.getItem(draftKey)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  /** Remove the draft (call after a successful create/submit). */
  function clearDraft() {
    if (!draftKey) return
    try {
      localStorage.removeItem(draftKey)
    } catch {
      /* ignore */
    }
  }

  watch(
    source,
    () => {
      if (!primed) {
        primed = true
        return
      }
      if (timer) clearTimeout(timer)
      timer = setTimeout(flush, delay)
    },
    { deep: true },
  )

  onBeforeUnmount(clearTimers)

  return { status, lastSavedAt, flushNow, loadDraft, clearDraft }
}
