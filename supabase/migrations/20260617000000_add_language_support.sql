-- Add multi-language support (Afrikaans + English) to content tables.
--
-- Design notes:
--   * `article` and `article_catagory` each carry their own `language` column.
--     An article references a category in the same language via article_catagory_id.
--   * `book` carries `language`. Its `chapter` and `book_header` rows inherit the
--     language of their parent book (via book_id), so they do NOT need a column.
--   * Existing rows are backfilled to 'af' (the original site language) by the
--     NOT NULL DEFAULT, so this migration is non-destructive.

-- article ---------------------------------------------------------------------
alter table public.article
  add column if not exists language text not null default 'af';

alter table public.article
  drop constraint if exists article_language_check;
alter table public.article
  add constraint article_language_check check (language in ('af', 'en'));

create index if not exists article_language_idx on public.article (language);

-- article_catagory ------------------------------------------------------------
alter table public.article_catagory
  add column if not exists language text not null default 'af';

alter table public.article_catagory
  drop constraint if exists article_catagory_language_check;
alter table public.article_catagory
  add constraint article_catagory_language_check check (language in ('af', 'en'));

create index if not exists article_catagory_language_idx on public.article_catagory (language);

-- book ------------------------------------------------------------------------
alter table public.book
  add column if not exists language text not null default 'af';

alter table public.book
  drop constraint if exists book_language_check;
alter table public.book
  add constraint book_language_check check (language in ('af', 'en'));

create index if not exists book_language_idx on public.book (language);
