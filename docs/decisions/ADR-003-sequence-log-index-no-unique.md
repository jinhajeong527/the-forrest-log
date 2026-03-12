# ADR-003: SequenceLog — `@@index` Only, No `@@unique` on `(practiceLogId, order)`

## Status
Accepted

## Decision
Add `@@index([practiceLogId, order])` on `SequenceLog` but omit `@@unique`.

## Reason
A unique constraint on `(practiceLogId, order)` breaks drag-and-drop reordering: swapping two adjacent poses requires a 2-pass update (temp value → final value) to avoid a constraint violation. Dropping the unique constraint allows a single-pass bulk update.

## Rejected Alternatives
- `@@unique([practiceLogId, order])` — requires temporary placeholder values during reorder, increasing MVP complexity with no meaningful data integrity benefit
