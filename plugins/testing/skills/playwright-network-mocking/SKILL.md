---
name: playwright-network-mocking
description: Control the network in Playwright tests — intercept with page.route, stub JSON responses, force API errors and slow responses, block third-party scripts, and decide what to mock versus hit for real. Use when a test needs a specific server state, when covering error or empty or loading states, when third-party widgets make tests slow or flaky, or when choosing between mocked and real backend data.
---

# Network mocking in Playwright

Naming and folder placement are defined in `playwright-naming-conventions`; suite structure in `playwright-test-architecture`.

## Files

- `files/network.fixture.ts` — a `mockApi` fixture with `json`, `fail`, `patch`, and `defer` helpers, plus an always-on third-party blocker.

Copy it to `fixtures/network.fixture.ts` and merge it into the suite's single `test` export:

```ts
// fixtures/index.ts
export const test = mergeTests(pageObjectTest, networkTest);
```

See `playwright-test-architecture` for that file and for the folder layout it belongs to.

## What to mock, and what not to

| Mock it | Hit it for real |
|---|---|
| Error responses (500, 403, network failure) | The main happy path of the flow under test |
| Empty states and pagination edges | Anything whose contract with the backend is the point |
| Slow responses, for loading and race states | Auth, if the suite tests auth |
| Third-party scripts: analytics, chat, ads, maps | |
| Payment providers and anything that costs money | |
| Data that is expensive or impossible to seed | |

Default to the real backend and mock the specific thing under test. A suite where every response is stubbed passes happily while the integration is broken — it has become a slow unit test.

## Use it

```ts
import { endpointPatterns } from "../constants/endpoints";
import { expect, test } from "../fixtures";

test("shows a retry when the order list fails", async ({ page, mockApi, ordersPage }) => {
  await test.step("the API is failing", async () => {
    await mockApi.fail(endpointPatterns.orders, 500);
    await ordersPage.goto();
    await expect(ordersPage.getErrorMessage()).toBeVisible();
  });

  await test.step("recovering re-fetches and renders the list", async () => {
    await page.unroute(endpointPatterns.orders);
    await ordersPage.clickRetry();
    await expect(ordersPage.getRows()).toHaveCount(3);
    await expect(ordersPage.getErrorMessage()).toBeHidden();
  });
});
```

Rules that make interception behave:

1. **Register routes before the navigation that triggers them.** A route added after `goto()` does not apply to requests already in flight.
2. **Patterns are globs or RegExp**, matched against the full URL. Keep them in `constants/endpoints.ts` next to the paths themselves, so one path change updates the calls and the mocks together.
3. **Last matching route wins** — a specific route registered after a broad one overrides it, which is how a single endpoint gets special treatment inside a blanket stub.
4. **`route.fetch()` + `route.fulfill({ response, json })`** edits a real response instead of inventing one. Prefer it: the shape stays true to the server.
5. **Scope wide with `context.route`** for something every page needs (third-party blocking), and with `page.route` for one test's concern.
6. **Stop mocking with `page.unroute(pattern)`** when a later step needs the real endpoint.
7. **Keep stub bodies in `data/`**, typed against the app's own response types where they exist, so a contract change breaks compilation instead of silently passing.
8. **Naming:** `fixtures/network.fixture.ts`, stub data in `data/orders.ts`, patterns in `constants/endpoints.ts` — see `playwright-naming-conventions`.

## Loading and race states

```ts
const release = await mockApi.defer("**/api/orders");
await ordersPage.goto();
await expect(ordersPage.getSkeleton()).toBeVisible();
release();
await expect(ordersPage.getSkeleton()).toBeHidden();
await expect(ordersPage.getRows()).toHaveCount(3);
```

This is the correct way to test a spinner. Asserting on a spinner without holding the response is a race the test will lose as soon as the API gets fast.

## Verify

- Turn the backend off: mocked tests still pass, unmocked ones fail with a clear error.
- Error-state tests fail if the app's error handling is removed.
- The trace's network tab shows no analytics or chat-widget requests.
- No test depends on a route registered by a different test.

## Rules

- Never mock the thing the test exists to verify.
- No `route.abort()` on application endpoints as a shortcut to an error state — abort is a network failure, not a 500; use the one you mean.
- Stub bodies live in files, not inline in the spec, once they exceed a few lines.
- Every mocked endpoint is asserted on. A stub with no assertion is dead configuration.
