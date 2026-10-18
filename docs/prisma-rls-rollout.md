# Prisma RLS rollout

## Prepared code

withUser passes a server-verified user ID using parameterized transaction-local settings compatible with auth.uid(). Protected operations use the same transaction client. Existing ownership checks remain; related log and sequence writes are atomic.

## Database setup (not executed)

Apply existing migrations through DIRECT_URL and verify RLS and policies on practice_logs and sequence_logs. In Supabase SQL Editor, create one runtime login, replacing the password placeholder:

```sql
CREATE ROLE app_user LOGIN PASSWORD '<generated-password>'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
GRANT CONNECT ON DATABASE postgres TO app_user;
GRANT USAGE ON SCHEMA public, auth TO app_user;
GRANT EXECUTE ON FUNCTION auth.uid() TO app_user;
GRANT SELECT ON public.poses TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.practice_logs, public.sequence_logs TO app_user;
```

Do not assign table ownership or privileged role memberships. Review inherited PUBLIC privileges in the actual database. Existing policies apply to PUBLIC; new tables need separate grants and policy review.

## Verify before switching production

Use a separate test database and the restricted runtime login. Verify own CRUD, pose reads, and two-user isolation with deliberately unfiltered queries. Verify foreign-owner inserts/updates and sequence reparenting are rejected. Missing context must allow no protected operations. Test concurrent users, rollback, and reuse of pooled connections. Confirm the runtime role cannot bypass RLS, own protected tables, or assume privileged roles.

## Deploy

Deploy code first. Replace runtime DATABASE_URL credentials with app_user (shared pooler username: app_user.PROJECT_REF), keep DIRECT_URL privileged, and redeploy. Smoke-test login and log CRUD. To roll back, restore the previous runtime connection and redeploy; application checks remain but database RLS is bypassed again.

Code preparation alone does not activate RLS protection while runtime still uses postgres. User context is not authentication; the server remains the trust boundary.

## Automated checks

Run `npx tsx --test tests/prisma-user.test.ts tests/prisma-rls.integration.test.ts`.
The integration check is skipped unless RLS_TEST_DATABASE_URL explicitly points to a dedicated migrated test database with the restricted login and at least one seeded pose. It creates temporary records for two generated user IDs and removes them afterward. Do not point it at production. Unit tests verify helper behavior; only the database integration check verifies RLS enforcement.
