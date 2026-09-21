---
name: playwright-test-strategy
description: Decide what belongs in an end-to-end suite and what does not — the cost of an e2e test versus a unit or integration test, risk-based coverage, tagging into smoke and regression tiers, how many tests a flow needs, when to delete a test, and the ownership and flaky-budget rules that keep a suite trusted. Use when planning e2e coverage, when the suite is slow or distrusted, when deciding whether a bug deserves a new test, or when asked how many tests a feature needs.
---

# Test strategy

Naming and folder placement are defined in `playwright-naming-conventions`.

An e2e test costs roughly a hundred times what a unit test costs to run, and more to maintain. That is worth paying where it buys confidence nothing else can, and nowhere else. **The failure mode is not too little coverage — it is a suite so slow and noisy that people merge on red.**

## What belongs in e2e

Put a test here when it crosses boundaries that only a real browser exercises:

- **Critical user journeys** — sign-in, checkout, the one flow that loses money when it breaks. Fully, end to end, every time.
- **Integration between the front end, the API, and persistence** — the wiring that unit tests mock away.
- **Flows across pages, redirects, sessions, and roles** — including what a user must *not* see.
- **Anything that broke in production.** A regression test at the level the bug reached the user.
- **Browser-specific behaviour** — file downloads, navigation, storage, print.

Keep it out when a cheaper test answers the same question:

| Question | Belongs in |
|---|---|
| Does this function compute the right value | Unit test |
| Does this component render each state | Component test |
| Does this endpoint validate input | API test — see `playwright-api-testing` |
| Does every field show the right error | Component or API test, not 12 e2e tests |
| Does the page look right | Visual test — see `playwright-visual-testing` |

**One path per flow through the UI.** The happy path of checkout is an e2e test. The fourteen validation branches are not: cover one representative failure in the UI, and the rest below.

## How many tests a feature needs

Ask what a failure would cost, and how else it would be caught. A feature that takes payments earns several e2e tests; a settings toggle earns zero if its component and API are tested. Coverage percentage is meaningless here — **count flows, not lines**.

Write the list of scenarios before writing any code, and cut it:

- Merge scenarios that differ only in data — one test, or a parameterised loop.
- Drop scenarios where a failure would already break a test you have.
- Keep every scenario that would let a real user lose money, data, or access.

## Tiers and tags

```ts
test("completes checkout @smoke", ...);
test("applies a discount code @regression", ...);
```

```bash
npx playwright test --grep @smoke        # every push, must be minutes
npx playwright test                      # merge and nightly
```

- **Smoke:** the handful of journeys that mean the app is up. Fast enough to run on every push.
- **Regression:** everything else, on merge and nightly.
- Tag by *risk*, not by feature area. `@slow`, `@flaky-quarantine`, and `@manual-data` are useful; `@login-page` is not — the file name already says that.
- `@mobile` is a real tier when the flow genuinely differs on a phone, and a waste when it is the same test at a narrower width — `playwright-mobile-web`.

## Keeping the suite trusted

- **A failure must mean something.** The moment a red run gets explained away as "probably flaky", the suite has stopped working. Fix it or delete it that week — see `playwright-flaky-tests`.
- **Zero flaky budget.** Track the `flaky` count in the report as a defect count, not a statistic.
- **Every test has an owner.** An unowned failing test gets skipped and stays skipped.
- **Delete tests.** A test covering a removed feature, duplicating another, or failing for six months is a liability. Deleting it is a legitimate, reviewable change.
- **Quarantine honestly.** `test.fixme()` with a ticket is honest; a retry that hides the failure is not.
- **Watch the runtime.** When the suite outgrows its CI window, shard before cutting coverage — but first check how much of it should have been unit tests.

## Tests an agent proposed

A generated plan makes the scenario list cheap, which makes cutting it the only work that matters. Everything above still decides what survives: name the risk, merge the data-only variants, and push field validation down to component or API tests. An agent explores what the app showed it, so the error, empty, expired, and permission cases are the ones you add by hand. See `playwright-agents`.

## Writing the test itself

Each test proves **one** thing, named in its title. Given the state, when the user acts, then this is true — expressed as `test.step` blocks that each close with an assertion (`playwright-test-architecture`).

Test what the user experiences, not how the app does it. A test that asserts on a CSS class, a store's internal shape, or a request body the user never sees will break on a refactor that changed nothing for anyone.

## Verify

- Every test in the suite maps to a user-visible risk you can name.
- The smoke tier runs in under five minutes.
- The last ten red runs were all real defects.
- No test has been skipped for more than one sprint.
- A new engineer can tell from the report which flow broke, without opening the code.

## Rules

- No e2e test for something a unit or component test proves.
- No test without a named risk it protects against.
- No permanently skipped tests — fix, quarantine with a ticket, or delete.
- A bug that reached production gets a regression test at the level it escaped.
