---
name: playwright-flaky-tests
description: Diagnose and fix a flaky, intermittent, or timing-dependent Playwright test — read the trace, find the real race, replace waitForTimeout and manual waits with web-first assertions, isolate shared state, and set retry policy honestly. Use when a test passes locally but fails in CI, fails only sometimes, only in parallel, or was "fixed" by adding a sleep or a retry.
---

# Fixing flaky Playwright tests

Naming and folder placement are defined in `playwright-naming-conventions`; suite structure in `playwright-test-architecture`. What each step should wait on in the first place is `playwright-step-validation` — this skill is for a test that is already failing intermittently.

A flaky test is a race the test lost, not a test that needs more time. Raising timeouts hides it; the next slow CI run brings it back.

## Diagnose

1. **Reproduce it.** `npx playwright test path/to.spec.ts --repeat-each=10 --workers=4`. Passing here but failing in CI points at environment or parallelism, not at the test's own timing.
2. **Open the trace** from the failed run: `npx playwright show-trace test-results/<...>/trace.zip`. It is the whole diagnosis — DOM snapshot at the failing action, the action log with timings, network, and console.
3. **Read the failure against the snapshot.** The snapshot at the failing step tells you which of these it is:

| What the trace shows | What is actually wrong |
|---|---|
| Element present but the click landed elsewhere | Layout shifted after load — a banner, a font swap, an image without dimensions |
| Element present, action timed out | Covered by an overlay, or detached and re-rendered mid-action |
| Element never appeared | Waiting on the wrong thing; the request it depends on failed or was never made |
| Old data visible | Asserted before the refetch resolved |
| Passes alone, fails in parallel | Shared state: same account, same record, same storage state written by two workers |
| Fails only as the suite grows | Leak from an earlier test that did not clean up |

## Fix

**Replace waiting with asserting.** Every fix below is the same move — wait for the state you actually need, not for a duration.

```ts
// Sleeps for a race that may be longer tomorrow.
await page.waitForTimeout(2000);
await expect(table.getByRole("row")).toHaveCount(5);

// Retries until the condition holds, then continues immediately.
await expect(table.getByRole("row")).toHaveCount(5);
```

- **Navigation:** assert on the landing element, not `waitForLoadState("networkidle")` — an app with polling or analytics never goes idle.
- **A specific response:** `const [res] = await Promise.all([page.waitForResponse(r => r.url().includes("/api/orders") && r.request().method() === "POST"), save.click()]);` — the wait is the *first* entry, so the response cannot be missed. Match on endpoint and method, never on `ok()` (a 500 then reports as a timeout), and assert `res.status()` after. See `playwright-step-validation`.
- **Animation / re-render:** assert the post-animation state (`toBeEnabled`, `toHaveClass`, `toHaveCount`) rather than sleeping for the duration.
- **Auto-retrying block** for a condition with no matcher: `await expect(async () => { ... }).toPass({ timeout: 10_000 })`.
- **Toasts that vanish:** asserting on something that disappears after 3s is a lost race by design. Assert the durable outcome — the row in the list, the URL, the record via API.

**Isolate state.** Parallel-only flakiness is nearly always shared data. For a resource that genuinely cannot be shared, a named lock (`test("...", { lock: "user-settings" }, ...)`) keeps the rest of the suite parallel — see `playwright-fixtures`. Reach for it only after per-test data has been ruled out. Create per-test records with a unique suffix (`user-${test.info().parallelIndex}-${Date.now()}`), reset through the API in `afterEach`, and give a spec that mutates the signed-in user its own `storageState`.

**Stabilise the environment.** Freeze anything non-deterministic before blaming the test: `page.clock` for time-dependent UI, `route.fulfill` for third-party widgets, a fixed viewport, and animations off (`prefers-reduced-motion`) for screenshot work.

## Retry policy

Retries in CI are a report of real instability, not a fix. `retries: 2` in CI, `0` locally, so flakiness surfaces while it is cheap.

A test that only passes on retry is failing — treat the `flaky` count in the report as a work item, not as a pass. If a test cannot be made deterministic today, `test.fixme()` it with the reason and a link. A skipped test is honest; a retried test that everyone ignores is not.

## Verify

- The previously flaky test passes `--repeat-each=20 --workers=4`.
- A full CI run reports zero flaky, not "flaky but green".
- `grep -rn "waitForTimeout\|networkidle" tests/ pages/` is empty.
- The test passes when run alone and as part of the suite.

## Rules

- Never fix flakiness by raising a timeout, adding a sleep, or adding a retry.
- Never `catch` and continue past a failed action to "make it stable".
- No conditional assertions. If the state can legitimately differ, the test has two scenarios, not one branch.
- Every fix is verified with `--repeat-each`, not with one green run.
