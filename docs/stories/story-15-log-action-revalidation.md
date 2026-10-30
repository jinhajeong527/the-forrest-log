# Story 15: Refresh Practice Logs after Server Actions

**Related Epic:** epic-03-practice-log
**Status:** in progress

## Goal

Let successful log mutations trigger the page update from the server instead of relying on client-side router.refresh().

## Background Knowledge

Server Actions can call revalidatePath("/log") after a successful mutation to update the affected page. router.refresh() requests a new server render but does not invalidate server-side cached data. Current Prisma queries are not explicitly cached; this change clarifies update ownership rather than fixing a confirmed stale-data bug.

## Acceptance Criteria

- [x] Call revalidatePath("/log") after successful create, update, and delete transactions, not after validation failures or denied operations.
- [x] Remove the redundant mutation-related router.refresh(); preserve local form and panel state handling.
- [ ] Verify the list and calendar markers update after each mutation without a manual reload.
- [x] Preserve authentication and RLS; pass type/lint checks.

## Validation

Type and scoped lint checks pass. The user observed automatic updates; create/update/delete coverage for both the list and calendar markers remains pending.

## References

- [Next.js — revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [Next.js — useRouter / router.refresh()](https://nextjs.org/docs/app/api-reference/functions/use-router)
