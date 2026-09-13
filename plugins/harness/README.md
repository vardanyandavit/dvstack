# DVstack Harness

The system around the model: task contracts, tool gates, verify/recover, durable state, and change receipts.

`dvstack-agents` holds light session, ops, and rigor habits. This plugin is the harness — keep them distinct.

Light by default. Scale with blast radius. Skip for short low-risk tasks.

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
