# DVstack Agents

Global agent-ops habits that apply across projects and tools. Light by default; scale with blast radius; stay token-efficient. Per-repo files stay limited to verify commands and local don'ts.

The three skills share one trade: spend where it changes the result, save where it does not. Saving effort on a check that would have caught a real failure is not a saving.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [agent-ops-bar](skills/agent-ops-bar/) | Throwaway vs production bar, outcome-first steering, scoped asks, narrow verify loops, no unasked extra work, encoding misses into skills | "review this agent PR" / "is this production quality" / "this is doing more than I asked" |
| [agent-rigor](skills/agent-rigor/) | Cheapest conclusive proof, agent-friendly harness, live verification, design exploration, parallel isolation | "verify this live" / "explore designs before committing" |
| [agent-session](skills/agent-session/) | Context budget, model choice, quiet logs, clear between tasks, side agents that return conclusions | "this session is bloated" / "clear between tasks" / "keep the thread cheap" |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
