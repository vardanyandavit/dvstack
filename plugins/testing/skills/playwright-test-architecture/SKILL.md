---
name: playwright-test-architecture
description: Set up, restructure, or add to a Playwright suite — house folder layout, file and identifier naming, where each locator lives, page objects via fixtures, setup/teardown projects, and step-per-assertion spec shape. Ships copyable templates.
---

# Playwright test architecture

## Files

Copy from `files/`; do not retype them. Config (`playwright.config.ts`), `constants/` (routes, endpoints + intercept globs, shared selectors), `data/users.ts` (accounts behind getters), `helpers/` (`url.ts`, `unique.ts`), `pages/` (`base`, `login`, `dashboard`), `fixtures/` (`test.fixture.ts`, `index.ts` with `mergeTests`), `tests/` (`auth.setup.ts`, `global.teardown.ts`, reference `auth.spec.ts`).

## Layout

```
e2e/
├── playwright.config.ts   one config; environments differ by env vars only
├── constants/   fixed values, no logic (path builders allowed)
├── data/        accounts, payloads, factories; the only place that reads process.env
├── helpers/     pure functions — the moment one needs `page`, it is a page method or fixture
├── pages/       one class per screen, extends BasePage
├── fixtures/    one *.fixture.ts per concern, merged in index.ts — specs have one import
├── tests/       specs grouped by user-facing flow, plus *.setup.ts / *.teardown.ts
└── .auth/       storage state — gitignored, it is a credential
```

## Naming

- Files: kebab-case, lowercase, role suffix — `.spec.ts`, `.setup.ts`, `.teardown.ts`, `.page.ts`, `.fixture.ts`, `.factory.ts`. (Case-insensitive macOS hides import-casing bugs that fail on Linux CI.) `login.page.ts` exports `LoginPage`.
- Identifiers: `PascalCase` types/classes/enum members; `camelCase` values, functions, fixtures; `UPPER_SNAKE_CASE` only for module-level fixed primitives (`BASE_URL`); locator getters `getXxx()`; booleans `is/has/can`.
- Types: `type` over `interface`; derive (`ReturnType<typeof fn>`) or inline before declaring; export only if imported.
- Shared selectors: `as const` objects, not enums — `HeaderSelectors.UserMenu`.
- Titles: describe + test read as one sentence stating the outcome (*Sign in › rejects a wrong password*); steps name user intent, not mechanics; tags last, lowercase (`@smoke`).

## Where a locator lives

One definition per element, at the narrowest tier that covers its uses. Promote when a second caller appears, never pre-emptively.

1. Used once → inline in the page method.
2. Used twice on one page, or asserted on from a spec → `getXxx(): Locator` on the page object.
3. Used across pages → value in `constants/selectors.ts` (test id or accessible name, not CSS), wrapped by a getter. Shared chrome (toast, spinner, modal) → getter on `BasePage`.

A raw `page.locator(...)` in a spec is a second definition.

## Page objects and fixtures

- Methods are user intents (`signIn`), one each, and do not assert their own outcome — the spec does. Screen-level assertion helpers (`expectRejected`) are fine.
- No `test.step` inside page objects.
- Every page object is registered as a fixture; `new SomePage(page)` in a spec bypasses the pattern.

## Spec shape

```ts
test.describe("Feature", () => {
  test.beforeEach(async ({ somePage }) => { await somePage.goto(); });

  test("does the thing", async ({ somePage }) => {
    await test.step("first action", async () => {
      await somePage.act();
      await expect(somePage.getResult()).toBeVisible();
    });
  });
});
```

- Every test is `test.step` blocks; every step ends in an `expect` (what to wait on: `playwright-step-validation`).
- `beforeEach` = arrival state only. `beforeAll` = shared read-only setup. `afterEach` = cleanup through the API.
- Tests are independent and parallel-safe. Serial mode only for a genuine wizard.

## Setup and teardown

Use setup/teardown **projects**, not `globalSetup` — `globalSetup` gets no report, trace, fixtures, or `testIdAttribute`.

```ts
projects: [
  { name: "setup", testMatch: /.*\.setup\.ts/, teardown: "cleanup" },
  { name: "cleanup", testMatch: /global\.teardown\.ts/ },
  { name: "chromium", dependencies: ["setup"], testMatch: /.*\.spec\.ts/, use: { storageState: STORAGE_STATE } },
]
```

- `auth.setup.ts` signs in once per role, asserts the session, then saves state. The sign-in spec opts out with `test.use({ storageState: { cookies: [], origins: [] } })` and is the only spec that types a password.
- Browser projects need their own `testMatch` or they run the setup files as tests.
- Teardown is for run-level state only; per-test data is cleaned by the test.

## Verify

- Passes from a clean checkout with no `.auth/`, and `--repeat-each=3 --workers=4`.
- `npx tsc --noEmit` clean; `grep -rn "process.env" tests/ pages/` empty.
- The HTML report shows setup/cleanup projects and named steps with assertions.
