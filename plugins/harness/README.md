# DVstack Harness

The system around the model: task contracts, compiled context, tool gateway, permissions, durable state, feature maps, hard CI, verify-to-reject, recover, and change receipts — plus QA for agent bounds (execution surfaces, safeguard parity, boundary tests, risk-chain tickets).

`dvstack-agents` holds light habits (ops-bar, session, rigor). This plugin is the heavy system. Point to agent-ops-bar for the quality bar and agent-session for token hygiene instead of duplicating them here. Do not merge the plugins.

**Ladder:** ops-bar (quality bar) → session (token hygiene) → rigor (when to deepen) → harness (system around the agent). Harness owns contracts, tools, verify, recover, and bound-action QA; agents stay light habits.

## When to skip

Short, low-risk tasks. One-file tweaks with no host-mutating tools, secrets, MCP, browser, or durable agent state. Use `dvstack-agents` for the quality bar and session hygiene.

`harness-engineering` is the umbrella. Use a narrower skill when the task is only a surface map, parity check, boundary tests, or risk-chain tickets.

## Skills

| Skill | What it does | When to use | Ask for it with |
|---|---|---|---|
| [harness-engineering](skills/harness-engineering/) | Task contracts with `done_when`/`escalate_when`, compiled context, feature map, hard gates, permission ladder, four memory kinds, verify/recover, change receipts | Building or tightening the system around coding agents | "tighten this agent harness" / "this run has side effects" |
| [agent-execution-surfaces](skills/agent-execution-surfaces/) | Inventory every invoke/action channel; which reach shell, files, network, secrets, browser, MCP, subagents; overlapping routes; short surface map | Designing or reviewing tool-using agents | "map the execution surfaces" / `/execution-surfaces` |
| [safeguard-parity](skills/safeguard-parity/) | Same control class on every equivalent route to the same protected action (CLI vs API vs headless vs MCP vs hooks) | Gates exist but may be uneven across doors | "check safeguard parity" / `/safeguard-parity` |
| [agent-boundary-tests](skills/agent-boundary-tests/) | Failure-oriented bounds tests: remove approval/sandbox/redaction/domain-scope → must fail; untrusted-context and multi-step tool paths | Proving claimed gates actually hold | "add boundary tests" / `/boundary-tests` |
| [agent-risk-chains](skills/agent-risk-chains/) | Eight chain templates into tickets: trigger → asset → required control → regression | Threat modeling or writing QA tickets | "turn risk chains into tickets" / `/risk-chains` |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-harness@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-harness`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).

## Commands

Claude Code, after install:

- `/dvstack-harness:harness` — force `harness-engineering`
- `/dvstack-harness:execution-surfaces` — force `agent-execution-surfaces`
- `/dvstack-harness:safeguard-parity` — force `safeguard-parity`
- `/dvstack-harness:boundary-tests` — force `agent-boundary-tests`
- `/dvstack-harness:risk-chains` — force `agent-risk-chains`

Cursor: invoke the skill name. See [using commands](../../docs/using-commands.md).
