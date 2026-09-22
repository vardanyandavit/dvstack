---
name: playwright-step-validation
description: What a Playwright step waits on and asserts — zero hard-coded timeouts, the validation ladder (locator state → waitForResponse → both → load state), and fixing flaky or timing-dependent tests. Use when writing a step, choosing a wait, or a test fails intermittently.
---

# Step validation

Two house rules:

1. **No hard-coded timeout anywhere** — no `waitForTimeout`, `setTimeout`, or sleep helper in specs, pages, fixtures, or helpers. Enforced by `playwright/no-wait-for-timeout` in `playwright-code-review`'s ESLint config.
2. **Every step ends with a validation** that the app reached the next state, including the last step.

## Files

`files/waits.ts` → `helpers/waits.ts`: `onEndpoint(pattern, method)`, `responseFrom`, `requestFrom` — the listener is always registered before the trigger.

## The ladder

Use the cheapest rung that proves the step.

| Rung | Validation | For |
|---|---|---|
| 1 | Locator state: `toBeVisible`, `toBeHidden`, `toHaveText`, `toHaveCount`, `toHaveURL`, `toHaveValue`, `toBeChecked`, `toHaveAttribute("aria-expanded", "true")` | Default, nearly everything |
| 2 | `waitForResponse` on endpoint **and** method, status asserted after | Outcome is a request, or UI change is ambiguous |
| 3 | Response **and** rendered UI | Data-driven lists, tables, feeds |
| 4 | `waitForLoadState("domcontentloaded" \| "load")` + a rung-1 assertion | Small quiet pages only. Never `networkidle` |

House choices a model often gets wrong:

- **Assert both directions of a toggle**: open → button visible; close → same button `toBeHidden()`.
- `toBeHidden()` over `not.toBeVisible()` when the element should leave; `toHaveText` over `toContainText` when the full string is known.
- Navigate → `toHaveURL` **and** the landing element visible. Submit → success visible **and** form/spinner hidden.
- `expect(...)`, not `locator.waitFor()` — `waitFor` records no assertion. Use it only for control flow.
- Scope to a container instead of `.first()`/`.nth()` to silence strict mode. `.first()` only when "first" is the meaning (newest feed item). Responsive duplicate DOM: `filter({ visible: true })`.

## Network waits

```ts
const [response] = await Promise.all([
  page.waitForResponse(onEndpoint(endpointPatterns.orders, "POST")), // wait listed FIRST
  ordersPage.submit(),
]);
expect(response.status()).toBe(201);
```

- The waiter is the first array entry; `Promise.all([submit(), waitForResponse()])` is still the race.
- Match method, not only URL. Never put `ok()` in the predicate — a 500 then reports as a timeout. Assert status after.
- Same pattern for `popup`, `download`, `filechooser`, `dialog`: register before the click.

## Timeouts

Set `expect.timeout`, `actionTimeout`, `navigationTimeout` once in config. An inline `{ timeout }` only for a genuinely slow operation, as a named constant with a comment. Raising a timeout because a step "sometimes needs longer" is a sleep. No matcher for the condition? `expect.poll(...)` or `expect(async () => {...}).toPass()`.

## When a test is already flaky

Reproduce with `--repeat-each=10 --workers=4`, then read the trace's before-snapshot at the failing action:

| Trace shows | Real cause |
|---|---|
| Click landed elsewhere | Layout shift after load |
| Present, action timed out | Overlay, or detached and re-rendered |
| Never appeared | Waiting on the wrong thing; its request failed |
| Old data | Asserted before the refetch |
| Passes alone, fails in parallel | Shared account/record/storage state |
| Fails as the suite grows | Earlier test did not clean up |

Fix by asserting the state you need, isolating data per test, or freezing non-determinism (`page.clock`, pinned `timezoneId`/`locale`, stubbed third parties). Assert durable outcomes, not toasts that vanish. CI `retries: 2`, local `0`; a pass-on-retry is a failure to fix, not a pass. Can't fix today → `test.fixme()` with a reason and link.

## Never

- Raise a timeout, add a sleep, add a retry, or set `workers: 1` to go green.
- `catch` and continue past a failed action.
- Conditional assertions (`if (await x.isVisible())`) or non-retrying reads (`isVisible()`, `textContent()`, `count()`) as assertions.

## Verify

- `grep -rnE "waitForTimeout|setTimeout|sleep\(|networkidle" tests/ pages/ fixtures/ helpers/` is empty.
- Every changed `test.step` ends with `await expect(...)`; every network wait is registered before its trigger.
- `--repeat-each=10 --workers=4` passes (20 for a test that was flaky).
- Each new validation fails when the behaviour is broken.
