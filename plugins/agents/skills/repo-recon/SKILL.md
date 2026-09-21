---
name: repo-recon
description: Use before the first edit in an unfamiliar repository, or when picking up work in a part of a codebase you have not read. A bounded orientation pass — stack, verify commands, conventions, tests, and the blast radius of the change — producing a short recon note instead of a whole-repo read. Not a code review, and not for a repo you already know.
---

# Repo recon

Orient before editing. Cheap, bounded, once per unfamiliar area.

An agent that starts editing without this invents conventions the repo already has, and an agent that reads the whole repo first burns the budget before doing any work. **Recon is the middle: enough to not be wrong, and no more.**

## When

First edit in an unfamiliar repo, or in an area you have not read. Skip it entirely for a repo you already worked in this session.

## Five questions

Answer them in this order and stop as soon as the change is safe to make.

1. **What is this?** Read the manifest and the lockfile — `package.json` + which lockfile, or the equivalent. The lockfile names the package manager; guessing it is the most common first mistake. Note the language, framework, and whether it is a monorepo.
2. **How is it proven?** Find the build, test, and lint commands. Do not run the suite yet — see `verify-loop`.
3. **What are its conventions?** Agent rules first — `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, `.claude/rules/`. A repo may ship only one of these on purpose, so read whichever exists rather than assuming a missing file means no conventions. Then the enforced ones: lint config, formatter, `tsconfig`, CI workflow. **Config beats a README**, and both beat your habits.
4. **Where does this change live?** Find the files in scope and read their nearest neighbours — the sibling that already does the same kind of thing is the pattern to copy.
5. **What is the blast radius?** Who imports what you are about to change; whether it touches money, auth, user data, or anything irreversible. That answer sets the bar — `agent-ops-bar`.

## Recon note

Three to six lines, in the reply, before editing. Not a file.

```
Stack: pnpm monorepo, TS + React, Vitest + Playwright
Verify: pnpm -F web test (narrow) / pnpm check (full)
Rules: AGENTS.md, eslint flat config, no default exports
Scope: packages/web/src/cart/* — 4 importers
Radius: checkout path, touches pricing → higher bar
```

If a question has no answer, say so — "no test command found" is a finding the user needs, not a gap to paper over with an invented one.

## Do not

- Read the whole repo, or every file in a directory, before making a small change.
- Trust a README's commands over the CI workflow and lint config.
- Introduce a pattern the repo does not already use because it is the one you know.
- Re-run recon for an area already covered this session.
- Turn this into a code review or an architecture critique nobody asked for.

## Not this skill

Running the check: `verify-loop`. Quality bar: `agent-ops-bar`. Token budget: `agent-session`. Deepening on a risky change: `agent-rigor`. Framework API shape: `source-check`.

## Verification

- [ ] Package manager read from the lockfile, not guessed
- [ ] Verify commands located (or their absence reported)
- [ ] Repo conventions read from enforced config, not assumed
- [ ] Blast radius named, and the bar set from it
- [ ] Recon stayed bounded — no whole-repo read
