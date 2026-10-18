-- Bootstrap without credentials; provision LOGIN and password separately.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE
      NOINHERIT NOBYPASSRLS;
  END IF;
END
$$;

BEGIN;
ALTER TABLE public.poses ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT ON public.poses TO app_user;
-- Reconcile the same policy already added manually in production.
DROP POLICY IF EXISTS poses_app_user_read ON public.poses;
CREATE POLICY poses_app_user_read ON public.poses
  FOR SELECT TO app_user USING (true);
COMMIT;
