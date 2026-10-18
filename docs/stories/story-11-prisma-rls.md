# Story 11: Enforce user data isolation with Prisma and RLS

**Related Epics:** epic-03-practice-log, epic-04-sequence-log
**Status:** in progress

## Goal

Protect practice and sequence logs with database-level RLS even when an application query omits an ownership filter. Keep existing authentication and ownership checks.

## Context

Supabase Auth verifies users; Prisma accesses data. The local connection and the supplied production connection setting use postgres, which bypasses RLS. Existing RLS migrations use auth.uid(), but their deployment must be verified; Prisma does not currently pass user context to the database.

## Steps

1. Verify RLS and policies on practice_logs and sequence_logs in the target database.
2. Create one shared runtime DB login with minimal permissions, NOSUPERUSER and NOBYPASSRLS, no table ownership, and no ability to assume privileged roles. Keep the privileged migration connection separate.
3. Add a common Prisma helper that passes the server-verified user ID using parameterized, transaction-local settings compatible with auth.uid(). Run protected queries through the same transaction client.
4. Move log reads and writes into the helper while preserving existing ownership checks. Keep related log and sequence writes atomic.
5. Validate in a test database, then deploy the code, switch the runtime DATABASE_URL to the restricted login, and redeploy. Keep migration DIRECT_URL privileged; retain the previous connection for rollback.

## Acceptance Criteria

Test with two users and the actual restricted runtime role:

- [ ] Own log CRUD and pose-library reads work.
- [ ] Queries without ownership filters cannot read, update, or delete another user’s logs; writes cannot assign another owner or attach sequences to another user’s log.
- [ ] Missing user context permits no protected reads or writes.
- [ ] Users remain isolated across concurrent requests, commit, rollback, and pooled connection reuse.
- [ ] Target DB role, grants, and RLS policies are verified; production smoke tests pass after switching the connection.

## Progress

Application changes prepared. Database verification and production rollout pending. See [rollout steps](../prisma-rls-rollout.md).
