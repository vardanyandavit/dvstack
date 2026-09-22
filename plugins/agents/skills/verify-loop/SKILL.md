---
name: verify-loop
description: Use when a change needs proving and the project's real check is unknown, too slow, or being skipped — find the honest build/test/lint command from the lockfile and scripts, run the narrowest one that covers the change, widen before the PR, and report the actual output. Covers what to do when no check exists. Not a CI pipeline design, and not a substitute for reading the diff.
---

# Verify loop

Reading a diff is not proof. **One honest command, run, with its real output.**

`agent-ops-bar` says a project needs one honest verify command. This skill is how to find it, scope it, and report it.

## Find it

In this order — the later sources are the ones that are actually enforced:

1. **Lockfile → package manager.** `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lock`. Never guess; a wrong package manager corrupts the lockfile.
2. **Scripts.** `package.json` scripts, `Makefile`, `justfile`, `taskfile`.
3. **CI workflow.** What the pipeline actually runs is the real definition of passing — a README can be years stale, a green pipeline cannot.
4. **Monorepo task runner.** Turbo, Nx, Lerna, workspace filters. Scope to the package you changed (`pnpm -F <pkg> test`), not the root.
5. **Ask**, if none of the above answers it. Do not invent a command.

Write the command into the project's rules file once you have it, so the next run does not pay for this again.

## Scope it

**Narrowest first, widen before the PR.**

| Change | Run |
|---|---|
| One file, one behaviour | That file's tests, or the single test |
| One package in a monorepo | That package's check |
| Types or a shared signature | Typecheck across what imports it |
| Before the PR | The full suite, once |

A check that takes minutes gets skipped, then re-run whole for a one-line change. Keep the inner loop seconds, and pay for the full suite once, at the end.

Match the failure to the check: a type error wants a typecheck, not the e2e suite. Running the slowest thing that *could* catch it is the same waste as running nothing.

## Report it

- **Run it. Never claim a run that did not happen**, and never say "tests should pass".
- **Paste the failure, not the log.** The failing assertion and its file, not five hundred lines that get re-sent every turn — `agent-session`.
- **A red run is a result.** Report it with the output; do not quietly retry until it is green.
- **Say what you did not check.** "Unit tests pass; the e2e suite was not run" is honest and useful. Silence is neither.

## When there is no check

Say so plainly, then pick the cheapest real proof and name it:

- Typecheck or build alone, if that is all there is.
- Run the actual code path — the CLI, the endpoint, the page — and show the output.
- Write the one test that covers the change, if the repo has a test runner at all.

"There is no test suite; I built and ran the command, output below" is a verified change. "Looks correct" is not.

## Do not

- Guess the package manager, or run `npm` in a pnpm repo.
- Weaken, skip, or delete a test to make the check pass.
- Raise a timeout or add a retry instead of fixing the cause.
- Treat a lint pass as proof the behaviour works.
- Run the full suite on every inner-loop iteration.

## Not this skill

Orienting in the repo first: `repo-recon`. The bar itself: `agent-ops-bar`. What a test is allowed to assert: `coding-rules`. Excuses for skipping: `anti-rationalization`. CI, gates, and recover loops: `harness-engineering`. Playwright suite commands: `dvstack-testing`.

## Verification

- [ ] Command found from lockfile / scripts / CI, not invented
- [ ] Scoped to the change, widened before the PR
- [ ] Actually run, with real output reported
- [ ] Failures surfaced, not retried away or hidden
- [ ] What was *not* verified is stated
