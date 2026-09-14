---
name: doubt-check
description: Use for non-trivial decisions (branching logic, module boundaries, high blast radius, unfamiliar code) when you need a short self-adversarial pass. Not for renames, formatting, one-liners, or when the user asked for speed. Lightweight; not a multi-model bakeoff.
---

# Doubt check

One honest pass against your own claim. Do not grind. Do not spawn a review swarm by default.

## When

Non-trivial decisions: branching logic, module boundaries, irreversible or high blast-radius work, unfamiliar code.

## When not

Renames, formatting, clear one-liners, or the user asked for speed.

## Process

1. **CLAIM** (2–3 lines). What you believe is true, and why — files, behavior, or tradeoff.
2. **Self-adversarial checklist.** Unstated assumptions. Edge cases. Contract or API breaks. What would make this wrong.
3. **Second pair of eyes.** If stakes are high **and** a second agent or reviewer is available, ask the user before spawning. Otherwise do an honest self-doubt pass and **flag it as a self-check** (not independent review).

## Bound

One solid pass. If you are still unsure, escalate (ask the user, or use `agent-rigor`) — do not loop.

## Not this skill

Default quality bar: `agent-ops-bar`. Deepen/escalate: `agent-rigor`. Harness recover loops: `harness-engineering`.

## Verification

- [ ] CLAIM written in 2–3 lines before editing further
- [ ] At least one assumption, edge case, or contract risk was considered
- [ ] Did not spawn extra agents unless the user agreed
- [ ] Residual doubt is flagged as self-check, not hidden
