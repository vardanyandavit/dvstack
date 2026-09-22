---
name: agent-risk-chains
description: Threat-model a tool-using agent as tickets: trigger → asset → required control → regression, from eight chain templates. Use after a surface map.
---

# Agent risk chains

Risk is a chain, not a single bug. Turn templates into tickets. Do not leave them as wiki fears.

**Ticket shape:** trigger → asset → required control → regression.

Regression = the test that fails if the control is gone (`agent-boundary-tests`).

## When to use

Threat modeling or writing QA tickets for tool-using agents. After `agent-execution-surfaces`. Use with `safeguard-parity` so the control is named by action, not by UI.

## How

For each applicable template, file one ticket with the four fields. Skip a template only with evidence that surface is absent (from the map).

## Templates

1. **Secret → tool** — key/token lands in tool args, logs, or subprocess env.
2. **Workspace → persistent state** — a task write becomes lasting settings or secrets.
3. **Extension → authority** — MCP/plugin adds tools that inherit local power.
4. **Mode switch → privilege** — gated in chat, open in auto / API / batch.
5. **Runtime code** — loaded plugin or snippet after review of the “main” app.
6. **Model → process** — model picks a host-mutating command.
7. **Session → action** — browser cookies/storage influence a later step.
8. **Untrusted context → action** — page / file / MCP output steers a later privileged call.

## Ticket fields

| Field | Fill |
|---|---|
| Trigger | Who/what starts it (prompt, hook, MCP output, mode switch) |
| Asset | Secret, host, workspace, session, extra authority |
| Required control | Class + which routes (every equivalent door) |
| Regression | Remove-and-fail test; untrusted-context or multi-step if the chain needs it |

## Do not

- Leave chains as wiki fears with no ticket
- File “security” without a protected action and a regression
- Model only the chat UI path
- Skip mode-switch or untrusted-context by default

## Related

Surfaces: `agent-execution-surfaces`. Parity: `safeguard-parity`. Tests: `agent-boundary-tests`. Umbrella: `harness-engineering`.

## Verification

- [ ] Applicable templates turned into tickets (or proven N/A)
- [ ] Each ticket has trigger, asset, control, regression
- [ ] Mode-switch and untrusted-context not skipped by default
- [ ] Tickets point at routes from the surface map
