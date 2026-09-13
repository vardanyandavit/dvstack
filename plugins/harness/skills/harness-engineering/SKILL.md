---
name: harness-engineering
description: Use when building or tightening the system around coding agents (task contracts, tool gates, verify/recover, durable state). Skip for short low-risk tasks.
---

# Harness engineering

The harness is the system around the model: contracts, tool gates, verify/recover, and receipts. Light by default. Scale with blast radius.

**Default trade:** start with one contract, one verify path, and one approval gate for risky actions. Add a layer only after a failure you have seen.

## Rules

1. **Task contract first.** Outcome, scope, must-not-change, evidence, and approvals — before work starts.
2. **Progressive context.** Map first. Retrieve on demand. Do not dump the whole repo.
3. **Tool gateway.** Bounds, timeouts, idempotent retries, structured evidence.
4. **Split brain, hands, and history.** The transcript is not memory.
5. **Durable state.** Facts, decisions and reasons, progress, lessons.
6. **Done needs evidence.** Cheapest deterministic checks first.
7. **Verify to reject.** Independent verifier. No duty to repair.
8. **Policy outside the prompt.** Gate external and irreversible actions. Hard-stop secrets, out-of-workspace writes, and budget overruns.
9. **Classify then recover.** Change a condition. Keep budgets. Stop if nothing changed.
10. **Trace plus change receipt.** What changed, what was verified, what was not, risks, approvals.
11. **Learn the smallest fix.** Delete dead harness.
12. **Minimum layers.** Add only for failures you have seen.

## Do not by default

Multi-agent for one-file tweaks. Whole-repo context dumps. Mark tests passed without running them. Safety only in the prompt.

## Start small

One contract + one verify + one approval gate for risky actions.
