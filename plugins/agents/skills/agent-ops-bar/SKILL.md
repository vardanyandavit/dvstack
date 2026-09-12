---
name: agent-ops-bar
description: Use when starting agent coding, reviewing agent PRs, deciding throwaway vs production quality, or when an agent is doing more work than the task needs. Light by default; scale the bar with blast radius. Global agent habits for any tool (Cursor, Claude Code, cloud agents). Not project-specific verify commands.
---

# Agent ops bar

Optimize for quality and token efficiency. Scale to blast radius. Do not overcomplicate small tasks.

Apply across projects. Per-repo files stay limited to verify commands and local don'ts.

**Default trade:** spend where it changes the result, save where it does not. Narrow and cheap first, escalate on evidence. Effort skipped on a check that would have caught a real failure was never saved — it was borrowed.

## Rules

1. **Match the bar to blast radius.** A low-risk prototype can stay a black box. Production work — especially money, auth, and user data — needs a higher bar than typical human-written code.
2. **Outcome and constraints first.** Agree what done looks like, what must not be touched, and whether to refactor or reuse. Name the files or the area in scope — an unscoped ask makes the agent read half the repo to guess the boundary, and guess it wrong. Then let the agent work. Reject a bad change before it becomes a PR.
3. **One honest verify path.** Prefer a single real check over review swarms. Put exact build, test, and lint commands in project rules. Keep the inner loop narrow — the one spec, the typecheck, the changed package — and save the full suite for before the PR. A check that takes minutes gets skipped, or re-run whole for a one-line change.
4. **Hold design and the bar.** Blast radius decides how much you read, and how much you spend: model, effort, and review depth all scale with it. Do not add process theater.
5. **When the agent misses, encode the lesson.** Do not only fix by hand. Write the correction into a project rule or skill so the next run improves. Keep the always-on rules file short — it is re-read on every turn, so it holds only what applies every time; the detail belongs in a skill that loads when it is relevant.
6. **Do no extra work.** No unasked refactor, no speculative abstraction, no restating a plan already agreed, no summary file nobody asked for. Ship the change and the evidence it works. Volume is not thoroughness — it buries the part actually under review.
7. **If still below the bar.** Stronger model and higher effort, tighter project rules and skills, more steering, or have the agent pay down debt so the codebase is easier to work in. Skip multi-agent bakeoffs unless the work is large or contested.

## Default mode

Small fix → small prompt → one verify → done.
