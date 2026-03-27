# Story 08: Sequence drag-and-drop reorder

**Epic:** epic-04-sequence-log
**Status:** done
**PR:** —

## Goal

As a practitioner, I want to reorder poses in my sequence via drag-and-drop, so the log reflects the actual class flow.

## Acceptance Criteria

- [x] Sequence list items are draggable
- [x] Dropping reorders the list and updates the `order` field
- [x] Order is persisted on save

## Notes

- Uses `@dnd-kit/core` + `@dnd-kit/sortable` with `horizontalListSortingStrategy`
