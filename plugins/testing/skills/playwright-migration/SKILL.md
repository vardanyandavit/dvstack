---
name: playwright-migration
description: Move an existing Cypress, Selenium, WebdriverIO, or Protractor suite to Playwright without carrying its habits across — the API mapping tables, the assumptions that break (implicit waits, chained jQuery selectors, one-browser-one-test, custom commands, page-object god classes), running both suites during the change, what to port versus rewrite versus delete, and the order that keeps the team covered throughout. Use when asked to migrate or evaluate migrating an e2e suite, when a ported test is flaky in Playwright, or when deciding what to do with a legacy suite nobody trusts.
---

# Migrating to Playwright

Naming and folder placement are defined in `playwright-naming-conventions`; the target shape is `playwright-test-architecture`.

The mistake is treating this as a translation job. **A ported suite inherits the reason the old one was distrusted** — the sleeps, the retry wrappers, the shared login, the tests nobody can name a risk for. Migration is the one moment when deleting them is free, and it does not come again.

Start from the assumption that **a third of the old suite should not be ported at all.**

## Decide first: port, rewrite, or delete

Go test by test before writing any code. It is faster than it sounds, and it is the whole value of the exercise.

| The old test | Do |
|---|---|
| Covers a critical journey, passes reliably | **Port** — mechanical translation |
| Covers a real risk but is flaky or unreadable | **Rewrite** from its intent, not its code |
| Duplicates another test, or differs only in data | **Delete** / merge |
| Covers a removed feature, or has been skipped for months | **Delete** |
| Tests a pure function, a single component, or field validation | **Delete** — it belongs below e2e (`playwright-test-strategy`) |
| Nobody can name the risk it protects | **Delete** |

Write that decision next to each test before starting. A migration without this list becomes a line-by-line port, and the team ends up maintaining the old suite's problems in a new syntax.

## What changes conceptually

These four differences cause nearly every "the ported test is flaky" report:

1. **Assertions retry; the runner does not sleep.** Playwright's web-first matchers re-check until the timeout. Every `cy.wait(2000)`, `Thread.sleep`, `browser.pause`, and implicit-wait setting is deleted outright, not translated — `playwright-step-validation`.
2. **Locators are lazy, not resolved.** A Playwright locator re-resolves on every use, so the stale-element exception that Selenium suites are built around does not exist. Delete the retry wrappers, the `StaleElementReferenceException` catches, and the "find it again" helpers.
3. **Strict mode is on.** A selector matching two elements fails instead of silently taking the first. This surfaces real ambiguity that the old suite was hiding — scope the query, do not add `.first()` (`playwright-locators`).
4. **Tests are isolated by default.** Each gets a fresh browser context: new cookies, new storage. Suites built on "log in once in a before-all and stay logged in" get storage state instead (`playwright-auth-and-roles`), and suites relying on leftover state from test 3 get their data seeded (`playwright-test-data`).

## From Cypress

| Cypress | Playwright |
|---|---|
| `cy.visit(url)` | `await page.goto(url)` |
| `cy.get(".btn").click()` | `await page.getByRole("button", { name: "..." }).click()` |
| `cy.contains("Save")` | `page.getByText("Save")` |
| `cy.get(...).should("be.visible")` | `await expect(locator).toBeVisible()` |
| `cy.get(...).should("have.text", t)` | `await expect(locator).toHaveText(t)` |
| `cy.intercept("GET", url, body)` | `await page.route(pattern, (r) => r.fulfill({ json: body }))` |
| `cy.wait("@alias")` | `await page.waitForResponse(pattern)` — registered **before** the action |
| `cy.request(...)` | `await request.get(...)` (`playwright-api-testing`) |
| `Cypress.Commands.add(...)` | A fixture (`playwright-fixtures`) |
| `cy.fixture("x.json")` | An import from `data/` |
| `beforeEach(() => cy.login())` | A setup project + storage state |

What actually bites:

- **No implicit chaining.** Cypress commands queue; Playwright calls are promises. **Every one is awaited** — a missing `await` on an `expect` makes the test pass forever, which is why `@typescript-eslint/no-floating-promises` is in this plugin's ESLint config.
- **`cy.wait("@alias")` translates to registering the wait first.** Awaiting the action and then the response is the most common ported race — `playwright-step-validation`.
- **Custom commands become fixtures**, not helpers on a global. A one-to-one port into `helpers/` recreates the global-namespace problem in TypeScript.
- **jQuery selectors have no equivalent, deliberately.** `cy.get(".card > div:nth-child(2)")` is a rewrite to a role or test-id query, not a translation.
- **Cypress's `.should()` retries the chain; Playwright's `expect` retries the matcher.** Anything doing real work inside `.should()` becomes `expect.poll()` or `expect(async () => {...}).toPass()`.

## From Selenium / WebdriverIO / Protractor

| Selenium-family | Playwright |
|---|---|
| `driver.findElement(By.id("x"))` | `page.locator("#x")` — then rewrite to a role query |
| `WebDriverWait(...).until(EC.visible(...))` | `await expect(locator).toBeVisible()` |
| Implicit wait / `setScriptTimeout` | Delete. Config timeouts replace all of it. |
| `driver.switchTo().frame(...)` | `page.frameLocator("#frame")` |
| `driver.switchTo().alert().accept()` | `page.once("dialog", (d) => d.accept())` — **before** the trigger |
| `driver.switchTo().window(handles[1])` | `const popup = await popupFrom(page, () => ...)` |
| `Actions().dragAndDrop(a, b)` | `await a.dragTo(b)` (`playwright-hard-interactions`) |
| `driver.getScreenshotAs(...)` | `await expect(page).toHaveScreenshot()` |
| `driver.manage().addCookie(...)` | `storageState`, set once in a setup project |
| TestNG / JUnit groups | Tags — `test("... @smoke")` |
| Grid + one browser per test | Projects and workers; the grid goes away |

What actually bites:

- **The waiting layer is dead code.** Delete the `WebDriverWait` wrapper, the custom `waitForElement`, and the retry decorator. Porting them re-creates the flakiness in a framework designed to remove it.
- **Page-object god classes.** Selenium suites often hold one class per screen with fifty methods, assertions inside, and a `driver` passed everywhere. Split by intent, move assertions to the spec, and inject through fixtures — `playwright-test-architecture`.
- **XPath is the default in Selenium and banned here.** Every `//div[@class='x']/span[2]` is a rewrite. This is the single largest chunk of the work, and the largest chunk of the payoff.
- **Thread/driver lifecycle disappears.** No driver setup, teardown, or parallel-safety plumbing: the runner owns it.
- **Language change, if the old suite is Java, C#, or Python.** Do not let it become an idiom port — read `playwright-naming-conventions` before the first file.

## The order that keeps you covered

1. **Stand the new suite up empty**, with the real config, fixtures, and CI job — `playwright-test-architecture` and `playwright-ci`. Nothing ported yet.
2. **Port the smoke tier first**, rewritten rather than translated. A handful of critical journeys, green and trusted, is the proof the setup is right.
3. **Run both suites in CI**, with the old one non-blocking. Never delete a test before its replacement has passed on `main`.
4. **Migrate by feature, not by file.** One flow at a time, its old tests deleted in the same PR that adds the new ones — otherwise both suites live forever.
5. **Delete the old suite, its dependencies, and its CI job** in one PR at the end. A dormant suite still gets "fixed" by someone.
6. **Take the reports with you.** The old suite's flaky list is a list of the app's real races; the ones that are product bugs are worth fixing now.

**Do not run both suites blocking at once.** Two red pipelines for one bug is how migrations stall.

## Verify

- Every old test has a recorded decision: ported, rewritten, or deleted with a reason.
- `grep -rnE "waitForTimeout|sleep\(|implicitly_wait|Thread\.sleep" tests/` returns nothing.
- `grep -rnE "xpath=|//div|nth-child" tests/ pages/` returns nothing.
- The new suite passes `--repeat-each=3 --workers=4` from a clean checkout.
- No test in the new suite reuses state from another — each passes when run alone.
- The old CI job, its config, and its dependencies are gone from the repo.
- The new suite's runtime and flaky count are both reported and both lower.

## Rules

- Never port a sleep, an implicit wait, or a retry wrapper. Delete it and assert instead.
- Never port a structural selector. Rewrite it as a role, label, or test-id query.
- Never port a test nobody can name a risk for.
- Custom commands become fixtures, not global helpers.
- Delete an old test only in the PR that adds its replacement.
- One blocking pipeline at a time.
