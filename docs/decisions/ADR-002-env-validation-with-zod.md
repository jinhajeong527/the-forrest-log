# ADR-002: Environment Variable Validation with Zod

**Status:** Accepted
**Date:** 2026-03-08

## Context

Next.js exposes environment variables via `process.env`. TypeScript types all
keys as `string | undefined` regardless of whether they are actually required,
which means:

- Missing variables cause runtime failures deep inside the application rather
  than at startup
- Every access site requires either a `!` non-null assertion or a null check,
  both of which are easy to forget

## Decision

Validate required environment variables using Zod in `lib/env.ts` at module
load time. If any variable is missing the server throws immediately before
handling any request.

Additionally, augment `NodeJS.ProcessEnv` with the inferred Zod schema type
so TypeScript treats validated keys as `string` (not `string | undefined`)
throughout the codebase — no `!` assertions needed.

```ts
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
});

export type TypedProcessEnv = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypedProcessEnv {}
  }
}
```

## Consequences

- **Fail fast**: server refuses to start with a clear error message when env
  vars are absent, instead of failing silently mid-request
- **No `!` assertions**: `process.env.NEXT_PUBLIC_SUPABASE_URL` is typed as
  `string` everywhere without needing non-null assertions
- **Single source of truth**: adding a new required variable means updating
  `lib/env.ts` and `.env.example` — nothing else
