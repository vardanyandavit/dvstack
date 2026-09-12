---
name: playwright-fixtures
description: Build and compose Playwright fixtures beyond page objects — test-scoped vs worker-scoped, auto fixtures that apply to every test, option fixtures configured per project, setup and teardown around use(), overriding a fixture for one file with test.use, merging fixture files, and test locks for resources that cannot run concurrently. Use when test setup is repeated across specs, when setup is too expensive to repeat per test, when a value must differ per project, or when deciding between a fixture, a hook, and a helper.
---

# Playwright fixtures

Naming and folder placement are defined in `playwright-naming-conventions`; suite structure in `playwright-test-architecture`.

A fixture is setup that arrives as an argument. It beats a hook because it is requested by the tests that need it, torn down automatically even on failure, and composable.

## Files

- `files/account.fixture.ts` — one file showing an option fixture, a worker-scoped fixture, and an auto fixture that fails any test whose page logged a console error.

## Fixture or hook or helper

| Use | When |
|---|---|
| **Fixture** | The test needs a *thing* (a page object, a seeded record, an API client), or setup that must be undone afterwards |
| **`beforeEach` hook** | A step every test in one file performs, needing no value — usually just `goto()` |
| **Helper** | A pure function with no setup and nothing to clean up |

If you are about to write the same `beforeEach` in a second file, it is a fixture.

## Scope

**Test-scoped** (the default) runs per test. Everything before `use()` is setup, everything after is teardown, and the teardown runs even when the test fails:

```ts
seededOrderId: async ({ request }, use) => {
  const id = await createOrder(request);
  await use(id);            // the test runs here
  await deleteOrder(request, id);
},
```

**Worker-scoped** runs once per worker process and is shared by every test that worker runs:

```ts
workerAccount: [async ({}, use, workerInfo) => { ... }, { scope: "worker" }],
```

Use it only for setup that is expensive *and* safe to share — a provisioned account, a licence token. The moment a test mutates a worker fixture, it has reintroduced shared state, and the suite is order-dependent again. Test-scoped is the default for a reason.

**Auto fixtures** apply to every test without being named in its arguments:

```ts
failOnConsoleError: [async ({ page }, use) => { ... }, { auto: true }],
```

Worth one in almost every suite: fail a test whose page logged a console error. It catches broken requests and React warnings that no assertion was looking for. Introduce it on a mature app behind an allowlist, or it will fail everything at once.

**Option fixtures** take their value from the config, so projects differ by configuration rather than by code:

```ts
slowMotion: [0, { option: true, scope: "worker" }],
```
```ts
projects: [{ name: "debug", use: { slowMotion: 250 } }],
```

## Composing and overriding

- One `*.fixture.ts` per concern, merged in `fixtures/index.ts` with `mergeTests(pageObjectTest, apiTest, networkTest)`. Specs keep one import line.
- Override a fixture for a single file with `test.use({ storageState: ... })` — the standard way to make one spec run signed out.
- Extend an existing fixture rather than replacing it: take it as an argument in the override, adjust, pass it on.
- A fixture can depend on another fixture by naming it in its arguments. Playwright resolves the order; do not sequence setup by hand.
- Give slow setup its own budget with `test.slow()` or a fixture timeout, rather than raising the timeout for every test.

## Resources that cannot be shared

When two tests genuinely cannot touch a resource at the same time — a single sandbox account, a rate-limited integration — name a lock instead of serialising the whole suite:

```ts
test("update user settings", { lock: "user-settings" }, async ({ page }) => { ... });
```

Tests holding the same lock never run concurrently; everything else keeps running in parallel. Reach for this only after per-test isolation has been ruled out — a lock is a real constraint on runtime, and most "shared" resources are a data-seeding problem in disguise.

## Verify

- Removing a fixture from a test's arguments makes that test fail — nothing is set up by accident.
- A test that fails mid-way still cleans up: the record it created is gone.
- `--workers=4 --repeat-each=3` passes, so no worker fixture is being mutated.
- The HTML report shows fixture setup as its own timed step.

## Rules

- No setup in a fixture that some tests do not need. Split it.
- No mutation of a worker-scoped fixture.
- Every fixture that creates something cleans it up after `use()`.
- No `beforeAll` where a worker fixture is the honest expression of "once per worker".
- A fixture returns a value or performs setup. One that does both for unrelated reasons is two fixtures.
