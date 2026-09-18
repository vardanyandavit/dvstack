---
name: safeguard-parity
description: Use when safeguards exist (approval, sandbox, policy, redaction, domain scope) but may be uneven. For each protected action or asset, require the same control class on every equivalent route (CLI vs API vs headless vs MCP vs hooks). Skip if there are no gates yet — inventory surfaces first.
---

# Safeguard parity

**Same power, same control class, every door.** Policy is by protected action/asset, not by UI.

A prompt “don’t” is not a control class. Hard gates live outside the model.

## When to use

Gates exist but CLI vs API vs headless vs MCP vs hooks may not share them. After a surface map (`agent-execution-surfaces`).

## How

1. Name the **protected action or asset**: shell, secret, out-of-workspace write, deploy/delete, browser origin, MCP/plugin add, host process.
2. Name the **control class** required: approval, sandbox, policy, redaction, domain/allowlist. Combine when the action needs both (e.g. shell → approval + sandbox).
3. Enumerate **routes** that can perform that action (from the surface map).
4. For each route: same class, weaker, or missing. Missing or weaker = defect.
5. “Shell needs approval + sandbox” means CLI **and** API **and** MCP **and** hooks — not only the interactive chat.

## Cases

- Interactive CLI asks; API / headless / MCP / hook does not
- Redaction in app logs but not in tool-arg traces or subprocess env
- Domain allowlist on the browser tool, not on a fetch or MCP HTTP tool
- Write sandbox in the agent loop, not in a plugin or subagent
- Chat mode gated; auto / batch / CI runner open

## Do not

- Count “a safeguard exists somewhere” as parity
- Accept prompt-only restrictions as the gate
- Fix one door and leave the others
- Confuse this with test coverage — that is `agent-boundary-tests`

## Related

Surfaces: `agent-execution-surfaces`. Tests: `agent-boundary-tests`. Tickets: `agent-risk-chains`. Umbrella: `harness-engineering`.

## Verification

- [ ] Protected actions/assets named
- [ ] Required control class named per action
- [ ] Every equivalent route checked
- [ ] Uneven or missing class filed as a defect, not a note
