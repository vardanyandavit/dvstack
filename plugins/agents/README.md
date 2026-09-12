# DVstack Agents

Global agent-ops habits that apply across projects and tools. Per-repo files stay limited to verify commands and local don'ts.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [agent-ops-bar](skills/agent-ops-bar/) | Throwaway vs production bar, outcome-first steering, verify loops, encoding misses into skills | "review this agent PR" / "is this production quality" |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
