---
name: agent-rigor
description: Use when agent work needs verification, design exploration, or a better harness. Complements agent-ops-bar. Light by default; add cost only when risk or ambiguity is high.
---

# Agent rigor

Keep standards. Stay cheap by default. Scale with blast radius.

**Default trade:** the cheapest proof that would still catch a real failure. Rigor is how conclusive the check is, not how much it produces.

## Rules

1. **Define proof up front.** Observable outcomes, constraints, and how you will know it works — before implementation. Pick the smallest check that would actually fail if the change were wrong.
2. **Prime with real context.** Relevant code, history, user flows, assumptions, and prior decisions. Relevant means the slice that changes the decision — the code path, the failing output, the prior call and why — not whole files pasted in for safety. Missing context costs a wrong implementation; indiscriminate context buries the part that mattered.
3. **Restate before editing.** On ambiguous asks, have the agent restate the problem in plain language before changing anything. Cheapest possible correction point.
4. **Demand evidence.** Mechanism, rationale, tradeoffs, and supporting evidence — not unsupported confidence. Specific beats long: the one failing request, not the whole log.
5. **Build an agent-friendly harness.** Composable commands, dry runs, progressive disclosure, actionable errors, rich help, machine-readable output. Summary by default with detail on request is what keeps the budget on reasoning instead of scrollback. Prefer reproducible tools over one-off scripts and prose-only instructions.
6. **Keep the environment reproducible.** Data, auth, test users, and external-service access should be repeatable for agents. Every irreproducible setup is paid again on every run.
7. **Verify live behavior.** Inspect and measure the real application. Keep concrete evidence. Do not stop at "tests passed" or the agent's claim alone.
8. **Explore before committing.** Use small, time-boxed throwaway prototypes and measurements to compare designs. Do not accept the first design, and do not replace evidence with an elaborate abstract plan — a long plan is cheaper to write than a prototype and proves less.
9. **Ground architecture.** Ownership, constraints, history, and failure modes. For major changes: independent designs, cross-review, then synthesize — that spend is justified by blast radius, not applied by default. Restart when implementation evidence shows the architecture is wrong.
10. **Smell workarounds.** Repeated escape hatches, forced casts, and recurring patches mean reconsider the design.
11. **Ship in small increments.** Self-contained steps, each independently verifiable. A step that cannot be verified on its own is too big.
12. **Isolate parallel work.** Separate reproducible environments; do not share mutable state across parallel agents. Parallelism buys wall-clock time, not total effort — use it where the branches are genuinely independent.
13. **Keep a compact map.** Features, user paths, controls, known caveats — searchable and maintained. Compact is the requirement, not a style note: it is read far more often than it is written, so every line has to earn re-reading.
14. **Automate after the loop works.** Recurring diagnostics and reproductions only once verification is trustworthy. Automating an unreliable check just produces noise faster.

## Start small

One trusted verify path is enough. Grow the harness when the same check keeps slowing you down.
