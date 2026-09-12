---
name: agent-rigor
description: Use when doing nontrivial agent work that needs verification, design exploration, parallel agents, or a better harness. Global rules for proving work with any coding agent. Complements agent-ops-bar; does not replace it.
---

# Agent rigor

Global rules for rigorous work with any coding agent.

## Rules

1. **Define proof up front.** Observable outcomes, constraints, and how you will know it works — before implementation.
2. **Prime with real context.** Relevant code, history, user flows, assumptions, and prior decisions. Vague goals alone are not enough.
3. **Restate before editing.** On ambiguous asks, have the agent restate the problem in plain language before changing anything.
4. **Demand evidence.** Mechanism, rationale, tradeoffs, and supporting evidence — not unsupported confidence.
5. **Build an agent-friendly harness.** Composable commands, dry runs, progressive disclosure, actionable errors, rich help, machine-readable output. Prefer reproducible tools over one-off scripts and prose-only instructions.
6. **Keep the environment reproducible.** Data, auth, test users, and external-service access should be repeatable for agents.
7. **Verify live behavior.** Inspect and measure the real application. Keep concrete evidence. Do not stop at “tests passed” or the agent’s claim alone.
8. **Explore before committing.** Use throwaway prototypes and measurements to compare designs. Do not accept the first design or replace evidence with an elaborate abstract plan.
9. **Ground architecture.** Ownership, constraints, history, and failure modes. For major changes: independent designs, cross-review, then synthesize. Restart when implementation evidence shows the architecture is wrong.
10. **Smell workarounds.** Repeated escape hatches, forced casts, and recurring patches mean reconsider the design.
11. **Ship in small increments.** Self-contained steps, each independently verifiable.
12. **Isolate parallel work.** Separate reproducible environments; do not share mutable state across parallel agents.
13. **Keep a compact map.** Features, user paths, controls, known caveats — searchable and maintained.
14. **Automate after the loop works.** Recurring diagnostics and reproductions only once verification is trustworthy.

## Start small

One real verify path for the app you ship is enough. Add harness commands and maps when the same friction repeats.
