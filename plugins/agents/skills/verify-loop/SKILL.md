---
name: verify-loop
description: When a change needs proving and the real check is unknown, slow, or being skipped. Find the enforced command, run the narrowest one, widen before the PR, report real output and what was not checked.
---

# Verify loop

Reading a diff is not proof. One honest command, run, with its real output.

## Find it

Lockfile → package manager. Then scripts, then the CI workflow — what CI runs is the definition of passing. In a monorepo, scope to the changed package (`pnpm -F <pkg> test`). If nothing answers it, ask; never invent a command.

## Scope it

| Change | Run |
|---|---|
| One file, one behaviour | That file's tests, or the single test |
| Types or a shared signature | Typecheck across importers |
| Before the PR | The full suite, once |

Match the check to the failure: a type error wants a typecheck, not the e2e suite.

## Report it

- Never claim a run that did not happen, and never write "tests should pass".
- Paste the failing assertion and its file, not the whole log.
- A red run is a result. Report it; do not retry until green.
- Say what you did not check: "unit tests pass; e2e not run".
- No check exists? Say so, then use the cheapest real proof — build, run the code path and show output, or add the one test that covers it.

## Never

- Weaken, skip, or delete a test to pass.
- Raise a timeout or add a retry instead of fixing the cause.
- Treat lint as proof that behaviour works.
