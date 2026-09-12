---
name: playwright-code-review
description: Review Playwright test code against test-automation standards, naming conventions, and clean-code rules — missing awaits on expect, waitForTimeout and manual waits, brittle selectors, tests with no assertion per step, committed test.only, assertions hidden in page objects, wrong file or identifier casing, hard-coded URLs and credentials, unused imports, any types, duplicated locators, and unclear test titles. Use when reviewing a PR that touches e2e tests, auditing an existing suite, or asked to check whether Playwright code follows good practice.
---

# Playwright code review

Naming rules referenced below are defined in `playwright-naming-conventions`.

Review in this order. The first group are defects — the test is wrong, or it is not testing anything. Everything after that is quality.

## Files

- `files/eslint.config.mjs` — the lint rules that catch the mechanical half of this list automatically. Install it in the project so a reviewer never spends attention on a missing `await` again.

## 1. Blockers — the test does not do what it claims

| Check | Why it is a blocker |
|---|---|
| `expect(...)` without `await` | The assertion never runs. The test passes forever, including when the feature is broken. |
| A `test.step` with no assertion | The step reports as passed for having executed. Every step must close with at least one `expect`. |
| A test with no assertion at all | It asserts only that nothing threw. |
| `test.only` committed | Skips the entire rest of the suite in CI. |
| `if (await x.isVisible())` around an assertion | A conditional assertion passes when the branch is not taken. The test no longer has a known expected outcome. |
| `try/catch` swallowing a failed action | Converts a failure into a pass. |
| Assertion inside a page object action method | Hides the check from the report and couples the page object to one scenario. Assertion *helpers* (`expectRejected`) are fine; a `signIn` that asserts is not. |
| A mocked endpoint the test never asserts on | Dead configuration pretending to be coverage. |

## 2. Stability

The validation each step owes is defined in `playwright-step-validation`.

- A step that ends without a validation, or whose only wait is a load state on a content-heavy page.
- `page.waitForTimeout` — replace with an assertion on the awaited state. No exceptions.
- `waitForLoadState("networkidle")` — replace with an assertion on the landing element.
- `isVisible()` / `textContent()` / `count()` used inside an assertion — non-retrying reads. Use `toBeVisible`, `toHaveText`, `toHaveCount`.
- `waitForSelector` where `expect(...).toBeVisible()` says the same thing.
- `force: true` — a forced click means the element was covered or disabled, which is what the test should be reporting.
- An event listener registered *after* its trigger: `await click()` then `waitForEvent("download" | "popup" | "filechooser")`. The event already fired; the test will time out. See `playwright-hard-interactions`.
- A `Promise.all` with the action listed before the wait — the array evaluates left to right, so the trigger fires before the listener exists.
- A screenshot assertion doing an assertion's job, or a masked region with no comment explaining why it is volatile.
- `ElementHandle` stored across re-renders — use locators, which re-resolve.
- `.first()` / `.nth()` used to silence a strict-mode violation rather than scoping the query.
- Shared state between tests: a fixed record id, a shared account, an order-dependent sequence. Verify with `--repeat-each=3 --workers=4`.
- `retries` raised, or `workers: 1` set, to keep a suite green.

## 3. Selectors

- CSS or XPath tied to structure — `nth-child`, generated class names, DOM depth. Replace with role, label, or text.
- A `data-testid` added where a role query would have worked; usually the element is missing an accessible name, and fixing that is the better change.
- The same element located in more than one place — inline twice, or a getter duplicated across page objects.
- A locator at the wrong tier: a `getXxx()` getter with one caller (inline it), an inline locator with two callers (promote it to a getter), or a getter repeated across pages (move the value to `constants/selectors.ts`).
- A raw `page.locator(...)` in a spec instead of on the page object.
- Raw CSS in `constants/selectors.ts` where a test id or accessible name would work.
- `getByText` without `exact` where the string is a substring of another.

## 4. Structure

- Page objects not injected through fixtures (`new SomePage(page)` inside a spec).
- `beforeEach` doing work that is under test, so a failure is attributed to setup rather than to the scenario.
- `beforeAll` mutating state shared across a worker.
- Cleanup done through the UI rather than the API, or missing entirely.
- Tests grouped by page instead of by user-facing flow.
- `test.describe.configure({ mode: "serial" })` used to paper over coupling rather than for a genuine wizard.
- Step titles describing mechanics ("click button") rather than intent ("submit valid credentials").
- Test titles that do not say the expected outcome. `"login"` is not a title; `"rejects a wrong password"` is.

## 5. Naming and placement

- File not kebab-case, or a `PascalCase` file name — passes on macOS, fails on Linux CI when an import's casing drifts.
- Wrong or missing role suffix: a page object without `.page.ts`, a fixture file without `.fixture.ts`.
- `UPPER_SNAKE_CASE` on a local `const`, `camelCase` on a type, an `I`-prefixed interface.
- A declared type that could be derived (`ReturnType<typeof fn>`) or inlined at its single use site, or an exported type nobody imports.
- A URL, endpoint, or credential inline in a spec instead of `constants/` or `data/`.
- `process.env` read from a spec or a page object rather than from `data/`.
- A "helper" that takes `page` — it is a page object method or a fixture.
- A test title that does not state the expected outcome, or a step title describing mechanics rather than intent.

## 6. Clean code

- Unused imports and variables.
- `any`, or missing return types on page object methods.
- Commented-out tests, and `test.skip` with no reason and no link.
- Hard-coded credentials, tokens, URLs, or environment-specific ids.
- Magic waits and magic numbers — name them or derive them.
- Copy-pasted setup across specs that belongs in a fixture.
- A helper used once, or a page object method that just forwards to a locator with no added meaning.
- Stub bodies inlined in a spec when they exceed a few lines.
- Comments restating the code. Comment the non-obvious *why* — a workaround, a known backend quirk.

## How to report it

Give file and line, say which of the six groups it falls in, and show the replacement as code. Lead with the blockers; a review that opens with unused imports buries the test that has been passing vacuously for three months.

Distinguish **"this is wrong"** from **"I would write it differently"**, and say which. Only the first group blocks a merge.

## Verify the review

- `npx eslint .` with `files/eslint.config.mjs` is clean.
- File names are all lowercase: `find . -name "*[A-Z]*.ts"` returns nothing.
- `npx tsc --noEmit` is clean.
- `grep -rnE "waitForTimeout|networkidle|test\.only|force: true" tests/ pages/` returns nothing.
- Every changed test still fails when the behaviour it covers is broken — the only real proof that an assertion works.
