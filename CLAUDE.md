## Project Overview

**The Forrest Log** is a personal practice tracking web app for Forrest Yoga practitioners.
Users can log their practice sessions, build sequences using a tarot card-style pose library, and reflect on their growth over time.

> Full PRD: [`docs/PRD.md`](./docs/PRD.md)

---

## Conventions

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