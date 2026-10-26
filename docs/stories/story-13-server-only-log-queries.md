# Story 13: Server-only Practice Log queries

**Related Epic:** epic-03-practice-log
**Status:** in progress

## Goal

Keep the page focused on authentication and rendering by moving its database query and result transformation into app/log/queries.ts.

## Background Knowledge

Server Components can query the database directly. Importing "server-only" marks a module as server-only so Next.js reports an error if it enters a Client Component import graph. This does not replace authentication or authorization, create a Server Action, or automatically cache results.

## Acceptance Criteria

- [x] Move getLogData to app/log/queries.ts and rename it getPracticeLogPageData.
- [x] Add import "server-only" to the query module.
- [x] Preserve authentication in page.tsx, withUser-based RLS context, queries, and result shape.
- [ ] Preserve Promise delivery; verify loading and loaded content still display correctly.
- [x] Type and lint checks pass; verify a temporary Client Component import is rejected, then remove it.

## Reference

[Next.js — Preventing environment poisoning](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)
