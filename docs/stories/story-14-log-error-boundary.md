# Story 14: Practice Log error boundary

**Related Epic:** epic-03-practice-log
**Status:** done

## Goal

Show a helpful error message and recovery action when practice-log data fails to load, while keeping the page header visible.

## Background Knowledge

Suspense handles pending data; a rejected Promise read with use() is handled by the nearest Error Boundary. Next.js error.tsx defines a route-level boundary as a Client Component and excludes the layout in the same segment. Expected form-validation errors should remain return values rather than becoming page errors.

## Acceptance Criteria

- [x] Add app/log/error.tsx with a generic message and recovery button using existing design components; do not display raw DB errors.
- [x] Verify a temporary query failure shows the error UI and preserves the header.
- [x] Verify retry() obtains fresh data after a one-time query failure, rather than reusing the rejected Promise.
- [x] Keep authentication, RLS, and existing form-error handling unchanged.
- [x] Remove temporary failure code and pass type/lint checks.

## Version Note

Implemented with Next.js 16.4.3 and its retry() API. A temporary development-only first-query failure verified the error screen and successful recovery in the browser; the temporary code was removed.

## References

- [Next.js — Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js — error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)
