---
name: anti-rationalization
description: Use on any non-trivial change when you might skip verify, trust "looks right", expand scope, invent APIs from memory, skip docs, or call a check too expensive. Short excuse vs reality table for coding agents.
---

# Anti-rationalization

Agents invent reasons to skip the bar. Treat those reasons as suspects.

## When to use

Any non-trivial change — especially production, tests, or unfamiliar APIs.

## Excuse vs reality

| Excuse | Reality |
|---|---|
| Skip verify; the diff is small | Small diffs still break. Run the honest check. |
| "Looks right" | Reading is not running. |
| Expand scope while I'm here | Extra work unless the user asked. |
| Invent the API from memory | Read types, source, or current docs. |
| Skip docs; I know this framework | Installed version and this repo's skills win. |
| Too expensive to check | A skipped check that would have caught a failure was never saved. |

## Red flags

- Shipping without the project's verify command
- New patterns that contradict an installed DVstack skill
- Confidence with no evidence (no test, no docs URL, no reproduction)
- "I'll add tests later" on the same change that needs them

If you catch yourself in the table, stop, do the cheap check, and only then continue.

## Not this skill

Session budget: `agent-session`. When to deepen: `agent-rigor`. Full harness verify/recover: `harness-engineering`.

## Verification

- [ ] Honest verify ran (or a concrete reason it could not, surfaced to the user)
- [ ] Scope matches the ask — no drive-by extras
- [ ] Framework usage matches installed docs/skills, not memory
- [ ] No excuse from the table is still carrying the change
