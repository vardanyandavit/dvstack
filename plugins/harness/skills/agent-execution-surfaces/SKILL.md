---
name: agent-execution-surfaces
description: Map every channel a tool-using agent can act through (CLI, API, UI, browser, FS, shell, MCP, plugins, subagents) and what each reaches. First step when designing or reviewing an agent.
---

# Agent execution surfaces

Inventory every channel that can invoke the agent or perform an action. Quality is **bounded action**, not a green unit-test count.

## When to use

Designing or reviewing tool-using agents — especially before adding tools, MCP, plugins, headless/API entrypoints, or subagents.

Skip for short low-risk tasks with no tools that can mutate host, files, network, or secrets.

## How

1. List **invoke** channels: CLI, API, UI/chat, headless/batch, hooks, scheduler, browser, MCP server/client, plugin host, subagent spawn.
2. For each, mark **reach**: shell, filesystem, network/outbound API, secrets/env, browser session, MCP/plugin tools, other agents.
3. Mark **overlap**: two channels that can take the same privileged action (same shell, same write, same secret, same origin).
4. Produce a short **surface map**. Missing evidence = assume the path exists until proven closed.

## Surface map

| Surface | Invoke via | Reaches | Same authority as | Control today |
|---|---|---|---|---|
| (fill) | CLI / API / UI / headless / hook / MCP / plugin / subagent | shell / FS / net / secrets / browser / MCP / agents | (overlapping route or —) | approval / sandbox / policy / none / unknown |

Minimum rows unless proven absent: CLI, API or headless, any MCP/plugin, any browser, any subagent, any hook/scheduler.

## Cases

- Chat-approved shell vs API/hook that runs the same command
- MCP/plugin tool that inherits host FS or network with no new gate
- Browser that reuses cookies or hits extra origins
- Subagent that inherits parent tools
- Headless/batch path that skips the interactive approval UI

## Do not

- Inventory only the happy UI/chat path
- Treat “we have a sandbox” as a surface map
- Skip MCP, hooks, or headless because they are “internal”
- Merge this into `dvstack-agents` (habits stay there; this is harness)

## Related

Umbrella: `harness-engineering`. Next: `safeguard-parity`, then `agent-boundary-tests`, `agent-risk-chains`.

## Verification

- [ ] Every invoke channel listed or proven absent
- [ ] Shell / FS / network / secrets / browser / MCP / subagent reach marked
- [ ] Overlapping routes to the same authority named
- [ ] Short surface map produced for this task
