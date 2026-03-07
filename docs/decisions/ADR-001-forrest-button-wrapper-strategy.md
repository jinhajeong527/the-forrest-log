# ADR-001: ForrestButton Wrapper Component Strategy

- Date: 2026-03-07
- Status: Accepted

## Context

The login screen uses `shadcn/ui` Button components styled with project-specific
typography: Cormorant Garamond font, wide letter-spacing, slightly rounded corners,
and a smooth color transition. These styles were being repeated inline as className
props on every button instance.

Two options were considered for centralizing this styling:

**Option A — cva variant**: Add a `forrest` variant to shadcn's existing `buttonVariants`
in `components/ui/button.tsx`, defining the full color + typography combination.

**Option B — wrapper component**: Create a thin `ForrestButton` wrapper that pre-applies
only the typography/shape defaults, delegating color entirely to shadcn's existing
`variant` prop system.

## Decision

Adopted **Option B** (wrapper component).

The project already defines its brand colors as CSS variables (`--primary`,
`--primary-foreground`, etc.) in `globals.css`, and shadcn's `default` variant already
maps those to `bg-primary text-primary-foreground`. There is no need to re-declare color
in a new cva variant — doing so would create a parallel color definition that could drift
from the CSS variables.

`ForrestButton` pre-applies only:
- `font-[family-name:var(--font-cormorant)]` — serif typeface
- `tracking-wide` — generous letter-spacing
- `rounded-sm` — slightly rounded corners (overrides shadcn default `rounded-md`)
- `transition-colors duration-300` — smooth hover transitions

Color is controlled entirely by the `variant` prop passed by the caller, which routes
through shadcn's existing cva system and CSS variables.

## Consequences

- Call sites are clean: only layout and emphasis classNames remain (`w-full`, `italic`, `text-lg`, etc.)
- Color changes are made once in `globals.css` CSS variables and propagate everywhere
- `components/ui/button.tsx` (shadcn) is left unmodified, making future shadcn upgrades easier
- `ForrestButton` serves as the default button primitive across the entire app
