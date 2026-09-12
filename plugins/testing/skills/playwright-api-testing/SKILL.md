---
name: playwright-api-testing
description: Use Playwright's request context for API testing and for setting up and cleaning up UI tests — the request fixture, apiRequest.newContext with tokens and headers, toBeOK response assertions, seeding state through the API instead of the UI, verifying side effects the UI does not show, and where the API/UI boundary belongs. Use when e2e setup is slow because it clicks through the UI, when testing endpoints directly, when cleaning up created records, or when a test needs to confirm what the backend actually stored.
---

# API testing and API-driven setup

Naming and folder placement are defined in `playwright-naming-conventions`; suite structure in `playwright-test-architecture`.

The highest-value use of the API in an e2e suite is not testing the API. It is **reaching the state under test in one call instead of twenty clicks**.

## Files

- `files/api-client.ts` — a typed wrapper over the `request` context that asserts on its own responses. Copy to `helpers/api-client.ts`.
- `files/api.fixture.ts` — exposes it as an `api` fixture. Copy to `fixtures/api.fixture.ts` and merge it in `fixtures/index.ts`.

## The `request` fixture

Built in, and it already carries `baseURL` from the config plus the cookies from the test's storage state — so an API call runs as the same user as the browser:

```ts
test("cancels an order", async ({ page, request }) => {
  const response = await request.post("/api/orders", { data: { item: "Desk", quantity: 1 } });
  await expect(response).toBeOK();
});
```

`expect(response).toBeOK()` beats `expect(response.ok()).toBeTruthy()`: on failure it prints the status, the URL, and the body, so the report says what went wrong without a second run.

For a different host or auth scheme, build a context explicitly:

```ts
const context = await request.newContext({
  baseURL: "https://api.example.com",
  extraHTTPHeaders: { Authorization: `Bearer ${process.env.API_TOKEN}` },
});
```

## Arrange through the API, assert through the UI

```ts
test("an existing order appears in the list", async ({ api, ordersPage }) => {
  const orderId = await test.step("an order exists", async () => {
    return api.createOrder({ item: "Desk", quantity: 1 });
  });

  await test.step("it is listed in the UI", async () => {
    await ordersPage.goto();
    await expect(ordersPage.getRow(orderId)).toBeVisible();
  });
});
```

Rules for the boundary:

1. **Arrange through the API, act through the UI, assert through whichever is honest.** Creating an order through the checkout flow to test the *list* screen tests checkout twice and blames the wrong feature when it breaks.
2. **Exactly one flow per feature goes through the UI end to end.** Checkout has a UI test; everything that merely *needs* an order created uses the API.
3. **Clean up through the API**, in an `afterEach` or after `use()` in a fixture. Never through the UI.
4. **Assert the side effect the UI cannot show.** A UI that says "Saved" is not proof the record persisted with the right fields — read it back with `api.getOrder(id)`.
5. **Assert inside the client, not in the test.** A failed arrange step must fail as "create order failed: 500", not as a confusing missing-element assertion thirty lines later.
6. **Never reimplement business logic in the client.** It issues requests and returns data; anything smarter belongs in the app.

## Testing the API itself

Playwright is a reasonable API test runner when the endpoints belong to the same app and the same pipeline — same fixtures, same report, no second framework. Keep those specs separate (`tests/api/*.spec.ts`) and run them in a project with no browser, since they need none.

What belongs there: status codes and error shapes, auth and permission boundaries, validation of required fields, and the response contract the UI depends on. What does not: exhaustive field-level permutations, which are cheaper as unit tests on the server.

## Verify

- Removing the UI seeding step does not change what the test proves.
- A failing arrange call fails the test with the status and body in the message.
- `afterEach` cleanup leaves no records behind after a full run.
- API specs run in their own project with no browser launched.
- Tokens come from the environment; `grep -rn "Bearer " tests/` finds no literals.

## Rules

- No UI clicking to reach a precondition that an endpoint can create.
- No API call in a spec that bypasses `api-client.ts` — one place per endpoint.
- Never assert only on a UI success message for something that must persist.
- Seed data carries a marker (`createdBy: "e2e"`) so cleanup can find it after a crashed run.
