# The Forrest Log — ADR Writing Skill

Use this skill when writing a new Architecture Decision Record (ADR) for this project.

---

## When to Write an ADR

Write an ADR when a decision meets any of these criteria:

- Multiple valid approaches existed and one was chosen over others
- The decision affects how future code should be written (establishes a pattern)
- The decision would be hard to understand without context (e.g. "why not just use X?")
- It involves a trade-off that future contributors need to know about

Examples from this project:
- ForrestButton wrapper strategy (vs cva variant)
- Env validation with Zod (vs runtime checks)
- ForrestButton `intent` prop (vs `font` prop)

Do NOT write an ADR for:
- Trivial implementation choices with no real alternatives
- Bug fixes
- UI polish / visual tweaks

---

## File Naming

```
docs/decisions/ADR-{NNN}-{kebab-case-title}.md
```

Find the next number by checking existing files in `docs/decisions/`.

---

## Format

```markdown
# ADR-{NNN}: {Title}

- Date: {YYYY-MM-DD}
- Status: Accepted

## Context

[What problem or situation prompted this decision?
What options were considered? Describe each option briefly.]

## Decision

[Which option was chosen, and why?
Be specific about the reasoning — not just what, but why this over the alternatives.]

## Consequences

[What are the outcomes of this decision?
Include both positive outcomes and any trade-offs or limitations.]
```

---

## Writing Guidelines

- **Context**: Describe the situation neutrally. Don't argue for the decision yet — just explain the problem and the options.
- **Decision**: Be direct. Start with the chosen option, then explain the reasoning. Reference the context options by name.
- **Consequences**: Be honest about trade-offs. Good ADRs acknowledge what was given up, not just what was gained.
- **Length**: Aim for concise. A good ADR is readable in 2 minutes. No need for exhaustive detail.
- **Language**: English only.
- **Date**: Use today's date (`currentDate` from memory if available).

---

## Example ADR (ADR-001 summary)

**Problem**: ForrestButton styles were repeated inline everywhere.
**Options**: (A) add a `forrest` cva variant to shadcn button, (B) thin wrapper component.
**Decision**: Wrapper — because color is already handled by CSS variables + shadcn variants; wrapper only adds typography/shape without duplicating color logic.
**Consequence**: shadcn files stay unmodified; color changes propagate from one place.

Refer to `docs/decisions/ADR-001-forrest-button-wrapper-strategy.md` as a style reference.
