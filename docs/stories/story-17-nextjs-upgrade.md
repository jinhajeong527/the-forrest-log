# Story 17: Upgrade Next.js before error recovery

**Status:** todo
**Precedes:** story-14-log-error-boundary

## Goal

Upgrade Next.js from 16.1.6 to a verified stable 16.x release supporting retry(), before implementing Story 14.

## Background Knowledge

The error-boundary retry prop became stable in Next.js 16.3. Unlike reset(), it requests fresh content before rendering again. Framework upgrades require compatible dependencies and validation of existing application flows.

## Acceptance Criteria

- [ ] Check official release notes and registry versions; agree on an exact stable target of 16.3 or newer within 16.x, excluding canary releases.
- [ ] Run npm view next@<TARGET_VERSION> peerDependencies --json and compare the React/React DOM ranges with the installed versions before changing dependencies.
- [ ] Upgrade next and eslint-config-next together; check Node.js and React compatibility and update related dependencies only when required. Commit the package manifest and lockfile.
- [ ] Pass type/lint checks and a production build; verify next start works.
- [ ] Verify Google login/callback, log CRUD, Suspense loading, and Pose Library search/filter in development or preview, without changing production DB settings.
- [ ] Confirm the installed error-boundary types expose retry(); update Story 14's version note accordingly.

## Compatibility Check

Query the exact target before installing (16.4.3 is an example, not an approved upgrade target):

```bash
npm view next@16.4.3 peerDependencies --json
```

Registry check on 2026-10-27: next@latest resolved to 16.4.3. Both react and react-dom allow ^19.0.0, which includes the project's 19.2.3. A React upgrade is therefore not required by these peer ranges alone; release notes, security fixes, and other libraries still need review.

## Out of Scope

Implementing error.tsx, new features, and production deployment. Keep this upgrade in a separate PR so it can be reverted independently.

## References

- [Next.js — Upgrade Guides](https://nextjs.org/docs/app/guides/upgrading)
- [Next.js — error.js version history](https://nextjs.org/docs/app/api-reference/file-conventions/error#version-history)
- [npm — peerDependencies](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#peerdependencies)
