# Prisma RLS rollout

## Prepared code

withUser passes a server-verified user ID using parameterized transaction-local settings compatible with auth.uid(). Protected operations use the same transaction client. Existing ownership checks remain; related log and sequence writes are atomic.

## Database setup

Apply migrations through DIRECT_URL first. The poses migration creates app_user as NOLOGIN if absent, enables poses RLS, and permits that role to SELECT every pose. Existing credentials are preserved. The named policy is safely replaced if already applied manually in production.

After migrations, provision the runtime login in SQL Editor. Do not commit real passwords:

```sql
ALTER ROLE app_user LOGIN PASSWORD '<APP_DB_PASSWORD>'
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

Apply migrations and provision app_user first. Save app_user credentials in Vercel Production DATABASE_URL (shared pooler username: app_user.PROJECT_REF). Keep DIRECT_URL privileged and retain the production Supabase URL/public key. Deploy updated code and environment together; do not redeploy old code with the restricted connection. Verify login and log CRUD, including sequence pose names. To roll back, restore the previous runtime connection and redeploy; application checks remain but database RLS is bypassed again.

Code preparation alone does not activate RLS protection while runtime still uses postgres. User context is not authentication; the server remains the trust boundary.

## Automated checks

Run `npx tsx --test tests/prisma-user.test.ts tests/prisma-rls.integration.test.ts`.
The integration check is skipped unless RLS_TEST_DATABASE_URL explicitly points to a dedicated migrated test database with the restricted login and at least one seeded pose. It creates temporary records for two generated user IDs and removes them afterward. Do not point it at production. Unit tests verify helper behavior; only the database integration check verifies RLS enforcement.

## Production incident: 2026-10-18

After runtime account switching, a sequence pose relation returned null and rendering failed at s.pose.name. The user confirmed that enabling poses RLS and adding poses_app_user_read resolved the error. The migration records the same policy for reproducible development and production setup. Apply it normally through Prisma even where the SQL was already applied manually; it preserves existing login credentials and reconciles the named policy. Do not seed production.
