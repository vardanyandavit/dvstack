---
name: playwright-step-validation
description: End every Playwright step with a validation that proves the app reached the next state, instead of waiting for a duration — zero waitForTimeout anywhere, the validation ladder (locator state first, then waitForResponse in a Promise.all with the wait listed first, matched on method and status, then response plus rendered UI, then waitForLoadState only on genuinely quiet pages), asserting both directions of a toggle, registering the network wait before the action, and why networkidle breaks on content-heavy pages. Use when writing or reviewing a step that ends without an assertion, when a test sleeps to "let it load", when deciding what to wait for after a click, submit, or scroll, or when a suite has been stabilised with timeouts.
---

# Step validation

Naming and folder placement are defined in `playwright-naming-conventions`; step and hook structure in `playwright-test-architecture`. This skill decides **what each step waits on**. Diagnosing a test that is already failing intermittently is `playwright-flaky-tests`.

Two rules hold the whole suite up:

1. **No hard-coded timeout anywhere.** No `page.waitForTimeout`, no `setTimeout`, no sleep helper, in a spec, a page object, a fixture, or a helper. Every test that needs one can be written without one.
2. **Every step ends with a validation** that the app actually reached the next state. A step that only performs actions proves nothing and still reports as passed.

A validation is not decoration. It is both the proof the step worked *and* the wait for the next step, which is why the suite gets faster as it gets stricter: an assertion retries and continues the instant the condition holds, while a sleep always costs its full duration and is still a guess.

## Files

- `files/waits.ts` — `onEndpoint`, `responseFrom`, `requestFrom`. Copy to `helpers/waits.ts`. They exist so the listener is always registered before the trigger.

Rule 1 is machine-enforceable: `playwright/no-wait-for-timeout` and `playwright/no-networkidle` in `playwright-code-review`'s `files/eslint.config.mjs` fail the build rather than the review.

## The ladder

Pick the **cheapest rung that actually proves the step**, and go up only when the rung below cannot see the outcome.

| Rung | Validation | Use it for |
|---|---|---|
| 1 | Locator state — `toBeVisible`, `toBeHidden`, `toHaveText`, `toHaveCount`, `toHaveURL` | Nearly everything. The default. |
| 2 | `waitForResponse` — endpoint, method, status | The step's outcome is a request, or the UI change is invisible/ambiguous |
| 3 | Response **and** UI | Data-driven lists, tables, feeds — the network proved it arrived, the assertion proves it rendered |
| 4 | `waitForLoadState` | Small, quiet pages only. Last resort, see the limits below. |

## 1. Locator state

The default validation. The matcher is chosen by what the step changed:

| The step | The validation |
|---|---|
| Opened a panel, drawer, menu, modal | `await expect(sidebar.getSignInButton()).toBeVisible()` |
| Closed it again | `await expect(sidebar.getSignInButton()).toBeHidden()` |
| Navigated | `await expect(page).toHaveURL(routes.dashboard)` **and** the landing element visible |
| Filled a field | `await expect(field).toHaveValue("...")` where the value is corrected or formatted |
| Submitted | the success state visible **and** the form or spinner hidden |
| Loaded a list | `await expect(rows).toHaveCount(20)` |
| Toggled a control | `toBeChecked`, `toBeEnabled`, `toBeDisabled`, `toHaveAttribute("aria-expanded", "true")` |

**Assert both directions of a toggle.** Opening the sidebar asserts the sign-in button is visible; closing it asserts the same button is hidden. Only asserting the "on" state lets a close that silently does nothing pass forever.

**Pick the state precisely.** `toBeVisible` is present *and* rendered; `toBeHidden` is not visible *or* not in the DOM; `toBeAttached` is in the DOM regardless of visibility — the right check for an element that mounts behind an animation or is rendered off-screen.

**Use `expect`, not `waitFor`.** `locator.waitFor({ state: "visible" | "hidden" | "attached" | "detached" })` waits but records no assertion, so the report shows a step that proved nothing. Reach for it only when you need the wait for control flow — reading a value, deciding which of two documented layouts is in play — never as the step's validation.

## 2. The response

When the step's real outcome is a request, or when the UI gives no distinct signal that new data arrived, wait on the network. **Register the wait before the action** — a response awaited after the click has usually already arrived, and the test times out with nothing listening.

```ts
// Wrong: the response fires during the click, before anything is listening.
await ordersPage.submit();
await page.waitForResponse(onEndpoint(endpointPatterns.orders, "POST"));

// Right: one atomic block, the wait listed first, so no response can be missed.
const [response] = await Promise.all([
  page.waitForResponse(onEndpoint(endpointPatterns.orders, "POST")),
  ordersPage.submit(),
]);
expect(response.status()).toBe(201);
```

**Order inside `Promise.all` matters.** The array's expressions are evaluated left to right, so the waiter must be the first entry. `Promise.all([submit(), waitForResponse(...)])` starts the action before the listener exists — the same race the pattern exists to remove.

The same block covers navigation, popups, downloads, and file choosers — every event-driven interaction in `playwright-hard-interactions`. Where the trigger is a page object method, `responseFrom` from `files/waits.ts` is that block with the ordering already correct:

```ts
const response = await responseFrom(page, onEndpoint(endpointPatterns.orders, "POST"), () => ordersPage.submit());
```

- **A glob is enough when only the URL matters** — `page.waitForResponse("**/form-submitted.json")`. Use `onEndpoint` as soon as the method has to be pinned down.
- **Match on endpoint and method**, not on the URL alone — a page that both `GET`s and `POST`s the same path will resolve on whichever arrives first.
- **Assert the status after the wait, not inside the predicate.** A predicate requiring `ok()` never matches a 500, so a real backend failure reports as "timed out waiting for response" instead of the status it actually returned.
- **Assert the payload when the test depends on it** — `expect(await response.json()).toMatchObject({ status: "confirmed" })`. See `playwright-api-testing` for response assertions and `playwright-network-mocking` for when to fake one instead.
- **`waitForRequest`** covers fire-and-forget calls — analytics, beacons — where no response comes back.

## 3. Response and UI together

For anything data-driven, the two validations answer different questions: the response says the data arrived, the assertion says the app rendered it. A test with only the first passes while the page shows an empty state.

```ts
await test.step("load the next page of movies", async () => {
  const [response] = await Promise.all([
    page.waitForResponse(onEndpoint(endpointPatterns.movies)),
    moviesPage.scrollToBottom(),
  ]);
  expect(response.status()).toBe(200);

  await expect(moviesPage.getMovieCards()).toHaveCount(40);
  await expect(moviesPage.getLoadingSpinner()).toBeHidden();
});
```

## 4. `waitForLoadState` — narrow, deliberate, rare

A page-level lifecycle wait knows nothing about your feature; it only knows the browser stopped doing something. That makes it useful in exactly one situation: **a small, quiet page** — a login form, a static settings page, a confirmation screen — with a handful of fields, no polling, no streaming, no lazy images, no analytics heartbeat.

| State | Means | Where it is safe |
|---|---|---|
| `commit` (on `page.goto({ waitUntil })`) | Response received, document started | Fastest handoff; follow it with a real assertion |
| `domcontentloaded` | HTML parsed | Quiet pages; still says nothing about data |
| `load` | Document and its subresources loaded | Quiet pages with few assets |
| `networkidle` | No network for 500 ms | Effectively nowhere — Playwright discourages it |

**On a content-heavy page these break the test.** A movie grid, a dashboard, an infinite feed, anything with lazy images, websockets, polling, or a third-party widget never reaches `networkidle`, and `load` resolves either far too late or before the data-driven content exists. What follows is a timeout in CI, or a pass that depends on how fast the images came back that morning — which is exactly the flakiness these calls were added to prevent.

Even on a page where it is allowed, a load state is never the *only* validation for the step:

```ts
await page.goto(routes.login, { waitUntil: "domcontentloaded" });
await expect(loginPage.getSubmitButton()).toBeVisible();   // the real validation
```

Rung 1 covers this case on its own, so treat rung 4 as something you justify rather than reach for.

## Timeouts

A retrying assertion's timeout is a **failure deadline**, not a wait — it costs nothing when the app is fast, unlike a sleep, which always costs its full duration. Set the defaults once in `playwright.config.ts` (`expect.timeout`, `actionTimeout`, `navigationTimeout`) and let every step inherit them.

An inline `{ timeout: N }` is justified only where one operation is genuinely slower than the rest of the suite — a report build, a bulk import — and then it carries a comment saying why and lives as a named constant, never a bare number in a spec. Raising a timeout because a step "sometimes needs longer" is the sleep again, wearing a different name.

For a condition with no matcher, retry the check rather than sleeping before it: `await expect.poll(() => api.getOrderStatus(id)).toBe("shipped")` or `await expect(async () => { ... }).toPass()`.

## Verify

- `grep -rnE "waitForTimeout|setTimeout|sleep\(" tests/ pages/ fixtures/ helpers/` returns nothing.
- `grep -rn "networkidle" tests/ pages/` returns nothing.
- Every `test.step` in the diff ends with at least one `await expect(...)`.
- Every `waitForResponse` / `waitForRequest` is created before its trigger — inside a `Promise.all` with the wait as the first entry, or as a promise variable. Never awaited after the action.
- The suite passes `--repeat-each=10 --workers=4`, and again with the browser throttled to slow 3G — a suite that only passes at full speed is timing-dependent.
- Each new validation fails when the behaviour it covers is broken. An assertion that cannot fail is not a validation.

## Rules

- No hard-coded timeout anywhere in the suite. No exceptions, no "just this one flow".
- No step without a validation, including the last step of a test.
- No `waitForLoadState` or `waitUntil` on a page with lazy content, polling, or streaming — and never as a step's only validation.
- Never await the action before registering the network wait it triggers. In a `Promise.all`, the wait is the first element, never the second.
- No conditional validation (`if (await x.isVisible())`), and no non-retrying read (`isVisible()`, `textContent()`, `count()`) used as an assertion.
- Assert both directions of anything that toggles.
- Raising a timeout is not a fix. Change what the step waits on.
