// UI label translations for the public site.
// Content (articles, books, chapters) is translated via the database `language`
// column; this dictionary only covers static interface chrome.

export const SUPPORTED_LANGUAGES = ['af', 'en']
export const DEFAULT_LANGUAGE = 'af'

export const LANGUAGE_LABELS = {
  af: 'Afrikaans',
  en: 'English',
}

export const messages = {
  af: {
    foreword: 'Voorwoord',
    menu: 'Menu',
    language: 'Taal',
    whatsNew: 'Wat is nuut',
    readMore: 'Lees meer',
    back: 'Terug',
    refreshContent: 'Herlaai vir die nuutste inhoud',
    selectBook: 'Kies ’n boek uit die navigasie',
    noArticles: 'Geen artikels gevind nie',
    noFeaturedArticles: 'Geen vooraanstaande artikels gevind nie',
    errorPrefix: 'Fout',
    allRightsReserved: 'Alle regte voorbehou.',
  },
  en: {
    foreword: 'Foreword',
    menu: 'Menu',
    language: 'Language',
    whatsNew: "What's new",
    readMore: 'Read more',
    back: 'Back',
    refreshContent: 'Refresh to get the latest content',
    selectBook: 'Select a book from the navigation',
    noArticles: 'No articles found',
    noFeaturedArticles: 'No featured articles found',
    errorPrefix: 'Error',
    allRightsReserved: 'All rights reserved.',
  },
}
