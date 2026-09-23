# DVstack Harness

The system around the model: task contracts, compiled context, tool gateway, permissions, durable state, feature maps, hard CI, verify-to-reject, recover, and change receipts — plus QA for agent bounds (execution surfaces, tool design, safeguard parity, boundary tests, risk-chain tickets).

## When to skip

Short, low-risk tasks. One-file tweaks with no host-mutating tools, secrets, MCP, browser, or durable agent state.

`harness-engineering` is the umbrella. Use a narrower skill when the task is only a surface map, a tool definition, a parity check, boundary tests, risk-chain tickets, or loop cost.

**Bound-action pipeline:** `agent-execution-surfaces` (what channels exist) → `agent-tool-design` (what each tool can do) → `safeguard-parity` (same gate on every door) → `agent-boundary-tests` (prove it) → `agent-risk-chains` (file the tickets).

## Skills

| Skill | What it does | When to use | Ask for it with |
|---|---|---|---|
| [harness-engineering](skills/harness-engineering/) | Task contracts with `done_when`/`escalate_when`, compiled context, feature map, hard gates, permission ladder, four memory kinds, verify/recover, change receipts | Building or tightening the system around coding agents | "tighten this agent harness" / "this run has side effects" |
| [agent-execution-surfaces](skills/agent-execution-surfaces/) | Inventory every invoke/action channel; which reach shell, files, network, secrets, browser, MCP, subagents; overlapping routes; short surface map | Designing or reviewing tool-using agents | "map the execution surfaces" |
| [agent-tool-design](skills/agent-tool-design/) | The gateway's shape: one authority per tool, narrow typed parameters, no passthrough, structured errors that teach recovery, idempotency, dry-run, explicit bounds | Defining or reviewing an agent's tools, MCP server, or plugin surface | "design these agent tools" |
| [safeguard-parity](skills/safeguard-parity/) | Same control class on every equivalent route to the same protected action (CLI vs API vs headless vs MCP vs hooks) | Gates exist but may be uneven across doors | "check safeguard parity" |
| [agent-boundary-tests](skills/agent-boundary-tests/) | Failure-oriented bounds tests: remove approval/sandbox/redaction/domain-scope → must fail; untrusted-context and multi-step tool paths | Proving claimed gates actually hold | "add boundary tests" |
| [agent-risk-chains](skills/agent-risk-chains/) | Eight chain templates into tickets: trigger → asset → required control → regression | Threat modeling or writing QA tickets | "turn risk chains into tickets" |
| [token-efficient-coding-loops](skills/token-efficient-coding-loops/) | Stable prefix and append-only tail, skeleton reads, sandbox format before a model turn, lazy tool discovery, workhorse vs frontier routing, effort before a model change, slim always-on instructions, session usage | Designing or reviewing a multi-turn coding loop or tool loading that burns tokens | "keep this coding loop cheap" |

## Commands

Type one command, then the task. The case list, including which skills each command loads, is in the [repository README](../../README.md#which-command).

| Case | Cursor | Claude Code |
|---|---|---|
| Design a new tool-using agent | `/design-agent` | `/dvstack-harness:design-agent` |
| Audit an agent that already exists | `/audit-agent` | `/dvstack-harness:audit-agent` |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-harness@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-harness`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#without-the-plugin).
