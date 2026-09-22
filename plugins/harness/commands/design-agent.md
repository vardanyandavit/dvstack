---
description: Design a new tool-using agent or harness with bounded tools, gates on every route, and failure-proving tests
disable-model-invocation: true
---

# Design an agent system

Load each skill when its step starts (Claude Code: Skill tool, `dvstack-harness:<name>`; do not search the project for `SKILL.md`). If a skill does not load, say so and stop.

1. The `agent-execution-surfaces` skill: the surface map — every channel, and what each one reaches.
2. The `agent-tool-design` skill: the tool list, with one authority, typed parameters, bounds, and dry-run for destructive calls.
3. The `harness-engineering` skill: the task contract, permission ladder, verify/recover loop, and durable state.
4. The `safeguard-parity` skill: the same control class on every route to each protected action.
5. The `agent-boundary-tests` skill: tests that fail when a control is removed, including an untrusted-context case.
6. Multi-turn loop, or a large tool set → the `token-efficient-coding-loops` skill.

Deliver one short design doc: the surface map, the tools table, the gates per route, and the boundary tests. Write code only after the user accepts it.
