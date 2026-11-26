# Story 18: Cache Shared Pose Data with Cache Components

**Status:** done

## Goal

Enable Cache Components and reuse cached pose data across the Pose Library and practice-log pose pickers.

## Background Knowledge

Next.js 16 supports `use cache` with `cacheComponents: true`. Cached queries can use `cacheTag("poses")` for targeted invalidation. Tags label cache entries; they do not provide authorization. Pose data is public and changes infrequently; personal practice logs remain uncached.

## Acceptance Criteria

- [x] Enable Cache Components and Partial Prefetching. Add Suspense fallbacks for request-dependent content.
- [x] Share a server-only pose query with `cacheLife("days")` and the `poses` tag across `/poses` and `/log`.
- [x] Keep authentication and user-specific queries outside the shared cache.
- [x] Verify both screens display poses and share one pose query in a local production build.
- [x] Manually verify that tag invalidation refreshes the renamed pose in the library.
- [x] Document the refresh workflow for pose imports and image updates.
- [x] Remove the temporary action, button, and local probe flag.
- [x] Confirm the original development pose name is restored and verify tag invalidation in the log picker.

## Verification

Configure a confirmed development Supabase account with `E2E_EMAIL` and `E2E_PASSWORD` in the local `.env` file. Then run:

```bash
pnpm exec playwright install chromium
pnpm run build
pnpm exec playwright test tests/e2e/pose-cache.spec.ts
```

Playwright starts a fresh server and enables the query marker for the test.

### Manual tag invalidation

The temporary `/poses` button calls `updateTag("poses")` from a Server Action.

1. Keep the original pose name, build with `pnpm run build`, and start with `pnpm start`. The local `.env` must contain `E2E_POSE_CACHE_PROBE=1` for this temporary action.
2. Open `/poses` to populate the cache.
3. Rename one pose in the development database. Refresh the page and confirm the previous name is still shown.
4. Click **Invalidate pose cache (test)** and confirm the changed name appears. Also check the log pose picker.
5. Restore the database name and invalidate again. Remove the temporary action, form/import, and local flag after verification.

The user confirmed that the library kept the cached name after the DB edit and displayed the changed name after pressing the button. The temporary action, button, and local flag have been removed. The user also confirmed tag invalidation in the log picker and restoration of the original database name.

### Pose-update workflow

Pose import scripts, image-sync scripts, and manual database edits do not invalidate the application cache automatically. The current `days` profile permits background refresh after one day when a subsequent request arrives. A new deployment also creates a new build cache. Immediate refresh requires a server-side invalidation trigger. The temporary test button has been removed, so an ongoing immediate-refresh mechanism remains a separate implementation decision.

## Scope

No personal-log caching, admin UI, or public invalidation endpoint. Propose any substantial routing or authentication changes separately before implementation.

## References

- [Next.js — Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [Next.js — use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Next.js — cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [Next.js — cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
- [Next.js — revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Next.js — updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag)
