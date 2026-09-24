---
name: playwright-code-review
description: House rules for writing and reviewing Playwright tests — severity-ordered review checklist, per-area rules (auth, data, mocking, a11y, visual, mobile, CI, migration), and review of agent-generated or healed diffs. Ships an ESLint config.
---

# Playwright code review and house rules

Structure and naming: `playwright-test-architecture`. Waits and flakiness: `playwright-step-validation`.

## Files

`files/eslint.config.mjs` — catches floating `expect`, `waitForTimeout`, `networkidle`, `test.only`, and more. Install it so review never spends attention on those.

## Review order

Report file:line, the group, and the replacement as code. Lead with blockers. Say whether each finding is "wrong" (blocks) or "I'd write it differently" (does not).

**1. Blockers — the test does not test what it claims**
- `expect` without `await`; a step or test with no assertion; committed `test.only`.
- Conditional assertion (`if (await x.isVisible())`); `try/catch` swallowing a failure.
- Assertion inside a page-object action method.
- A mocked endpoint never asserted on; mocking the very thing under test.

**2. Stability** — per `playwright-step-validation`: any hard-coded wait, `networkidle`, non-retrying read in an assertion, listener registered after its trigger, `Promise.all` with action first, `force: true`, `.first()` silencing strict mode, shared records/accounts, `Date.now()`-only unique values, unpinned timezone/locale on date/currency/sort assertions, retries or `workers: 1` raised to go green.

**3. Selectors** — role > label > text > test id; no structural CSS/XPath or generated classes. A `data-testid` where a role would work means the markup lacks an accessible name — fix the markup. One definition per element at the right tier; no raw `page.locator` in specs; `getByText` needs `exact` when the string is a substring.

**4. Structure and naming** — per `playwright-test-architecture`: `new SomePage(page)` in a spec, `beforeEach` doing work under test, cleanup through the UI, tests grouped by page instead of flow, mechanical step titles, titles without an outcome, wrong casing or suffix, inline URL/credential/`process.env`, committed `.auth/` or token.

**5. Clean code** — unused imports, `any`, commented-out tests, `test.skip` with no reason or link, magic numbers, copy-pasted setup that belongs in a fixture, inline stub bodies beyond a few lines, comments restating code.

## House rules by area

- **Auth**: sign in through the UI only in `auth.setup.ts` and the sign-in spec. One storage state per role, named for permissions (`admin`, `viewer`), picked with `test.use` at file/describe scope. Tests that mutate the account get their own data or per-worker accounts. Never automate a third-party login or a real second factor. Negative permission tests assert the **API** (403), not just a hidden button.
- **Data**: factories with overrides, no fixed ids/emails shared between tests. Unique by `parallelIndex` + randomness, not `Date.now()` alone. Every seeded record carries a marker (`createdBy: "e2e"`) and is deleted by the scope that created it, through the API. Randomise identity, never what is asserted. Never pass on pre-existing data or "the first row".
- **API setup**: reach preconditions through the API, assert through the UI. Something that must persist is verified at the API, not by a success toast. One client module per endpoint set; specs do not call endpoints ad hoc.
- **Mocking**: `route.fulfill` with the real status (a 500 is not `route.abort()`); stub files, not inline blobs; block third-party scripts. Never mock the thing the test exists to verify.
- **Fixtures**: fixture over hook for reusable setup; worker scope only for expensive read-only resources, never mutated; everything created is cleaned after `use()`; one concern per fixture.
- **Accessibility**: axe scans states, not URLs; an axe pass is not "accessible"; every exclusion has a ticket and comment; keyboard/focus tests are ordinary specs.
- **Visual**: screenshots only where an assertion cannot answer; baselines generated in CI's OS; animations off, clock frozen, volatile regions masked with a comment; never `--update-snapshots` suite-wide to go green.
- **Mobile**: spread the full device descriptor; `tap()` only where touch differs; never report emulation as device coverage.
- **CI**: shard plus merged blob report; traces/report uploaded even on failure; no secrets or base URLs committed.
- **Strategy**: no e2e for what a unit or component test proves; every test names the risk it protects; no permanent skips; an escaped bug gets a regression test at the level it escaped.
- **Migration** (Cypress/Selenium): never port a sleep, implicit wait, retry wrapper, or structural selector; custom commands become fixtures; delete an old test only in the PR that adds its replacement.

## Agent-written and healed diffs

Generated tests get the same review. For healed tests, review **what was removed**:

- Assertion deleted, or weakened (`toHaveText`→`toContainText`, `toBeVisible`→`toBeAttached`, count → `not.toHaveCount(0)`).
- Timeout raised, retry, `test.slow()`, `waitForTimeout`, `force`, `.first()`, or a conditional added around the failing line.
- Assertions matching today's data rather than data the test created.
- Healed on `main`/CI rather than in a reviewed PR — a process defect.

A red test is a claim about the product. Changing the test is right only when the claim was wrong; the PR names the product change that made it wrong.

## Verify the review

- `npx eslint .` with `files/eslint.config.mjs` and `npx tsc --noEmit` clean.
- `grep -rnE "waitForTimeout|networkidle|test\.only|force: true" tests/ pages/` empty.
- Changed tests fail when their behaviour is broken; healed diffs lose no assertions.
