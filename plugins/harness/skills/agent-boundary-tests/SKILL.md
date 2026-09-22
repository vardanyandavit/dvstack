---
name: agent-boundary-tests
description: Prove agent safeguards hold with failure-oriented tests — remove the approval/sandbox/redaction/scope and the test must fail; include an untrusted-context case and a multi-step sequence that cannot skip the gate.
---

# Agent boundary tests

Prove the bounds. A safeguard in config is not a safeguard under test. Feature and component tests are not enough.

## When to use

You claim approvals, sandbox, redaction, or domain scope — or the agent reads untrusted web/files/MCP and then calls tools. After surfaces and parity are named.

## How

Write tests that **go red if the control is removed**. Hit a real invoke route (CLI, API, headless), not only an isolated helper.

1. **Remove-and-fail.** Strip approval / sandbox / redaction / domain-scope (or equivalent) → the privileged action must not be allowed to pass the suite. If removing the control still leaves tests green, you were not testing the bound.
2. **Untrusted context.** If the agent reads web, files, email, or MCP output: ≥1 case where that content tries to steer a later privileged call and the gate still holds.
3. **Multi-step.** ≥1 tool sequence that cannot skip the gate by splitting work (read/plan/benign tool → privileged tool). The second step is still gated.

Prefer the real product surface over a mocked component that never reaches the gateway.

## Cases

- Approval removed → shell / file write / outbound call still blocked (suite detects the hole)
- Sandbox removed → out-of-workspace write is no longer stopped → test fails
- Redaction removed → secret appears in args or logs → test fails
- Domain-scope removed → extra origin succeeds → test fails
- Untrusted page/file/MCP text that instructs a privileged tool → denied or sandboxed
- Two-step: summarize untrusted input, then “apply the instructions” → privileged step still gated

## Do not

- Ship only happy-path feature/component tests
- Equate an eval score or “the model usually refuses” with a boundary test
- Skip untrusted-context because it is rare in current suites
- Treat a unit test of a policy helper as covering CLI + API + MCP
- Write exploit payloads for systems you do not own; stay on engineering QA of *your* gates

## Related

Surfaces: `agent-execution-surfaces`. Parity: `safeguard-parity`. Tickets: `agent-risk-chains`. Umbrella: `harness-engineering`.

## Verification

- [ ] ≥1 remove-and-fail test per control class you claim
- [ ] ≥1 untrusted-context case when the agent reads web / files / MCP
- [ ] ≥1 multi-step tool sequence that cannot skip the gate
- [ ] Tests hit a real invoke route, not only an isolated helper
