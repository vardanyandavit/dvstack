# DVstack Agents

Global agent-ops habits that apply across projects and tools. Light by default; scale with blast radius; stay token-efficient. Per-repo files stay limited to verify commands and local don'ts.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [agent-ops-bar](skills/agent-ops-bar/) | Quality + token efficiency: match the bar to blast radius, outcome-first steering, one verify path | "review this agent PR" / "is this production quality" |
| [agent-rigor](skills/agent-rigor/) | Cheap proof defaults; extra cost only when risk or ambiguity is high | "verify this live" / "explore designs before committing" |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
