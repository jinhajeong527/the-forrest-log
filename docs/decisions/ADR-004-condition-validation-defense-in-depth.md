# ADR-004: `conditionBefore/After` — Validated at Both Zod and DB CHECK Constraint Levels

## Status
Accepted

## Decision
Validate `conditionBefore` and `conditionAfter` (1–5 range) at two layers:
- **Zod** (`z.int().min(1).max(5)`) — app-level, user-facing error messages
- **DB CHECK constraint** (`BETWEEN 1 AND 5`) — added directly in `migration.sql`, defense against direct DB access that bypasses the app

## Reason
Defense in depth: Zod covers normal app flow with good UX; the CHECK constraint protects data integrity if the API layer is bypassed (e.g., direct DB access, future scripts).

Prisma does not support CHECK constraints in `schema.prisma`, so the constraint is added manually in the generated `migration.sql` and tracked in git.

## Rejected Alternatives
- Zod only — leaves DB vulnerable to direct writes outside the app
- DB CHECK only — no user-friendly validation error messages
