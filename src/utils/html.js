import DOMPurify from 'dompurify'

// Tags/attributes our WYSIWYG editor can produce. Anything else is stripped.
const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'h1',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'hr',
  'code',
  'pre',
]
const ALLOWED_ATTR = ['href', 'target', 'rel']

/**
 * Sanitize admin-authored HTML before rendering with v-html.
 * Returns a safe HTML string with only the editor's whitelisted tags.
 */
export function sanitizeHtml(html) {
  if (!html) return ''
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}

/**
 * Strip all HTML to plain text — used for list previews / truncation.
 */
export function stripHtml(html) {
  if (!html) return ''
  const text = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  // Collapse whitespace left behind by removed block tags.
  return text.replace(/\s+/g, ' ').trim()
}

/** Strip HTML then truncate to `length` chars with an ellipsis. */
export function htmlPreview(html, length = 120) {
  const text = stripHtml(html)
  return text.length > length ? text.slice(0, length) + '…' : text
}
