# The Forrest Log

A personal practice tracking web app for Forrest Yoga practitioners. Log sessions, build pose sequences using a tarot card-style library, and reflect on your growth over time.

---

## Features

- **Practice Log** — Record sessions with date, class theme, peak pose, condition (before/after), props used, and notes
- **Pose Library** — 297 Forrest Yoga poses displayed as tarot cards, filterable by category
- **Sequence Builder** — Build and reorder pose sequences with drag-and-drop within the log form
- **Peak Pose Picker** — Select a peak pose from the full library directly in the log form
- **Calendar View** — Filter logs by date via a sticky calendar panel
- **Auth** — Email and Google login via Supabase Auth; all data is user-scoped with RLS

---

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Supabase Auth |
| Styling | shadcn/ui + Tailwind CSS v4 |
| Drag & Drop | @dnd-kit |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A Supabase project

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

### Install & Run

```bash
pnpm install
pnpm prisma migrate deploy
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Setup

Run migrations and seed the pose library:

```bash
# Apply migrations
pnpm db:migrate

# Seed 297 poses
pnpm db:seed
```

To generate pose images (requires OpenAI API key):

```bash
OPENAI_API_KEY=your_key pnpm pose:generate
pnpm pose:import --input <generated-images-dir>
```

---

## Project Structure

```
app/
  log/          — Practice log page + server actions
  poses/        — Pose library page
  login/        — Auth page
components/
  common/       — Shared UI components (ForrestButton, ForrestDialog, ConditionStars, …)
  log/          — Log feature components (PracticeLogForm, LogDetailView, SequencePicker, …)
  poses/        — Pose feature components (PoseCard, PoseCategoryFilter, …)
  ui/           — shadcn-managed primitives
docs/
  PRD.md        — Product requirements
  epics/        — Epic-level goals
  stories/      — Story-level acceptance criteria
  decisions/    — Architecture decision records
prisma/
  schema.prisma — Database schema
  seed.ts       — Pose seeding script
scripts/        — Pose import and image generation utilities
public/
  pose-images/  — Static WebP pose illustrations
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm db:migrate` | Apply Prisma migrations |
| `pnpm db:seed` | Seed pose data |
| `pnpm pose:generate` | Generate pose images via OpenAI |
| `pnpm pose:import` | Import generated images into `public/pose-images/` |
