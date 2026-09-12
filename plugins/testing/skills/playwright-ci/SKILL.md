---
name: playwright-ci
description: Run a Playwright suite in CI — sharding across parallel jobs, merging blob reports into one HTML report, caching browsers, traces and screenshots as artifacts on failure, secrets and base URL per environment, and keeping the run under control as the suite grows. Use when adding e2e tests to a pipeline, when CI runs are slow or time out, or when a CI failure cannot be debugged from the logs.
---

# Playwright in CI

Naming and folder placement are defined in `playwright-naming-conventions`; suite structure in `playwright-test-architecture`.

## Files

- `files/playwright.yml` — a GitHub Actions workflow: 4 shards, browser cache keyed on the Playwright version, blob reports merged into one HTML report, artifacts retained. Copy to `.github/workflows/e2e.yml`.

The same four moving parts apply to GitLab, CircleCI, and Jenkins: shard, cache, run, merge.

## Set it up

1. **Shard across jobs.** `--shard=i/N` splits by test file. Start at 4 and raise it when the slowest shard exceeds roughly ten minutes. Sharding only helps if tests are independent — see `playwright-test-architecture`.
2. **Set `fail-fast: false`** on the matrix, or one shard's failure cancels the others and you lose the full picture.
3. **Cache browsers** on `~/.cache/ms-playwright`, keyed by the resolved `@playwright/test` version. Never cache on a lockfile hash alone: a Playwright bump then restores browsers that don't match the runner.
4. **Report with blob, merge at the end.** Each shard writes `blob-report/`; a final job runs `npx playwright merge-reports --reporter html`. Without this you get N partial reports and no way to see the run as a whole. The config in `playwright-test-architecture` already adds the `github` reporter in CI, which annotates failures on the diff.
5. **Upload artifacts with `if: ${{ !cancelled() }}`.** Uploading only on failure loses the report for a run that was flaky-but-green. `trace: "retain-on-failure"` keeps the size sane while still giving a trace for everything that failed.
6. **Secrets and URL from the environment.** `BASE_URL` as a variable, credentials as secrets, never in the repo. The same workflow then runs against a preview deployment by changing one variable.
7. **Set `CI: true`.** The shared config reads it for `forbidOnly`, `retries`, and `workers`.

## Debugging a CI-only failure

1. Download the `playwright-report` artifact, open `index.html`, find the failed test.
2. Open its trace — the same timeline, DOM snapshots, network, and console as locally.
3. If it passes locally and fails in CI, suspect in this order: shared state between parallel workers, timezone or locale, viewport size, missing seed data, a slower machine exposing a real race.
4. Reproduce the CI environment locally when the trace is not enough:
   ```bash
   docker run --rm -it -v "$PWD":/work -w /work \
     mcr.microsoft.com/playwright:v1.56.0-jammy \
     npx playwright test --workers=2
   ```
   Match the image tag to the project's Playwright version.

`playwright-flaky-tests` covers what to do once the race is identified.

## Keeping runs fast

- Tag the critical path with `@smoke` and run `--grep @smoke` on every push; run the full suite on merge and nightly.
- Reuse auth state instead of signing in per test (the `setup` project in the shared config).
- Add browsers other than Chromium only where a real bug justifies the cost.
- Block third-party scripts — see `playwright-network-mocking`.
- Never set `retries` above 2 to stay green. It triples the runtime of a broken suite and hides the cause.

## Verify

- A red test produces a downloadable trace, and opening it shows the failing step.
- The merged HTML report contains every shard's results in one place.
- A second run on an unchanged branch restores the browser cache (check the step's timing).
- The workflow passes with no secrets printed in the logs.
- Cancelling a run leaves no orphaned deployment or seeded data behind.

## Rules

- No credentials, tokens, or base URLs committed to the repo.
- No `--workers=1` as a flakiness fix; fix the isolation instead.
- Artifacts on every run, not only on failure.
- The report job runs on failure too, which is exactly when it is needed.
