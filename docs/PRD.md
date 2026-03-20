# Product Requirements Document
# My Forrest Yoga Log — MVP

**Version:** 1.0  
**Date:** March 2026  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

My Forrest Yoga Log is a practice tracking web app for Forrest Yoga practitioners. It reflects the unique characteristics of Forrest Yoga — peak poses, sequence structure, and the 4 Pillars philosophy — and provides a visual pose tarot card library that can be used both for exploration and for logging practice sessions.

### 1.2 Goals

- Provide a personal log to record and review Forrest Yoga practice sessions
- Implement an intuitive UX for logging sequences using pose tarot cards
- Ship a working product within MVP scope quickly

### 1.3 Target Users

- Individual Forrest Yoga practitioners
- Yoga students who want to track their practice and growth over time

---

## 2. Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Styling | shadcn/ui (Radix UI + Tailwind CSS)
---

## 3. MVP Scope

The MVP consists of two core features:

1. **Practice Log** (including Sequence Log)
2. **Pose Library** (tarot card style)

---

## 4. Functional Requirements

### 4.1 Authentication

- Email / social login via Supabase Auth
- All pages require authentication — unauthenticated users are redirected to `/login`

---

### 4.2 Practice Log

#### 4.2.1 Log Page — Master-Detail Split View

- Left panel: calendar (sticky, acts as date filter control)
- Right panel: log list or editor — switches based on user action
- Mobile: calendar stacked above panel (vertical layout)

Calendar UX:
- Default: no date selected (selectedDate = null)
- Today: subtle highlight only (outline or dot indicator) — not the "selected" style
- Clicking a date: strong "selected" style + filters right panel to that date
- Today and selected states can coexist; merge visually when they fall on the same day

Right panel — default (all logs):
- Header: "Practice Logs" with "+ New Log" button on the right
- Logs displayed in reverse chronological order (large serif date, theme, peak pose)
- Clicking an entry switches the right panel to the detail view
- Empty state when no logs exist

Right panel — date-filtered state:
- Shows only logs for the selected date
- Filter chip displayed below the header: [Mar 20, 2026 ✕]
- Clicking ✕ clears the filter, deselects the calendar date, and returns to all logs

"+ New Log" behavior:
- Pre-fills the date field with selectedDate if active, otherwise today
- Switches right panel to create form (no dialog)

#### 4.2.2 Create / Edit Log (Right Panel)

Rendered inline in the right panel — no dialog.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Date | Date | Yes | Right-aligned, with → indicator |
| Class Theme | Text | No | Free text input |
| Peak Pose | Pose card | No | Click card placeholder → opens Pose Picker dialog |
| Condition Before | 1–5 stars | No | Star rating UI |
| Condition After | 1–5 stars | No | Star rating UI |
| Props Used | SVG icon grid | No | Click icon to toggle (dimmed → colored) |
| Notes | Textarea | No | Free memo |
| Sequence Log | Button (placeholder) | No | Opens dialog in future phase; button only for now |

Peak Pose Picker:
- Card placeholder area within the form
- Clicking opens ForrestDialog showing the pose library (tarot card grid)
- Selecting a pose closes the dialog and displays the card in the form

Props:
- 6 icons: FOAM_ROLLER / KNEE_PAD / BLOCK / STRAP / BOLSTER / BLANKET
- Default: muted/dimmed; selected: colored/active
- Custom SVG assets to be provided separately; placeholder icons used in this phase

#### 4.2.3 Sequence Log (Placeholder)

- "Sequence" button placed at the bottom of the create/edit form
- Current phase: button position reserved; no functionality implemented
- Future phase: opens ForrestDialog for pose selection and drag-and-drop ordering

Each sequence entry (future):

| Field | Type | Required |
|-------|------|----------|
| Pose | Pose select | Yes |
| Order | Integer | Yes (drag & drop) |
| Notes | Text | No |

#### 4.2.4 Log Detail (Right Panel)

- Displayed inline in the right panel — no dialog
- Shows all fields of the saved practice log
- If a sequence log exists, displays poses as tarot cards in order
- Edit and delete actions available

---

### 4.3 Pose Library

#### 4.3.1 Pose List Page

- Display all poses as tarot cards in a grid layout
- Filter by category

| Category |
|----------|
| Abdominals |
| Arm Balances |
| Backbends |
| Balancing Poses |
| Hip Openers |
| Inversions |
| Lunges |
| Restorative |
| Standing Poses |

#### 4.3.2 Pose Card

Each pose card displays the following:

| Field | Description |
|-------|-------------|
| Pose Name | e.g. Side Crow |
| Sanskrit Name | e.g. Parsva Bakasana |
| Categories | One or more of the categories above |
| Level | BEGINNER / INTERMEDIATE / ADVANCED |
| Tarot Card Image | Pose illustration |
| Description | 1–2 line summary of the pose |

#### 4.3.3 Initial Pose Data

Default poses to seed for MVP (focused on core Forrest Yoga poses):

| Pose Name | Categories | Level |
|-----------|------------|-------|
| Crow Pose | Arm Balances, Balancing Poses | Intermediate |
| Side Crow | Arm Balances, Balancing Poses | Advanced |
| Headstand | Inversions, Balancing Poses | Advanced |
| Forearm Stand | Inversions, Arm Balances | Advanced |
| Turbo Dog | Inversions | Intermediate |
| Dolphin Pose | Inversions | Beginner |
| Wheel Pose | Backbends | Intermediate |
| Camel Pose | Backbends | Intermediate |
| Dancer Pose | Balancing Poses, Standing Poses | Intermediate |
| Standing Split | Balancing Poses, Standing Poses | Intermediate |

---

## 5. Database Schema

### poses

```sql
poses
- id: uuid (PK)
- name: text
- sanskrit_name: text (nullable)
- categories: PoseCategory[] (enum array)
- level: PoseLevel (enum, default: BEGINNER)
- description: text (nullable)
- image_url: text (nullable)
- created_at: timestamp
- updated_at: timestamp

enum PoseCategory: ABDOMINALS | ARM_BALANCES | BACKBENDS | BALANCING_POSES |
                   HIP_OPENERS | INVERSIONS | LUNGES | RESTORATIVE | STANDING_POSES
enum PoseLevel: BEGINNER | INTERMEDIATE | ADVANCED
```

### practice_logs

```sql
practice_logs
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- date: date
- theme: text (nullable)
- peak_pose_id: uuid (FK → poses, nullable)
- condition_before: integer (1–5, nullable, CHECK constraint)
- condition_after: integer (1–5, nullable, CHECK constraint)
- props: Prop[] (enum array, default: [])
- notes: text (nullable)
- created_at: timestamp
- updated_at: timestamp

enum Prop: FOAM_ROLLER | KNEE_PAD | BLOCK | STRAP | BOLSTER | BLANKET
```

### sequence_logs

```sql
sequence_logs
- id: uuid (PK)
- practice_log_id: uuid (FK → practice_logs)
- pose_id: uuid (FK → poses)
- order: integer
- notes: text (nullable)
- created_at: timestamp
- updated_at: timestamp

index: (practice_log_id, order)
```

---

## 6. Page Structure

```
/                         → Home (landing / login redirect)
/login                    → Login
/log                      → Practice log (master-detail split view: list / create / view / edit in right panel;
                            peak pose picker and sequence log via ForrestDialog)
/poses                    → Pose library
```

---

## 7. Non-Functional Requirements

- Mobile responsive (users will likely log sessions on mobile right after class)
- Supabase RLS (Row Level Security) applied — users can only access their own logs

---

## 8. Out of Scope for MVP

The following features are excluded from MVP and will be considered in future versions:

- Calendar / streak view
- Peak pose history & statistics
- Custom pose creation
- Social sharing
- Dark / light theme toggle

---

## 9. Milestones

| Phase | Description |
|-------|-------------|
| Phase 1 | Project setup (Next.js + Supabase + Vercel) |
| Phase 2 | Auth integration + RLS + middleware route protection |
| Phase 3 | Pose library (DB seed + card UI) |
| Phase 4 | Practice log CRUD |
| Phase 5 | Sequence log (pose selection + reordering) |
| Phase 6 | Mobile responsive polish + deployment |