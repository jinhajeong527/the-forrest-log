---
name: commit-plan
description: Analyzes current git changes, recommends branch vs direct commits, proposes a logical commit split, and executes after user approval.
---

# Commit Plan

## Process

1. Run `git status` and `git diff` (staged + unstaged) to understand all pending changes
2. Run `git log --oneline -5` to check recent commit style
3. Analyze the changes and determine:
   - **Branch or direct commits?** — Use a branch if the changeset is feature-level (new functionality, visible user-facing change, warrants a PR). Use direct commits for maintenance, docs, chores, or small fixes.
   - **How to split commits?** — Group by logical concern, not by file. Each commit should represent one coherent intent.
4. Present the proposal to the user:
   - Branch name (if applicable)
   - Numbered commit list with message + files for each
5. Wait for user approval or feedback before executing anything
6. After approval, execute commits in order:
   - Stage the specific files for each commit
   - Commit with the proposed message
   - If branching: create the branch first, then commit, then push with `-u`

## Commit Message Style

Follow the project's existing convention (Conventional Commits):
- `feat:` — new feature or functionality
- `fix:` — bug fix
- `chore:` — maintenance, dependencies, scripts
- `docs:` — documentation only
- `refactor:` — code restructure without behavior change

Keep messages concise (under 72 chars). Focus on *why*, not *what*.

## Branch Naming

- `feat/<short-description>` — new feature
- `fix/<short-description>` — bug fix
- `chore/<short-description>` — maintenance

## Rules

- Never commit `pnpm-lock.yaml` alone — always pair with the `package.json` change that caused it
- Never split a seed file change from its related schema/UI change if they're tightly coupled
- Reference images or design assets go in their own `chore:` commit
- Always confirm with the user before executing any git commands
