## Project Overview

**The Forrest Log** is a personal practice tracking web app for Forrest Yoga practitioners.
Users can log their practice sessions, build sequences using a tarot card-style pose library, and reflect on their growth over time.

> Full PRD: [`docs/PRD.md`](./docs/PRD.md)

---

## Conventions

### UI / Components
- When implementing UI components or pages, invoke the `the-forrest-log-design` skill first
  to ensure consistency with the design system

### Architecture Decisions
- When significant architectural decisions are made during planning, document them
  as ADR files in `docs/decisions/`. Format: title, status, decision, reason, rejected alternatives.

### Validation
- Always validate at both layers for data integrity constraints (e.g., numeric ranges):
  - **Zod** (app level) — user-facing error messages
  - **DB CHECK constraint** — defense against direct DB access that bypasses the app

### Migrations (raw SQL)
Prisma does not support raw SQL features in `schema.prisma` (CHECK constraints, RLS policies, triggers, etc.).
When raw SQL is required, use `--create-only` to generate an empty migration file, add the SQL manually, then apply:

```bash
pnpm prisma migrate dev --create-only --name <description>
# edit the generated migration.sql, then:
pnpm prisma migrate dev
```

Common cases and examples:

```sql
-- CHECK constraint (e.g. conditionBefore/After must be 1–5)
ALTER TABLE "practice_logs"
  ADD CONSTRAINT "condition_before_range" CHECK (condition_before BETWEEN 1 AND 5);

-- RLS policy (e.g. users can only access their own logs)
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practice_logs_own" ON practice_logs
  FOR ALL USING (user_id = auth.uid());
```

### Tailwind CSS
- Pseudo-element rules (e.g., `::before`, `::after`, `::-webkit-scrollbar`) cannot be nested
  inside `@utility` blocks — Tailwind v4 does not process them correctly there.
  Define pseudo-element rules as separate global CSS rules:
  ```css
  /* ✅ correct */
  @utility scrollbar-none { scrollbar-width: none; }
  .scrollbar-none::-webkit-scrollbar { display: none; }

  /* ❌ avoid — pseudo-element is silently dropped */
  @utility scrollbar-none {
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
  ```

### Zod
- Import from `"zod/v4"`, not `"zod"`
- Always check the [Zod v4 changelog](https://zod.dev/v4) before using any method — avoid deprecated APIs

---

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Supabase Auth |
| Styling | shadcn/ui (Radix UI + Tailwind CSS) |
| Package Manager | pnpm |
| Deployment | Vercel |

---