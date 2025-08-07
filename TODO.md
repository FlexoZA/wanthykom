# Sort Order Implementation Plan

## Context & Problem
We're replacing `created_at` based sorting with a proper `sort_order` integer field to:
- Give logical control over chapter/header ordering (reading sequence)
- Avoid conflicts when reordering (no duplicate numbers)
- Handle insertions anywhere in the sequence
- Remove inefficient JavaScript sorting in favor of database ordering

## Implementation Stages

### Phase 1: Database & Core Structure ✅ COMPLETED
1. **Database Schema Changes** - Add `sort_order` column to database tables ✅ COMPLETED
   - `ALTER TABLE chapter ADD COLUMN sort_order INTEGER;` ✅
   - `ALTER TABLE book_header ADD COLUMN sort_order INTEGER;` ✅
   - `ALTER TABLE book ADD COLUMN sort_order INTEGER;` ✅
   - Create indexes for performance ✅

2. **Web Store Sort Order** - Update supabaseBookStore.js ✅ COMPLETED
   - Replace created_at sorting with sort_order in select queries ✅
   - Updated JavaScript sorting to use sort_order for nested relations ✅

3. **Admin Chapter Fetch Sort Order** - Update AdminChapterStore.js fetchChapters ✅ COMPLETED
   - Change `.order('created_at', { ascending: false })` to `.order('sort_order', { ascending: true })` ✅
   - Ensures logical chapter order ✅

4. **Admin BookHeader Fetch Sort Order** - Update AdminBookHeaderStore.js fetchBookHeaders ✅ COMPLETED
   - Change `.order('created_at', { ascending: false })` to `.order('sort_order', { ascending: true })` ✅
   - Ensures logical header order ✅

### Phase 2: CRUD Operations ✅ COMPLETED
5. **Admin Chapter Create Sort Order** - Update AdminChapterStore.js createChapter ✅ COMPLETED
   - Add sort_order field to insert payload ✅
   - Calculate next available sort_order (max + 1) for the book ✅

6. **Admin BookHeader Create Sort Order** - Update AdminBookHeaderStore.js createBookHeader ✅ COMPLETED
   - Add sort_order field to insert payload ✅
   - Calculate next available sort_order (max + 1) for the book ✅

7. **Admin Chapter Update Sort Order** - Update AdminChapterStore.js updateChapter ✅ COMPLETED
   - Add sort_order to updatePayload ✅
   - Implement reordering logic when sort_order changes (handle conflicts by renumbering) ✅

8. **Admin BookHeader Update Sort Order** - Update AdminBookHeaderStore.js updateBookHeader ✅ COMPLETED
   - Add sort_order to updatePayload ✅
   - Implement reordering logic when sort_order changes (handle conflicts by renumbering) ✅

9. **Admin Book Fetch Sort Order** - Update AdminBookstore.js fetchBooks and fetchBook ✅ COMPLETED
   - Add sort_order to select queries for nested chapter and book_header relations ✅
   - Updated main book ordering to use sort_order ✅

### Phase 3: Advanced Features ✅ COMPLETED
10. **Reorder Functions** - Create reorderChapters and reorderBookHeaders helper functions ✅ COMPLETED
    - Handle drag-and-drop reordering by updating sort_order values in batch operations ✅

11. **Admin UI Sort Controls** - Add sort order controls to admin UI components ✅ COMPLETED
    - Chapter and BookHeader list views have sort_order display and up/down buttons ✅
    - Chapter and BookHeader add/edit forms have sort_order input fields ✅

12. **Migration Existing Data** - Create data migration script ✅ COMPLETED (Data already migrated)
    - Set initial sort_order values for existing chapters/headers based on created_at order ✅
    - Maintains current sequence while enabling new functionality ✅

## Benefits of This Approach
- **No conflicts**: When moving chapter 10 to position 4, system auto-renumbers others
- **Database-optimized**: Sorting happens at query level, not in JavaScript
- **Flexible**: Easy to insert chapters anywhere in sequence
- **Maintainable**: Clear separation of concerns

## Technical Notes
- Table name for the new field: `sort_order` (INTEGER)
- Default sorting: `ascending: true` for logical reading order
- Conflict resolution: Auto-renumber existing items when sort_order changes
- Performance: Add database indexes on sort_order columns
