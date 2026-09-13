# DVstack Agents

Light-by-default agent habits that apply across projects and tools. Quality bar scaled to blast radius; session token hygiene; a short when-to-deepen check.

This plugin stays light. It does not own contracts, tool gates, feature maps, CI architecture, memory kinds, or recovery loops — those live in `dvstack-harness`.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [agent-ops-bar](skills/agent-ops-bar/) | Quality bar: throwaway vs production, outcome and constraints, one honest verify command, encode misses, no extra work | "review this agent PR" / "is this production quality" / "this is doing more than I asked" |
| [agent-session](skills/agent-session/) | Context budget, model choice, quiet logs, clear between tasks, side agents that return conclusions | "this session is bloated" / "clear between tasks" / "keep the thread cheap" |
| [agent-rigor](skills/agent-rigor/) | When to deepen only: restate, demand evidence, escalate model or effort, time-boxed exploration | "this ask is ambiguous" / "blast radius is high — deepen" |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
