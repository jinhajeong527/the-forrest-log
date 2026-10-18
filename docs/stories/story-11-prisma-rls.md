# Story 11: Enforce user data isolation with Prisma and RLS

**Related Epics:** epic-03-practice-log, epic-04-sequence-log
**Status:** in progress

## Goal

Protect practice and sequence logs with database-level RLS even when an application query omits an ownership filter. Keep existing authentication and ownership checks.

## Context

Supabase Auth verifies users; Prisma accesses data. withUser now passes verified user context to Prisma transactions. Development uses app_user; production role switching and a pose-read policy were applied during rollout.

## Steps

1. Verify RLS and policies on practice_logs and sequence_logs in the target database.
2. Create one shared runtime DB login with minimal permissions, NOSUPERUSER and NOBYPASSRLS, no table ownership, and no ability to assume privileged roles. Keep the privileged migration connection separate.
3. Add a common Prisma helper that passes the server-verified user ID using parameterized, transaction-local settings compatible with auth.uid(). Run protected queries through the same transaction client.
4. Move log reads and writes into the helper while preserving existing ownership checks. Keep related log and sequence writes atomic.
5. Validate in a test database, then save the restricted runtime DATABASE_URL and deploy the updated code and environment together. Keep migration DIRECT_URL privileged; retain the previous connection for rollback.

## Acceptance Criteria

Test with two users and the actual restricted runtime role:

- [ ] Own log CRUD and pose-library reads work.
- [ ] Queries without ownership filters cannot read, update, or delete another user’s logs; writes cannot assign another owner or attach sequences to another user’s log.
- [ ] Missing user context permits no protected reads or writes.
- [ ] Users remain isolated across concurrent requests, commit, rollback, and pooled connection reuse.
- [ ] Target DB role, grants, and RLS policies are verified; production smoke tests pass after switching the connection.

## Progress

Development isolation tests passed. Production RLS was confirmed; the user reported that the app_user pose-read policy resolved a rendering error on 2026-10-18. Migration and relation regression coverage added; full production CRUD verification remains pending. See [rollout steps](../prisma-rls-rollout.md).
