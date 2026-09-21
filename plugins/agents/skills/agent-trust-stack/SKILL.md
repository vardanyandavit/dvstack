---
name: agent-trust-stack
description: >-
  Use when deciding where to put a lasting fix after an agent mistake, whether
  the repo is safe to scale agent count, or designing rails so agents ship
  quality code without babysitting. Portable trust ladder for any codebase —
  not product-specific frameworks or one-off toolkits.
---

# Agent trust stack

Agents copy what they see. Good output at volume comes from **trust in the system**, not from more chat. Humans still own the final call; agents do the line work.

Quality bar and blast radius: `agent-ops-bar`. Honest verify command: `verify-loop`. Contracts, feature maps, recover loops: harness plugin (`harness-engineering`). This skill owns the **ladder** and the **promote-the-fix** habit.

## Trust stack (strongest → weakest)

When something goes wrong, fix it at the **highest lasting layer** that fits:

1. **Codebase as memory** — patterns, types, module boundaries, paved APIs. Agents extend what is already there.
2. **Static analysis / CI** — linters, compiler, tests, import bans. Make the bad path fail automatically.
3. **Guidance** — skills, rules, review bots. Useful but skippable; never the only rail.
4. **Human style review** — finds gaps; does not scale as the bar. Promote every recurring review note up the stack.

Chat-only corrections die next session. Prefer (1) or (2) over (3) or (4).

## Scale with trust

1. Prove one agent can ship **verified** work before adding many.
2. Babysitting a few agents (course-correcting live) is the hard stage — expect it.
3. Jumping to dozens of agents without rails produces slop and regressions.
4. Weak models still write good code in a **locked-down** repo. Strong rails beat hoping for a stronger model.

## Portable kitchen setup

- **Easy path = right path.** The shortest convenient route must be the correct one (layout, defaults, banned footguns).
- **Copy-safe codebase.** Keep the tree clean enough that you would be happy if an agent cloned every pattern in it — including comments and “temporary” workarounds.
- **Gardener loop.** Delete debt early. One paved path for blessed patterns. When a bad pattern appears, encode a lint/CI rule **immediately**, then let agents clean up.
- **Narration that excuses bugs spreads.** Prefer structure (types, tests, bans) over comments that justify leaving debt.
- **Verification proves behavior.** Drive the real product surface (app, CLI, browser, traces). “Looks fine” is not done.
- **Review finds gaps; rails close them.** Use human review to discover invariants, then push those invariants into CI or architecture.

## Not this skill

- Day-to-day quality bar / blast radius → `agent-ops-bar`
- Finding and running the project check → `verify-loop`
- Heavy contracts / feature maps / recover → `harness-engineering`
- Product-specific frameworks or one-off client toolkits — keep those out of this skill

## Verification

- [ ] A recurring agent miss was promoted to codebase shape or CI/lint — not only a chat note
- [ ] Agent count was not scaled before one agent’s verified output was trusted
- [ ] The shortest path in the touched area is the correct path
- [ ] New bad pattern got a mechanical guard (or an explicit call that judgment is required)
