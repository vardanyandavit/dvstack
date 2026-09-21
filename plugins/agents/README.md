# DVstack Agents

Light-by-default agent habits that apply across projects and tools. Orientation in an unfamiliar repo; quality bar scaled to blast radius; finding and running the project's honest check; session token hygiene; a short when-to-deepen check; a portable trust ladder (fix at the highest lasting layer, scale only after verified work); coding rules for any change; a thin dvstack-mode conductor that applies that bar and routes to domain skills; plus a marketplace router and three short self-checks.

This plugin stays light. It does not own contracts, tool gates, feature maps, CI architecture, memory kinds, or recovery loops — those live in `dvstack-harness`.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [using-dvstack](skills/using-dvstack/) | Which DVstack plugin or skill applies; prefer the narrowest; slash command = force-load | "which skill should I use" / "we have DVstack installed" |
| [repo-recon](skills/repo-recon/) | Bounded orientation before the first edit: stack and package manager from the lockfile, verify commands, enforced conventions, files in scope, blast radius — then a short recon note | "I've never seen this repo" / "start on this codebase" |
| [agent-ops-bar](skills/agent-ops-bar/) | Quality bar: throwaway vs production, outcome and constraints, one honest verify command, encode misses, no extra work | "review this agent PR" / "is this production quality" / "this is doing more than I asked" |
| [verify-loop](skills/verify-loop/) | Find the real build/test/lint command from lockfile, scripts, and CI; scope it to the change; widen before the PR; report the actual output; what to do when no check exists | "does it actually work" / "what should I run" |
| [agent-session](skills/agent-session/) | Context budget, model choice, quiet logs, clear between tasks, side agents that return conclusions | "this session is bloated" / "clear between tasks" / "keep the thread cheap" |
| [agent-rigor](skills/agent-rigor/) | When to deepen only: restate, demand evidence, escalate model or effort, time-boxed exploration | "this ask is ambiguous" / "blast radius is high — deepen" |
| [anti-rationalization](skills/anti-rationalization/) | Excuse vs reality: skip verify, "looks right", scope creep, APIs from memory | "don't skip the check" / "this looks right" |
| [doubt-check](skills/doubt-check/) | One self-adversarial pass on a non-trivial decision; flag self-check vs independent review | "I'm unsure about this boundary" |
| [source-check](skills/source-check/) | Installed version + official docs for framework code; cite URLs; flag UNVERIFIED | "confirm this Playwright API" |
| [agent-trust-stack](skills/agent-trust-stack/) | Portable trust ladder: fix at the highest lasting layer, scale agents only after one verified agent, easy path is the right path | "where should this fix live" / "safe to add more agents?" |
| [coding-rules](skills/coding-rules/) | Rules for code you write or change: intent, correctness that cannot be bypassed, data, effects, loud failure, tests of behavior, owned outcome. Contested trade-offs stay judgment calls | "follow the coding rules" / `/dvstack-agents:code` |
| [dvstack-mode](skills/dvstack-mode/) | Sticky conductor: global bar (including coding rules), then route to domain skills. Playbooks: feature, bugfix, rewrite, review, harden, investigate | "work in dvstack mode" / `/dvstack-agents:mode` |

## Commands

Claude Code: `/dvstack-agents:dvstack`, `/dvstack-agents:recon`, `/dvstack-agents:ops-bar`, `/dvstack-agents:verify`, `/dvstack-agents:session`, `/dvstack-agents:rigor`, `/dvstack-agents:no-excuses`, `/dvstack-agents:doubt`, `/dvstack-agents:sources`, `/dvstack-agents:trust`, `/dvstack-agents:code`, `/dvstack-agents:mode` (see `/help`). Cursor and other tools: invoke the skill name. See [using commands](../../docs/using-commands.md).

**Typical order on a new task:** `repo-recon` (orient) → `agent-ops-bar` (set the bar) → `coding-rules` (what the code must be) → work → `verify-loop` (prove it). `dvstack-mode` loads that sequence for you. `agent-rigor` when the ask is ambiguous or the blast radius is high; `agent-session` throughout.

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
