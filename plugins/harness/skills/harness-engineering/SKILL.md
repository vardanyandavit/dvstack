---
name: harness-engineering
description: Use when building or tightening the system around coding agents (task contracts, tool gates, verify/recover, durable state). Skip for short low-risk tasks.
---

# Harness engineering

The harness is the system around the model: contracts, tool gates, verify/recover, and receipts. Light by default. Scale with blast radius.

**Default trade:** start with one contract, one verify path, and one approval gate for risky actions. Add a layer only after a failure you have seen.

## Rules

1. **Task contract first.** Outcome, scope, must-not-change, evidence, approvals, `done_when`, and `escalate_when` — before work starts. Escalate on the same failure 3×, a needed schema change, or a product-rule conflict.
2. **Compile context, don't dump.** Map + step spec + summarized done + open risks + artifacts. Progressive disclosure. Transcript ≠ DB. Prompt ≠ filing cabinet.
3. **Tool gateway.** Bounds, timeouts, idempotent retries, structured evidence.
4. **Four memory kinds.** FACTS / DECISIONS / STATE / LESSONS. Summarize, then drop tool dumps. The transcript is not memory.
5. **Permission ladder.** Model proposes → policy authorizes → tool executes. Friction matches consequence: read auto; isolated writes + diff; send/deploy/delete need approval.
6. **Policy outside the prompt.** Gate external and irreversible actions. Hard-stop secrets, out-of-workspace writes, and budget overruns.
7. **Done needs evidence.** Deterministic domain checks before model review.
8. **Verify to reject.** Independent verifier, fresh context. No duty to repair.
9. **On failure, fix capability not prompt heat.** Missing context → map. Bad tool → schema. Missing guardrail → policy. Weak check → regression. One bounded repair. Rollback point. Keep budgets. Stop if nothing changed.
10. **Trace plus change receipt.** What changed, what was verified, what was not, risks, approvals.
11. **Minimum layers.** Build order: define done → one tool → one state file → one recovery → trace → then more autonomy. Repeated failure → exactly one of map / tool / permission / test. Delete dead harness.

## Do not by default

Multi-agent for one-file tweaks. Whole-repo context dumps. Mark tests passed without running them. Safety only in the prompt.

## Start small

One contract + one verify + one approval gate for risky actions. Skip for short low-risk tasks.
