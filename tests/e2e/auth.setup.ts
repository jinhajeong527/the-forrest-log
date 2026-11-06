import { test } from "@playwright/test";
import { createServerClient } from "@supabase/ssr";
import { mkdir } from "node:fs/promises";

test("signs in with the development test account", async ({ context }) => {
  const { E2E_EMAIL, E2E_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } = process.env;
  if (!E2E_EMAIL || !E2E_PASSWORD || !NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
    throw new Error("Missing local E2E or Supabase environment variables.");
  }
  if (new URL(NEXT_PUBLIC_SUPABASE_URL).hostname !== "kuhsxfxceamrtxmvptoz.supabase.co") {
    throw new Error("The E2E account must use the development Supabase project.");
  }

  const supabase = createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, {
    cookies: {
      getAll: () => [],
      setAll: async (cookies) => {
        await context.addCookies(cookies.map(({ name, value }) => ({
          name,
          value,
          domain: "localhost",
          path: "/",
        })));
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({
    email: E2E_EMAIL,
    password: E2E_PASSWORD,
  });
  if (error) throw new Error(`Test account sign-in failed: ${error.message}`);

  await mkdir("playwright/.auth", { recursive: true });
  await context.storageState({ path: "playwright/.auth/user.json" });
});
