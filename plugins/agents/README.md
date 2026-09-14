# DVstack Agents

Light-by-default agent habits that apply across projects and tools. Quality bar scaled to blast radius; session token hygiene; a short when-to-deepen check; plus a marketplace router and three short self-checks.

This plugin stays light. It does not own contracts, tool gates, feature maps, CI architecture, memory kinds, or recovery loops — those live in `dvstack-harness`.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [using-dvstack](skills/using-dvstack/) | Which DVstack plugin or skill applies; prefer the narrowest; slash command = force-load | "which skill should I use" / "we have DVstack installed" |
| [agent-ops-bar](skills/agent-ops-bar/) | Quality bar: throwaway vs production, outcome and constraints, one honest verify command, encode misses, no extra work | "review this agent PR" / "is this production quality" / "this is doing more than I asked" |
| [agent-session](skills/agent-session/) | Context budget, model choice, quiet logs, clear between tasks, side agents that return conclusions | "this session is bloated" / "clear between tasks" / "keep the thread cheap" |
| [agent-rigor](skills/agent-rigor/) | When to deepen only: restate, demand evidence, escalate model or effort, time-boxed exploration | "this ask is ambiguous" / "blast radius is high — deepen" |
| [anti-rationalization](skills/anti-rationalization/) | Excuse vs reality: skip verify, "looks right", scope creep, APIs from memory | "don't skip the check" / "this looks right" |
| [doubt-check](skills/doubt-check/) | One self-adversarial pass on a non-trivial decision; flag self-check vs independent review | "I'm unsure about this boundary" |
| [source-check](skills/source-check/) | Installed version + official docs for framework code; cite URLs; flag UNVERIFIED | "confirm this Playwright API" |

## Commands

Claude Code: `/dvstack-agents:using-dvstack`, `/dvstack-agents:ops-bar`, `/dvstack-agents:session`, `/dvstack-agents:rigor`, `/dvstack-agents:anti-rationalization`, `/dvstack-agents:doubt-check`, `/dvstack-agents:source-check` (see `/help`). Cursor and other tools: invoke the skill name. See [using commands](../../docs/using-commands.md).

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
