---
name: agent-session
description: Use when setting up or cleaning agent sessions for token efficiency: context budget, model choice, quiet logs, clear between tasks, side agents. Light defaults.
---

# Agent session

Keep the thread cheap. Spend tokens on the asked task, not leftover context.

**Default trade:** a turn is more than the user prompt. System, tools, memory, and project files all cost context. Light by default.

## Rules

1. **Count the whole turn.** The user prompt is only part of the bill. System, tools, memory, and project files all cost context.
2. **Don't default to the biggest model.** Reserve it for hard or high-risk work. Mechanical edits can use a cheaper model. When a miss happens, ask whether it was not enough knowledge or not enough effort.
3. **Point at known files.** Name the path so the agent does not burn discovery reads.
4. **Always-on rules stay tiny.** Task-specific playbooks live in on-demand skills. Re-audit old instructions that no longer earn their keep.
5. **Drop unused tools.** Unused connectors still cost context. Prefer an existing CLI when it is enough.
6. **Quiet logs.** Noisy output that stays in the thread is re-sent every turn. Failures-only, or a short side-agent summary.
7. **New task, fresh context.** Clear or compact between unrelated jobs. Summarize before a long break if you will resume.
8. **Keep the request prefix stable.** When the provider caches, avoid needless mid-session model flips. Summarize before switching.
9. **Side agents return conclusions.** They keep the main thread small. Not a default swarm.
10. **Efficient is not fewer tokens.** Tokens should go to the asked task.

## Do not by default

Max model or max effort on a tiny edit. One mega-session all day. Dumping full test logs. Spawning swarms for a simple fix.

## Not this skill

Quality bar: `agent-ops-bar`. Bounded orientation instead of a whole-repo read: `repo-recon`. Contracts, tool gates, verify/recover: `harness-engineering`.

## Start small

Clear between tasks. Attach known files. Keep the project rules file short.

## Verification

- [ ] Model and effort matched the task, not defaulted to the biggest
- [ ] Known files pointed at by path instead of discovered by search
- [ ] Logs summarised, not dumped into the thread
- [ ] Context cleared or compacted between unrelated tasks
- [ ] Tokens went to the asked task
