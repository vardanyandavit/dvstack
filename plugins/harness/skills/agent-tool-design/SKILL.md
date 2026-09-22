---
name: agent-tool-design
description: Define or review the tools an agent is given — one authority per tool, typed narrow parameters, structured recoverable errors, idempotency keys, dry-run before destructive calls, explicit time/size/budget bounds.
---

# Agent tool design

The model picks; the tool decides what is possible. **A capability the tool does not expose cannot be prompted into existence** — which makes the schema a stronger control than any instruction.

`harness-engineering` rule 3 names the gateway. This skill is its shape.

## When to use

Defining or reviewing an agent's tools, an MCP server, or a plugin surface. After `agent-execution-surfaces`, before `agent-boundary-tests`.

Skip for an agent with no tool that mutates host, files, network, or secrets.

## Rules

1. **One authority per tool.** A tool that reads *or* writes depending on a flag has one gate for two powers, and the audit log cannot tell them apart. Split it.
2. **Narrow the parameters, not the prompt.** Enums over free strings, an id over a path, a path under a root over an arbitrary path, an allowlisted host over a URL. Every parameter you widen is a class of action you now have to police at runtime.
3. **No passthrough.** A tool taking a shell string, raw SQL, or arbitrary code is the shell, the database, and the interpreter — named after something narrower. If the agent genuinely needs a command, expose the commands.
4. **Structured errors that teach recovery.** `{ code, message, retryable, next }` — not a stack trace, not prose. The agent's next move is decided by what the error says, so `NOT_FOUND` with the valid ids beats "error: failed". A retry loop is usually a missing `retryable: false`.
5. **Idempotency on anything that mutates.** A caller-supplied key, so a retry after a timeout does not send the message twice. Timeouts happen; the second charge is the bug.
6. **Dry-run before destructive.** Return the diff, the rows, the recipients — then execute on a second call with a token from the first. This is what makes an approval meaningful: the approver sees the effect, not the intent.
7. **Bounds are parameters of the tool, not hopes.** Timeout, output size, page size, row limit, spend cap, max results. An unbounded tool ends a session by filling the context.
8. **Return evidence, not narration.** Ids, statuses, counts, a diff — what a later step or a human can verify. A tool that returns "Done!" has moved the claim into the model's word.
9. **Name the blast radius in the description.** The description is what the model reads when choosing. `send_email` and `send_email_to_customers` get chosen differently, and honestly.
10. **Deny by default.** A new tool starts with no reach it has not been given. Adding a tool is a change to the surface map — go back to `agent-execution-surfaces`.

## Smells

- One `execute` / `run` / `query` tool covering a whole subsystem
- A `path`, `url`, `host`, or `command` parameter with no root, allowlist, or enum
- Errors returned as free text, or as a boolean `success: false`
- A mutating tool with no idempotency key and a client that retries
- Delete, deploy, or send with no preview step
- No timeout, no size cap, no result limit
- A tool whose description undersells what it can reach
- Two tools that differ only in authority, sharing one gate

## Do not

- Put the safety in the description and call it a control — a prompt "don't" is not a gate (`safeguard-parity`).
- Hand a subagent or plugin the parent's whole toolset because it was convenient.
- Widen a schema to fix a model failure. Fix the schema, the error, or the map — `harness-engineering` rule 9.
- Log tool arguments without redaction; args are where secrets land (`agent-risk-chains`, template 1).

## Related

Surfaces: `agent-execution-surfaces`. Gate parity: `safeguard-parity`. Proof: `agent-boundary-tests`. Tickets: `agent-risk-chains`. Umbrella: `harness-engineering`.

## Verification

- [ ] Each tool has exactly one authority
- [ ] No passthrough parameter (shell, SQL, code, arbitrary path or URL)
- [ ] Errors are structured, with a retryable flag and a next step
- [ ] Every mutating tool is idempotent; every destructive one has a dry-run
- [ ] Timeout, size, and result bounds are set per tool
- [ ] Descriptions state the real blast radius
- [ ] New tools were added to the surface map, and their gate was proven by a test
