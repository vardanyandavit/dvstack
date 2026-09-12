---
name: agent-ops-bar
description: Use when starting agent coding, reviewing agent PRs, or deciding throwaway vs production quality. Light by default; scale the bar with blast radius. Not project-specific verify commands.
---

# Agent ops bar

Optimize for quality and token efficiency. Scale to blast radius. Do not overcomplicate small tasks.

Apply across projects. Per-repo files stay limited to verify commands and local don'ts.

## Rules

1. **Match the bar to blast radius.** A low-risk prototype can stay a black box. Production work — especially money, auth, and user data — needs a higher bar.
2. **Outcome and constraints first.** Agree what done looks like, what must not be touched, and whether to refactor or reuse. Then let the agent work. Reject a bad change before it becomes a PR.
3. **One honest verify path.** Prefer a single real check over review swarms. Put those commands in project rules.
4. **Hold design and the bar.** Blast radius decides how much you read. Do not add process theater.
5. **When the agent misses, encode the lesson.** Write the correction into a project rule or skill so the next run improves.
6. **If still below the bar.** Stronger model and higher effort, or pay down debt. Skip multi-agent bakeoffs unless the work is large or contested.

## Default mode

Small fix → small prompt → one verify → done.
