# Story 12: Practice Log loading state

**Related Epic:** epic-03-practice-log
**Status:** in progress

## Goal

Keep the header and calendar visible while practice logs load. Show a yoga illustration and “Gathering your practice moments…” in the content panel.

## Background Knowledge

Suspense provides loading UI for individual regions. The calendar and content panel share one data Promise.

## Acceptance Criteria

- [x] Header and calendar remain visible during loading.
- [x] Loading UI uses existing design tokens, a decorative yoga SVG, and role="status".
- [x] Records and calendar markers appear correctly after loading.
- [ ] Check empty and mobile states.
- [x] Remove the temporary development delay and run final checks before committing.

## Reference

[Next.js — loading.js and Suspense](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
