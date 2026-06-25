// Text-anchored highlighting for reader bookmarks.
//
// Bookmarks store the selected text plus a short prefix/suffix of surrounding
// context. To paint or scroll to one we re-locate that text in the live DOM,
// which is more resilient to content edits than storing DOM offsets. Painting
// uses the CSS Custom Highlight API (no DOM mutation) with a <mark> fallback.

const HL_NAME = 'wanthykom-bookmark'
const FALLBACK_CLASS = 'wk-bookmark'

const supportsHighlightAPI = () =>
  typeof CSS !== 'undefined' &&
  CSS.highlights &&
  typeof Highlight !== 'undefined' &&
  typeof Range !== 'undefined'

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const commonSuffixLen = (a, b) => {
  let i = 0
  while (i < a.length && i < b.length && a[a.length - 1 - i] === b[b.length - 1 - i]) i++
  return i
}
const commonPrefixLen = (a, b) => {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

// Flatten every text node under `root`, tracking each node's offset range in
// the concatenated string so we can map a string index back to a DOM position.
const collectTextNodes = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.nodeValue ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  })
  const nodes = []
  let text = ''
  let node
  while ((node = walker.nextNode())) {
    const start = text.length
    text += node.nodeValue
    nodes.push({ node, start, end: text.length })
  }
  return { nodes, text }
}

const rangeFromOffsets = (nodes, start, end) => {
  const startNode = nodes.find((n) => start >= n.start && start < n.end)
  const endNode = nodes.find((n) => end > n.start && end <= n.end)
  if (!startNode || !endNode) return null
  const range = document.createRange()
  range.setStart(startNode.node, start - startNode.start)
  range.setEnd(endNode.node, end - endNode.start)
  return range
}

/**
 * Find a DOM Range for `needle` within `root`. Whitespace-tolerant, and uses
 * prefix/suffix context to disambiguate when the phrase occurs more than once.
 * Returns a Range or null.
 */
export function locateRange(root, needle, prefix = '', suffix = '') {
  if (!root || !needle) return null
  const trimmed = needle.trim()
  if (!trimmed) return null

  const { nodes, text } = collectTextNodes(root)
  if (!nodes.length) return null

  let re
  try {
    re = new RegExp(escapeRegExp(trimmed).replace(/\s+/g, '\\s+'), 'g')
  } catch {
    return null
  }

  const matches = []
  let m
  while ((m = re.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length })
    if (m.index === re.lastIndex) re.lastIndex++ // guard against zero-length
  }
  if (!matches.length) return null

  let best = matches[0]
  if (matches.length > 1 && (prefix || suffix)) {
    let bestScore = -1
    for (const cand of matches) {
      const before = text.slice(Math.max(0, cand.start - prefix.length), cand.start)
      const after = text.slice(cand.end, cand.end + suffix.length)
      const score = commonSuffixLen(before, prefix) + commonPrefixLen(after, suffix)
      if (score > bestScore) {
        bestScore = score
        best = cand
      }
    }
  }

  return rangeFromOffsets(nodes, best.start, best.end)
}

const clearFallbackMarks = (root) => {
  const scope = root || document
  scope.querySelectorAll(`mark.${FALLBACK_CLASS}`).forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    parent.normalize()
  })
}

/** Remove all bookmark highlights (both API and fallback). */
export function clearHighlights(root) {
  if (supportsHighlightAPI()) {
    CSS.highlights.delete(HL_NAME)
  }
  clearFallbackMarks(root)
}

/**
 * Paint persistent highlights for every bookmark whose text is found in `root`.
 * Returns the number of bookmarks successfully highlighted.
 */
export function applyHighlights(root, bookmarks) {
  clearHighlights(root)
  if (!root || !bookmarks?.length) return 0

  const ranges = []
  for (const bm of bookmarks) {
    const range = locateRange(root, bm.text, bm.prefix, bm.suffix)
    if (range) ranges.push(range)
  }
  if (!ranges.length) return 0

  if (supportsHighlightAPI()) {
    CSS.highlights.set(HL_NAME, new Highlight(...ranges))
  } else {
    for (const range of ranges) {
      try {
        const mark = document.createElement('mark')
        mark.className = FALLBACK_CLASS
        range.surroundContents(mark)
      } catch {
        // Range spans element boundaries — skip (older browsers only).
      }
    }
  }
  return ranges.length
}

/** Scroll a bookmark's passage into view. Returns true if it was found. */
export function scrollToBookmark(root, bookmark, behavior = 'smooth') {
  const range = locateRange(root, bookmark.text, bookmark.prefix, bookmark.suffix)
  if (!range) return false
  const rect = range.getBoundingClientRect()
  if (rect.height === 0 && rect.width === 0) {
    const el =
      range.startContainer.nodeType === 1
        ? range.startContainer
        : range.startContainer.parentElement
    el?.scrollIntoView({ behavior, block: 'center' })
  } else {
    // Centre the passage in the viewport, but never push it above a small top
    // margin (so long passages still start on-screen rather than off the top).
    const margin = 100
    const centerOffset = Math.max(margin, (window.innerHeight - rect.height) / 2)
    const top = Math.max(0, window.scrollY + rect.top - centerOffset)
    window.scrollTo({ top, behavior })
  }
  return true
}
