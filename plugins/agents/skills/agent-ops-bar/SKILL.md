---
name: agent-ops-bar
description: Use when starting agent coding, reviewing agent PRs, deciding throwaway vs production quality, or when an agent is doing more work than the task needs. Light by default; scale the bar with blast radius. Global agent habits for any tool (Cursor, Claude Code, cloud agents). Not project-specific verify commands.
---

# Agent ops bar

Optimize for quality and token efficiency. Scale to blast radius. Do not overcomplicate small tasks.

Apply across projects. Per-repo files stay limited to one honest verify command and local don'ts.

**Default trade:** spend where it changes the result, save where it does not. Narrow and cheap first, escalate on evidence. Effort skipped on a check that would have caught a real failure was never saved — it was borrowed.

## Rules

1. **Match the bar to blast radius.** A low-risk prototype can stay a black box. Production work — especially money, auth, and user data — needs a higher bar than typical human-written code.
2. **Outcome and constraints first.** Agree what done looks like, what must not be touched, and whether to refactor or reuse. Name the files or the area in scope. Then let the agent work. Reject a bad change before it becomes a PR. In an unfamiliar repo, orient first — `repo-recon`.
3. **One honest verify command.** Prefer a single real check over review swarms. Put the exact build, test, or lint command in project rules. Keep the inner loop narrow; save the full suite for before the PR. A check that takes minutes gets skipped, or re-run whole for a one-line change. Finding and scoping that command is `verify-loop`.
4. **Hold design and the bar.** Blast radius decides how much you read, and how much you spend. Do not add process theater.
5. **When the agent misses, encode the lesson.** Write the correction into a project rule or skill so the next run improves. Keep the always-on rules file short; the detail belongs in a skill that loads when it is relevant.
6. **Do no extra work.** No unasked refactor, no speculative abstraction, no restating a plan already agreed, no summary file nobody asked for. Ship the change and the evidence it works.

## Not this skill

Orienting in an unfamiliar repo: `repo-recon`. Finding and running the check: `verify-loop`. Session budget and quiet logs: `agent-session`. When to deepen: `agent-rigor`. Contracts, tool gates, feature maps, CI, memory, recover: `harness-engineering`.

## Default mode

Small fix → small prompt → one verify → done.

## Verification

- [ ] Done, constraints, and files in scope were agreed before editing
- [ ] Bar matched the blast radius — not more process, not less
- [ ] One honest check actually ran, with its real output
- [ ] Scope matches the ask — no unasked refactor, layer, or summary
- [ ] A repeated miss was encoded into a rule or skill, not just fixed
