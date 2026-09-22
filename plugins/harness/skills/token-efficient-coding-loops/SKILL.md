---
name: token-efficient-coding-loops
description: Design or review coding-agent harnesses and multi-turn fix loops that burn tokens — loop cost, context shape, MCP tool loading, model routing.
---

# Token-efficient coding loops

Keep a multi-turn coding trajectory cheap. The harness decides what stays pinned, what gets loaded, and which model runs the turn.

Task contracts, tool gates, and verify/recover stay in `harness-engineering`. This skill owns **loop cost / context / routing**.

## When to use

Designing or reviewing a coding-agent harness, a multi-turn PR or fix loop, or tool loading that puts schemas and file dumps in the prompt.

Skip for one short edit with no loop and no tool catalog.

## Rules

1. **Stable prefix, append-only tail.** Keep system instructions and repo conventions invariant across turns so a prefix cache can hit. Put timestamps, turn counters, commit hashes, and live tool output only in the append-only tail. Never mutate early tokens mid-run. When context is full, prune older intermediate tool outputs from the tail (reverse compaction), not the pinned prefix.
2. **Skeleton observations before full files.** Prefer an outline read — signatures, types, exports, docstrings — over dumping a whole file. Load a full line range only when editing that span.
3. **Deterministic sandbox before the model.** Intercept edits with formatters, linters, and typechecks in a sandbox when those can fix the issue. Do not spend a frontier-model turn on indentation, unused imports, or a pure format fix.
4. **Lazy tool discovery.** Do not dump every tool schema on turn 0. Progressive: search tools (names and one-liners) → describe only the tools about to be used → execute with a projected, filtered response. Aggregate in the sandbox — filter and summarize in a script, print short stdout — instead of stuffing large JSON into the model.
5. **Workhorse vs frontier routing.** Default a cheap, fast model for mechanical turns (file slices, test runs, routine diffs). Escalate to a frontier model only on a deterministic trigger: initial planning or decomposition; the same gate failing more than 3 times on one file; a public API signature or AST change; structured-output or schema validation failure. Stay escalated until the gates pass. Cap escalations. Downshift when the budget is tight. Circuit-break a cycle that repeats the same failure with no new fact.

## Do not

- Rewrite the pinned prefix to refresh a run, or compact by summarizing system instructions or repo conventions.
- Paste a whole file when an outline answers the question.
- Send a format, import, or type fix the sandbox can make to the frontier model.
- Load the full tool catalog, or raw tool JSON, into the model on turn 0.
- Route every turn to the frontier model, or escalate without a trigger, a cap, and a way back down.

## Related

Umbrella: `harness-engineering`. Tool shape: `agent-tool-design`.

## Verification

- [ ] The prefix (system instructions, repo conventions) is unchanged across turns
- [ ] Timestamps, counters, hashes, and tool output sit only in the tail
- [ ] A full-context prune drops older tail outputs, not the prefix
- [ ] A full file range loads only for a span being edited
- [ ] A format, lint, or type fix the sandbox can make does not take a model turn
- [ ] Tools load as search → describe the next tool → filtered result
- [ ] Frontier use is trigger-based, sticky until gates pass, capped, and circuit-broken
