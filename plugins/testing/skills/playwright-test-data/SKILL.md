---
name: playwright-test-data
description: Manage the data a Playwright suite runs on — factories and overrides instead of fixed records, per-worker unique names, seeding through the API, markers so a crashed run can still be cleaned up, the cleanup ladder from per-test to run-level, and making a suite deterministic with a frozen clock, pinned timezone and locale, and seeded randomness. Use when tests share a record or an account, when a suite passes alone and fails in parallel, when cleanup leaves rows behind, when a test only passes on data that already exists, or when a date, currency, or sort order makes a test fail at the wrong time of day.
---

# Test data

Naming and folder placement are defined in `playwright-naming-conventions`; seeding calls belong to `playwright-api-testing`; the account itself is `playwright-auth-and-roles`.

**Every test creates what it needs and leaves nothing behind.** A suite that depends on data already being there is not a test suite, it is a report on one database — it passes on the machine it was written on and fails everywhere else.

## Files

| File | Copy to | What it is |
|---|---|---|
| `files/order.factory.ts` | `data/order.factory.ts` | A factory with overrides and an `e2e` marker |
| `files/unique.ts` | `helpers/unique.ts` | Collision-safe unique names and emails, with an optional worker tag |

## Where data comes from

Four sources, and the choice is not stylistic — each proves something different:

| Source | For | Lives in |
|---|---|---|
| **Constant** | Values that never change: routes, a currency code, a feature-flag key | `constants/` |
| **Factory** | A record the test creates: an order, a user, a project | `data/*.factory.ts` |
| **API seed** | The same record, actually persisted before the UI opens | `helpers/api-client.ts` |
| **Mock** | A response the test cannot or should not create for real | `data/` + `fixtures/network.fixture.ts` |

A factory builds the *object*; the API client makes it *exist*. Keeping them separate is what lets the same factory feed a seeded record, a mocked response, and a form fill.

## Factories, not fixed records

```ts
// A fixed record. Every test that touches it is now coupled to every other.
export const testOrder = { id: "ORD-1042", item: "Desk", quantity: 1 };

// A factory. Each call is a new record, and the override says what the test is about.
const order = makeOrder({ quantity: 0 });
```

- **Return a complete, valid object** and let the caller override one field. A test reading `makeOrder({ quantity: 0 })` needs no other context to say what is under test.
- **Override, never branch.** A factory with `if (isAdmin)` inside it has become application logic; pass the shape you want.
- **Derive the type from the factory** (`ReturnType<typeof makeOrder>`) so it cannot drift — `playwright-naming-conventions`.
- **No randomness that changes the assertion.** A random quantity means a random expected total, and a failure nobody can reproduce. Randomise identity (names, emails), fix everything the test asserts on.

## Uniqueness

Unique values go on anything the app treats as identity — names, emails, SKUs, slugs, org names. A "unique" name that collides once a month is the flaky test nobody can reproduce, because the trace shows a perfectly valid duplicate-name error.

**A timestamp alone is not unique.** Two workers can start in the same millisecond, so `desk-${Date.now()}` collides exactly when the suite is at its most parallel. A random segment is what makes the collision negligible:

```ts
uniqueName("desk");                                  // desk-m2k9xq-7f3a1c
uniqueName("desk", test.info().parallelIndex);       // desk-w3-m2k9xq-7f3a1c
```

Passing the worker index is optional and worth it: it does not change the collision odds, but it makes a stray record traceable to the worker that created it, which turns a parallel-only failure into a five-minute diagnosis.

Keep the helper pure — the worker index is passed in, not read from `test.info()` inside it — so it stays usable from setup files and scripts, and stays in `helpers/` (`playwright-naming-conventions`).

Use plus-addressing (`e2e+<suffix>@example.test`) so every generated account is still reachable at one inbox, and a reserved domain (`.test`) so a stray signup email cannot reach a real person.

## Mark everything

```ts
{ item: "desk-3-m2k9", createdBy: "e2e" }
```

Every record the suite creates carries a marker. It costs one field and it buys three things: a crashed run can still be cleaned up by querying for the marker, a human looking at the test environment can tell test data from real data, and production can refuse it if it ever leaks in.

## The cleanup ladder

Clean at the narrowest scope that works, and always **through the API** — cleaning up through the UI doubles the runtime and fails whenever the UI is the thing that is broken.

| Scope | Use | Cleans |
|---|---|---|
| **Fixture teardown** (after `use()`) | The default. Runs even when the test fails. | What the fixture created |
| **`afterEach`** | Records the test body created ad hoc | That test's rows |
| **Teardown project** | Run-level state: a seeded tenant, a shared fixture account | Once, after everything |
| **Scheduled sweep** | Anything a crashed run left behind, found by marker | Yesterday's debris |

```ts
seededOrderId: async ({ api }, use) => {
  const id = await api.createOrder(makeOrder());
  await use(id);
  await api.deleteOrder(id);      // runs even if the test failed
},
```

The sweep is not optional at any real scale. Runs get cancelled, CI agents get killed, and a test environment that fills with orphans eventually makes every test slow and then flaky. A marker plus a nightly delete-older-than-a-day is the whole implementation.

**Never clean up by truncating shared tables.** One suite wiping what another suite is mid-way through creating is a race that is very hard to read from a trace.

## Determinism

A test that fails at 23:59, on the last day of a month, or only for a reviewer in another timezone is not flaky — it is reading the environment.

```ts
// playwright.config.ts — pin the environment for the whole suite.
use: { timezoneId: "UTC", locale: "en-GB" },
```

```ts
// Freeze time where the feature depends on it.
await page.clock.install({ time: new Date("2026-01-15T10:00:00Z") });
await page.clock.fastForward("01:00");
```

- **Pin timezone and locale in the config.** Dates, currency symbols, decimal separators, and sort order all move with them, and CI almost always runs UTC while the author does not.
- **Freeze the clock** for anything with a countdown, an expiry, a "3 days ago", or a date-boundary rule. Far better than waiting, and it is the only way to test the boundary itself.
- **Relative dates in factories, not literals.** `daysFromNow(7)` keeps working; `"2026-03-01"` becomes a past date and silently changes what the test covers.
- **Seed any randomness** the app itself uses, or stub it.
- **Assert on values the test created.** A test asserting "the first row" is asserting on sort order plus everyone else's data.

## What not to seed

Seeding is for reaching the state under test, not for replacing it:

- **Do not seed past the thing being tested.** Seeding a completed order to test checkout tests nothing.
- **Do not seed through the database** when an endpoint exists. A direct write skips validation and defaults, so the record differs from a real one in exactly the ways that cause a bug.
- **Do not reuse one seeded record across tests** to save time. That is a shared fixed record wearing a factory's clothes.

## Verify

- `npx playwright test --repeat-each=3 --workers=4` passes: no two tests collide on a name or a record.
- The full suite runs twice in a row against the same environment with no reset in between.
- After a run, a query for the `e2e` marker returns nothing.
- Killing a run mid-way leaves rows the sweep can find by marker.
- The suite passes with the machine clock set to 23:50 on the last day of a month, and in a non-UTC timezone.
- `grep -rnE "ORD-|@gmail|test@example.com" tests/ data/` finds no fixed identities.

## Rules

- No fixed record ids, emails, or names shared between tests.
- Every created record carries a marker and is deleted by the scope that created it.
- Cleanup goes through the API, never the UI, and never by truncating shared tables.
- Randomise identity; never randomise what the test asserts on.
- Timezone and locale pinned in the config; relative dates in factories.
- No test that only passes because the data was already there.
