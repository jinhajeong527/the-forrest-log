# Story 18: Cache Shared Pose Data with Cache Components

**Status:** in progress

## Goal

Enable Cache Components and reuse cached pose data across the Pose Library and practice-log pose pickers.

## Background Knowledge

Next.js 16 supports `use cache` with `cacheComponents: true`. Cached queries can use `cacheTag("poses")` for targeted invalidation. Tags label cache entries; they do not provide authorization. Pose data is public and changes infrequently; personal practice logs remain uncached.

## Acceptance Criteria

- [x] Enable Cache Components and Partial Prefetching. Add Suspense fallbacks for request-dependent content.
- [x] Share a server-only pose query with `cacheLife("days")` and the `poses` tag across `/poses` and `/log`.
- [x] Keep authentication and user-specific queries outside the shared cache.
- [x] Verify both screens display poses and share one pose query in a local production build.
- [ ] Verify fresh reads after tag invalidation and document the refresh workflow for pose imports and image updates.

## Verification

Run `pnpm run build`, then `pnpm exec playwright test tests/e2e/pose-cache.spec.ts`. The test uses Chromium and a confirmed development Supabase account configured through local `E2E_EMAIL` and `E2E_PASSWORD` variables. Playwright starts a fresh server and enables the query marker for the test.

## Scope

No personal-log caching, admin UI, or public invalidation endpoint. Propose any substantial routing or authentication changes separately before implementation.

## References

- [Next.js — Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [Next.js — use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Next.js — cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [Next.js — cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
- [Next.js — revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Next.js — updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag)
