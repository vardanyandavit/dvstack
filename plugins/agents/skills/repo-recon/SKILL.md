---
name: repo-recon
description: Before the first edit in an unfamiliar repo or area. Bounded orientation — package manager, verify commands, enforced conventions, blast radius — instead of a whole-repo read.
---

# Repo recon

Enough to not be wrong, and no more. Stop as soon as the change is safe to make.

1. **Package manager from the lockfile**, never guessed. Note monorepo or not.
2. **Verify commands** from `package.json` scripts and the CI workflow. CI beats the README.
3. **Conventions** from agent rules (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`) and enforced config (lint, formatter, `tsconfig`). Config beats habit.
4. **Scope**: the files in play and their nearest sibling — copy its pattern, do not introduce one the repo does not use.
5. **Blast radius**: who imports it; does it touch money, auth, user data, or anything irreversible. That sets how hard to verify.

Reply with a recon note of three to five lines before editing. Not a file. If something has no answer ("no test command"), say so instead of inventing one.

```
Stack: pnpm monorepo, TS + React, Vitest + Playwright
Verify: pnpm -F web test (narrow) / pnpm check (full)
Scope: packages/web/src/cart/* — 4 importers, touches pricing → higher bar
```
