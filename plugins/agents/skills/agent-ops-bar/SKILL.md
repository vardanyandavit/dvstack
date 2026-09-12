---
name: agent-ops-bar
description: Use when starting nontrivial agent coding, reviewing agent PRs, or deciding throwaway vs production quality. Global agent habits for any tool (Cursor, Claude Code, cloud agents). Not project-specific verify commands.
---

# Agent ops bar

Global rules for coding with AI agents. Apply across projects. Per-repo files stay limited to verify commands and local don'ts.

## Rules

1. **Throwaway vs production.** A low blast-radius prototype can stay a black box. Production agent code needs a higher bar than typical human-written code — especially money, auth, and user data.
2. **Outcome and constraints first.** Agree what done looks like, what must not be touched, and whether to refactor or reuse. Then let the agent work. Reject a bad change before it becomes a PR.
3. **Give the agent a way to check its work.** Put exact build, test, and lint commands in project rules. Turn repeated review rejects into skills — verify, e2e, schema checks. Run those before opening a PR.
4. **Your job is design and the bar.** Blast radius decides how much you read. Guardrails compound: lint, tests, e2e, review, security checks, refactor routines.
5. **When the agent misses, encode the lesson.** Do not only fix by hand. Write the correction into project rules or a skill so the next run improves.
6. **If still below the bar.** Stronger model and higher effort, tighter project rules and skills, more steering, or have the agent pay down debt so the codebase is easier to work in.

## Start small

One check you already run on every PR is enough. Add a skill when the same reject repeats.
