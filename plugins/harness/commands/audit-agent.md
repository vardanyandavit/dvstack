---
description: Audit an existing agent or harness for uneven safeguards and turn the gaps into tickets and tests
disable-model-invocation: true
---

# Audit an agent system

Load each skill when its step starts (Claude Code: Skill tool, `dvstack-harness:<name>`; do not search the project for `SKILL.md`). If a skill does not load, say so and stop.

1. The `agent-execution-surfaces` skill: map what actually exists in the code, not what the docs claim.
2. The `safeguard-parity` skill: for each protected action, list the routes that reach it and which ones skip the gate.
3. The `agent-tool-design` skill: flag passthrough tools, free-string parameters, missing bounds, and unstructured errors.
4. The `agent-risk-chains` skill: turn each gap into a ticket — trigger → asset → required control → regression test.
5. The `agent-boundary-tests` skill: say which existing tests would still pass if the control were removed.

Deliver findings ordered by blast radius, then the tickets. Do not change code unless asked.
