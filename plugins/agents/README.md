# DVstack Agents

One skill. Run it after `/init`.

`/init` reads the project and writes `AGENTS.md` or `CLAUDE.md`. `/agent-rules` does not do that. It appends one block of global rules agents skip, and only the sections this repo needs. A web app gets the accessible-name line. A repo that already has Playwright, Cypress, or Selenium gets the e2e lines. A game does not get either.

If you paste extra rules in the same message, it keeps the ones this repo uses and drops the rest. Those go under `## Project`. Re-running replaces the marked block and leaves that section.

No instruction file yet: it stops. It does not create one.

| Skill | What it does |
|---|---|
| [agent-rules](skills/agent-rules/) | Copy the matching sections from `files/global-rules.md` into each existing instruction file |

## Call

| Cursor | Claude Code |
|---|---|
| `/agent-rules` | `/dvstack-agents:agent-rules` |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.
