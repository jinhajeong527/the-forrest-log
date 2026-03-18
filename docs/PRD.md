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

#### 4.2.1 Log List Page

- Split layout: calendar on the left, journal list on the right
- Calendar (shadcn Calendar / react-day-picker):
  - Monthly view with prev/next navigation
  - Days with a practice log marked with a dot indicator
  - Clicking a date scrolls to and highlights that entry in the list
  - Mobile: calendar stacked above the list
- Journal list (reverse chronological):
  - Each entry shows date (large, serif), class theme, and peak pose name
  - Tapping an entry navigates to `/log/[id]`
- Empty state when no logs exist
- "New Log" button in sticky header

#### 4.2.2 Create Log

The following fields are available when creating a practice log:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Date | Date | Yes | Date of practice |
| Class Theme | Text | No | e.g. Hip Opening, Backbends, Inversions |
| Peak Pose | Pose select | No | Selected from Pose Library |
| Condition Before | 1–5 scale | No | Physical condition before class |
| Condition After | 1–5 scale | No | Physical condition after class |
| Props Used | Multi-select | No | FOAM_ROLLER / KNEE_PAD / BLOCK / STRAP / BOLSTER / BLANKET |
| Notes | Textarea | No | Free memo |
| Sequence Log | Pose list | No | See 4.2.3 |

#### 4.2.3 Sequence Log

A nested record within the practice log.

- Add poses to the sequence by selecting from the Pose Library
- Reorder poses via drag and drop
- Each pose entry supports the following fields:

| Field | Type | Required |
|-------|------|----------|
| Pose | Pose select | Yes |
| Order | Integer | Yes (drag & drop) |
| Notes | Text | No |

#### 4.2.4 Log Detail Page

- View all content of a saved practice log
- If a sequence log exists, display poses as tarot cards in order
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
/log                      → Practice log list
/log/new                  → Create practice log
/log/[id]                 → Practice log detail
/log/[id]/edit            → Edit practice log
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