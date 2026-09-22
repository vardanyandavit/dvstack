---
name: dvstack-mode
description: >-
  Use when starting nontrivial coding work and the user wants the full DVstack
  global bar (quality, trust, verify, coding rules, encode misses) plus automatic
  routing to domain skills (Playwright, frontend, harness). Sticky entry /
  /dvstack-mode / "work in dvstack mode". Not a dump of every skill — conductor
  only. Skip for one-line typos with no risk.
---

# DVstack mode

Sticky conductor for nontrivial coding. **Global bar for any language/stack.** Domain detail stays in other plugins/skills — load them when the task needs them; do not paste their bodies here.

Force entry: `/dvstack-agents:mode` (Claude) or skill name `dvstack-mode` / `@dvstack-mode` (Cursor).

## Non-negotiables (every playbook)

1. **Bar matches blast radius** — follow `agent-ops-bar`. Tiny throwaway stays light; auth/money/user-data needs a real verify.
2. **Trust ladder** — follow `agent-trust-stack`. Fix recurring misses at the highest lasting layer (codebase → CI/lint → guidance → human review). Do not scale agent count before one agent’s verified work is trusted.
3. **Prove it** — follow `verify-loop`. Run the project’s honest check. Diff-reading is not proof.
4. **Coding rules** — when the task writes, changes, or reviews code, follow `coding-rules`. Read a reference only when its trigger matches this change. Do not paste the rules here, and do not substitute a generic style guide. `agent-ops-bar` stays how you work.
5. **Comments** — follow `coding-rules`: comment the why (constraints, surprises, rejected alternatives). A restatement is noise. A comment that contradicts the code is a bug. Never use a comment to excuse debt.
6. **Encode misses** — same friction twice → project rule or skill, not only a chat fix (`agent-ops-bar`). A rule in `coding-rules` that can be a type, lint, or CI check gets promoted via `agent-trust-stack`.
7. **Narrowest domain skill** — route via `using-dvstack`; load Playwright/frontend/harness skills only when the task actually needs them. Point; do not merge plugins into this file.
8. **No extra work** — no unasked refactor, speculative layers, or summary files.

Optional when risk/ambiguity is high: `agent-rigor`, `doubt-check`, `anti-rationalization`, `source-check`. Session hygiene when context bloats: `agent-session`. Unfamiliar repo before first edit: `repo-recon`.

## Startup (every invocation)

1. Say you are in **dvstack-mode**.
2. Match a **playbook** below (or say none fits and use the generic steps).
3. Open a short todo list whose first items are that playbook’s steps (copy them).
4. Force-load skills named in the steps **when that step starts** (Skill tool / Read), not all up front.
5. If the user named a domain plugin (e.g. Playwright / `dvstack-testing`), treat that as a hard hint: load `using-dvstack` then the narrowest matching testing skills.

Stay in mode across turns until the user opts out or the task is done. Casual chit-chat: do not re-run the full bar.

## Playbooks

Open the matching file under `playbooks/` and copy its steps into the todo list.

| Playbook | When |
|---|---|
| [feature](playbooks/feature.md) | New or changed product behavior |
| [bugfix](playbooks/bugfix.md) | Defect: reproduce, root-cause, fix, verify |
| [rewrite](playbooks/rewrite.md) | Migrate/rewrite a codebase or suite (e.g. old Playwright → DVstack testing skills) |
| [review](playbooks/review.md) | Review a diff/PR for quality and agent-safety |
| [harden](playbooks/harden.md) | Security, reliability, or performance hardening on existing code |
| [investigate](playbooks/investigate.md) | Read-only: how/why does this work |

If none fit: `repo-recon` (if unfamiliar) → `agent-ops-bar` → `coding-rules` when code changes → do the work → `verify-loop` → promote any miss via `agent-trust-stack`.

## Domain routing (pointers only)

| Signal | Load |
|---|---|
| Playwright / e2e / flaky / locators / fixtures | `using-dvstack` → `dvstack-testing` skills (narrowest) |
| Testable markup / a11y names / font picker | `dvstack-frontend` skills |
| Building an agent system (tools, gates, contracts) | `dvstack-harness` skills — not for ordinary app code |
| User named a plugin | Prefer that plugin’s skills for domain steps |

## Not this skill

- The code bar alone, without a playbook → `coding-rules`
- Day-to-day single habit without “mode” → use that skill directly (`agent-ops-bar`, `verify-loop`, …)
- Marketplace “which skill?” only → `using-dvstack`
- Trust-ladder decision alone → `agent-trust-stack`
- Inlining Playwright/security/perf encyclopedias — keep those in their own skills

## Verification

- [ ] Named the playbook (or generic path)
- [ ] Global bar applied (ops-bar + trust + verify + coding-rules)
- [ ] On a code change or review, `coding-rules` was loaded and its checklist applied
- [ ] Domain skills loaded only when needed, via `using-dvstack` when unsure
- [ ] Honest verify actually ran before claiming done
- [ ] Recurring miss promoted up the trust stack, not only fixed in chat
