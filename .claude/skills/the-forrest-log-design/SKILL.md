---
name: the-forrest-log-design
description: Design guardrails and aesthetic system for The Forrest Log. Enforces a cohesive, ritualistic, diary-inspired yoga interface that avoids generic SaaS aesthetics.
---

# The Forrest Log – Design System Skill

This skill defines the aesthetic, emotional, spatial, and implementation identity of **The Forrest Log**.

Apply this skill for all UI work in this project.

---

## Core Concept

Design as if this interface exists in a **physical ritual space**, not inside a startup product ecosystem.

The Forrest Log is not a productivity tool.
It is a personal, reflective, grounded yoga journal.

The interface should feel:
- Intentional
- Calm
- Tactile
- Slightly mystical but never theatrical
- Personal, not corporate

**The one thing someone should remember:**
> "It felt like opening a personal ritual journal."

If a design looks like a generic SaaS login page, it has failed.
If it feels like entering a quiet, intentional space, it has succeeded.

---

## Design Thinking (Before Coding)

Before writing any code, understand and commit to a direction:

- **Purpose**: What does this screen/component do in the context of a yoga practice journal?
- **Tone**: Ritual. Reflection. Return. Strength with softness.
- **Constraints**: Next.js 15 App Router, shadcn/ui, Tailwind CSS, mobile-first, accessible.
- **Differentiation**: What makes this feel like a journal page, a tarot card, or a quiet altar — rather than a dashboard?

---

## Aesthetic Direction

### Color

- Warm parchment / stone / beige base tones
- Muted terracotta or clay accents
- Deep brown ink instead of pure black
- Soft shadows, never sharp neon contrast
- Subtle paper grain or organic texture when appropriate

Avoid:
- Cold blue-grays
- Neon accents
- Purple startup gradients
- Glassmorphism
- Glossy UI
- Hyper-modern fintech aesthetics

### Typography

- Serif display font for headings — editorial, ritual, timeless
- Refined, readable body font for prose
- Typography should feel like printed ink on paper
- Generous spacing, calm vertical rhythm

Avoid:
- Inter, Roboto, Arial, system fonts
- Overused tech font pairings
- Dense or compressed type

### Backgrounds & Visual Details

Create atmosphere and depth rather than defaulting to flat solid colors.

Use:
- Warm gradient meshes in earth tones
- Subtle paper grain or noise overlay
- Soft vignette or shadow framing
- Decorative borders that suggest a physical object
- Layered transparencies with low contrast

---

## Spatial Philosophy

Layouts should evoke:
- A journal page
- A tarot card
- A folded or opened physical object
- A quiet altar-like composition

Use:
- Balanced symmetry or intentional stillness
- Framed content blocks
- Breathing room and generous negative space

Avoid:
- Chaotic asymmetry
- Overlapping chaos
- Dense dashboard grids
- Grid-breaking diagonal elements

---

## Motion Philosophy

Motion should feel like breath.

- Slow ease-in-out transitions (400–700ms)
- Gentle staggered reveals on load
- Subtle unfolding metaphors (open, settle, breathe)
- Page-shift instead of dramatic flips
- One well-orchestrated load sequence is better than scattered micro-interactions


Avoid:
- High-energy bounce animations
- Aggressive micro-interactions
- Fast UI twitching
- Dramatic entrance/exit effects

---

## Emotional Tone

The interface should evoke:
- Ritual
- Growth over time
- Reflection
- Return
- Strength with softness

Avoid:
- Gamification energy
- Hustle / productivity tone
- KPI-driven dashboard vibe
- Competitive or achievement-heavy language

---

## UI Language

Use soft, intentional wording.

Examples:
- "Enter the Log"
- "Return to your practice"
- "Begin today's entry"
- "Breathe and continue"
- "Your sequence"
- "Today's reflection"

Avoid:
- "Get Started Now"
- "Boost Productivity"
- "Track Performance"
- "Dashboard"
- "Streak"

---

## Implementation Standards

Produce production-grade, functional code in every output:

- Next.js 15 App Router conventions
- TypeScript throughout
- shadcn/ui components as base — extend visually, don't fight the system
- Tailwind CSS for styling; use CSS variables for theme tokens
- Semantic HTML for all structure
- ARIA labels and keyboard accessibility required
- Mobile-first responsive layout
- Avoid decorative elements that harm clarity or performance

Elegance comes from restraint and precision, not decoration.

### Component Wrappers

Every interactive element that needs to carry the project's design tokens must live in `components/common/` as a named wrapper — never styled inline at each usage site.

**Rule**: If a shadcn primitive or raw HTML element needs project-specific styling (font, color, border radius, size), extract it as a `components/common/` wrapper before using it in a feature component.

Examples of what belongs in `components/common/`:
- `ForrestButton` — wraps shadcn `Button` with Cormorant font, earthy palette
- `ForrestInput` — wraps shadcn `Input` with Cormorant italic, muted border, earthy focus ring
- `ForrestSearchInput` — wraps `ForrestInput` with a leading search icon, used wherever a search field appears

**How to apply**: Before writing a styled `<input>` or `<Input className="...font-cormorant...">` inside a feature component, check if a matching wrapper already exists in `components/common/`. If it doesn't, create it there first, then use it.

---

## What to Avoid (Summary)

| Category | Avoid |
|---|---|
| Color | Cold grays, neon, purple gradients |
| Typography | Inter, Roboto, system fonts |
| Layout | Dense grids, chaotic asymmetry |
| Motion | Fast bounce, aggressive micro-interactions |
| Language | "Get started", "dashboard", "boost" |
| Aesthetic | Glassmorphism, fintech polish, startup SaaS |
| Energy | Gamification, productivity tone, KPI framing |
