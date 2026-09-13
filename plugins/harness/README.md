# DVstack Harness

The system around the model: task contracts, compiled context, tool gateway, permissions, durable state, feature maps, hard CI, verify-to-reject, recover, and change receipts.

`dvstack-agents` holds light habits (ops-bar, session, rigor). This plugin is the heavy system — point to agent-ops-bar for the quality bar and agent-session for token hygiene instead of duplicating them here.

Skip for short low-risk tasks.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [harness-engineering](skills/harness-engineering/) | Task contracts with `done_when`/`escalate_when`, compiled context, feature map, hard gates, permission ladder, four memory kinds, verify/recover, change receipts | "tighten this agent harness" / "this run has side effects" |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-harness@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-harness`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
