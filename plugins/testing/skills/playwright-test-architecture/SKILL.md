---
name: playwright-test-architecture
description: Set up or restructure a Playwright end-to-end suite — folder layout for pages, fixtures, constants, data and helpers, where each locator belongs (inline, getter method, or shared constant), playwright.config.ts with setup and teardown projects, page objects injected through fixtures, describe/hook structure, and tests built from test.step blocks that each close with a web-first assertion. Use when starting Playwright in a project, adding the first e2e tests, reorganising an existing suite, or deciding where a page object, fixture, constant, or helper belongs.
---

# Playwright test architecture

File and identifier naming is defined once in `playwright-naming-conventions`. This skill decides *where things live* and *how a test is shaped*.

## Files

Copy from this skill's `files/` folder. Do not retype them from the description.

| File | What it is |
|---|---|
| `files/playwright.config.ts` | One config, environment-driven, with the setup and cleanup projects wired in |
| `files/constants/routes.ts` | Every UI path in one place |
| `files/constants/endpoints.ts` | Every API path, plus the glob patterns used to intercept them |
| `files/constants/selectors.ts` | Selectors shared across pages, grouped `as const` |
| `files/data/users.ts` | Test accounts behind getters, read from the environment |
| `files/helpers/url.ts` | `withQuery`, `pathOf`, `lastSegment` — pure functions |
| `files/helpers/unique.ts` | `uniqueName`, `uniqueEmail` for per-worker isolation |
| `files/pages/base.page.ts` | The base class every page object extends |
| `files/pages/login.page.ts`, `files/pages/dashboard.page.ts` | Two page objects: actions vs assertion helpers |
| `files/fixtures/test.fixture.ts` | Page objects as fixtures |
| `files/fixtures/index.ts` | `mergeTests` — the one import every spec uses |
| `files/tests/auth.setup.ts` | Signs in once, saves storage state |
| `files/tests/global.teardown.ts` | Cleans up run-level state |
| `files/tests/auth.spec.ts` | The reference spec: describe, hooks, steps, an assertion per step |

## Layout

```
e2e/
├── playwright.config.ts
├── constants/     routes.ts, endpoints.ts,      — paths, shared selectors, fixed
│               selectors.ts                    values; no logic
├── data/          users.ts, order.factory.ts   — test data and builders
├── helpers/       url.ts, unique.ts            — pure functions, no `page`, no `expect`
├── pages/         base.page.ts, login.page.ts  — one class per screen
├── fixtures/      index.ts, test.fixture.ts    — everything injected into tests
├── tests/         auth.setup.ts, auth.spec.ts  — specs and runner setup files
└── .auth/         storage state — gitignored
```

Group specs by user-facing feature (`checkout.spec.ts`), never by page or by layer. A test file answers "does this flow work", so it crosses screens by design.

Where something belongs, in one line each: **constants** never change, **data** is what the test acts on, **helpers** are pure functions, **pages** own locators and intents, **fixtures** are what gets injected, **tests** are scenarios.

## Set it up

1. **Install and scaffold.** `npm init playwright@latest` for a new project, then replace the generated config with `files/playwright.config.ts` and copy the folders above.
2. **Point the config at the app.** `BASE_URL` comes from the environment with a local default, so the same suite runs against local, preview, and staging with no code change. Keep `webServer` only if the suite starts the app itself.
3. **Move every path into `constants/`.** A URL written inline in a spec is the first thing that rots. Page objects take their path from `routes`, and mocks take their pattern from `endpointPatterns`.
4. **Put accounts in `data/users.ts`.** Getters, not plain properties, so a missing variable fails in the test that needs the account rather than at import time in every file. Never read `process.env` from a spec.
5. **Write page objects.** Methods are user intents (`signIn`, `openUserMenu`), one intent each, and they do not assert on their own outcome — the test owns that. Compound checks belonging to the screen rather than to one test (`expectRejected`) live on the page object. Where each locator goes is decided by how often it is used — see below.
6. **Register every page object in `fixtures/test.fixture.ts`.** A spec that writes `new SomePage(page)` has bypassed the pattern. Each further concern gets its own `*.fixture.ts` and is merged in `fixtures/index.ts` with `mergeTests`, so specs keep a single import line. Worker-scoped, auto, and option fixtures are covered in `playwright-fixtures`.
7. **Keep helpers pure.** The moment a function needs `page`, it is a page object method or a fixture, not a helper.
8. **Structure the spec** exactly as `auth.spec.ts` does — see below.

## Where a locator goes

Three tiers, decided by how many places use the element. Locators are lazy, so none of this costs anything at runtime — it is about having exactly one definition per element, at the narrowest scope that covers its uses.

**1. Used once → inline in the method that needs it.** No getter, no field.

```ts
async signIn(email: string, password: string): Promise<void> {
  await this.page.getByLabel("Email").fill(email);
  await this.page.getByLabel("Password").fill(password);
  await this.getSubmitButton().click();
}
```

**2. Used more than once, on one page → a `getXxx()` getter on the page object.** That covers reuse inside the class *and* assertions from a spec, which is the common case: anything a test asserts on needs a getter.

```ts
getSubmitButton(): Locator {
  return this.page.getByRole("button", { name: "Sign in" });
}
```
```ts
await expect(loginPage.getSubmitButton()).toBeEnabled();
```

**3. Used across pages → the value goes in `constants/selectors.ts`,** grouped `as const`, and the page object wraps it:

```ts
export const HeaderSelectors = {
  UserMenu: "header-user-menu",
  SignOut: "header-sign-out",
} as const;
```
```ts
getUserMenu(): Locator {
  return this.page.getByTestId(HeaderSelectors.UserMenu);
}
```

Constants hold **`data-testid` values or accessible names**, not raw CSS — the page object turns them into `getByTestId` / `getByRole`, so the locator rules in `playwright-locators` still apply. A raw CSS string goes here only where the markup leaves no choice, with a comment saying why. Chrome shared by every screen (toast, spinner, modal) gets its getter on `BasePage` instead of being repeated.

Promote a locator up a tier the moment a second caller appears; never pre-emptively, and never leave two definitions of the same element behind.

## Test structure

```ts
test.describe("Feature", () => {
  test.beforeEach(async ({ somePage }) => { await somePage.goto(); });

  test("does the thing", async ({ page, somePage }) => {
    await test.step("first action", async () => {
      await somePage.act();
      await expect(somePage.result).toBeVisible();   // step ends in an assertion
    });
  });
});
```

Rules that make this work:

- **`describe` per feature or flow.** The title plus the test title should read as a sentence in the report.
- **`beforeEach` for arrival state only** — navigate, seed data, set a feature flag. Anything under test belongs in the test body where a failure is attributed correctly.
- **`beforeAll` only for genuinely shared, read-only setup.** It runs once per worker, so anything it mutates leaks between tests.
- **`afterEach` for cleanup the test cannot leave behind** — created records, uploaded files. Clean up through the API, not the UI (`playwright-api-testing`).
- **Every test is a sequence of `test.step` blocks**, and **every step ends with at least one `expect`**. Navigate, then assert the landing element is visible. Click, then assert the next element appeared *and* the previous one is hidden. A step with no assertion proves nothing and reports as passed.
- **Steps are named for user intent**, not mechanics: "submit valid credentials", not "click button".
- **Assert with web-first matchers** — `toBeVisible`, `toHaveText`, `toHaveURL`, `toBeEnabled`. They retry until the expect timeout, which is what makes the suite stable. See `playwright-locators` and `playwright-flaky-tests`.
- **Tests are independent.** Each one can run alone, in any order, in parallel. Serial mode (`test.describe.configure({ mode: "serial" })`) is a last resort for a genuine wizard, never a fix for shared state.

## Global setup and teardown

Use **setup and teardown projects**, not `globalSetup` / `globalTeardown`. Playwright recommends project dependencies for this, and the reason is concrete: `globalSetup` functions do not appear in the HTML report, cannot record traces, cannot use fixtures, get no `browser` fixture, and ignore config options such as `testIdAttribute`. When a setup written that way breaks, there is nothing to debug from.

```ts
projects: [
  { name: "setup", testMatch: /.*\.setup\.ts/, teardown: "cleanup" },
  { name: "cleanup", testMatch: /global\.teardown\.ts/ },
  { name: "chromium", dependencies: ["setup"], testMatch: /.*\.spec\.ts/, use: { storageState: STORAGE_STATE } },
]
```

- `auth.setup.ts` signs in once and writes storage state; browser projects declare `dependencies: ["setup"]` and start signed in. Sign-in keeps its own spec, which opts out with `test.use({ storageState: { cookies: [], origins: [] } })`.
- `global.teardown.ts` runs after everything that depends on the setup project finishes. It is for run-level state only — a seeded tenant, a shared fixture account. Anything one test created belongs in that test's `afterEach`, so a crashed run does not leave it behind.
- Browser projects need their own `testMatch`, or they pick up the setup and teardown files as ordinary tests.
- Reach for `globalSetup` only for work that must happen before the runner starts and needs no browser or fixtures — starting a mock server, generating a `.env`. Everything else is a project.

## Verify

- `npx playwright test` passes from a clean checkout with no `.auth/` present.
- `npx playwright test tests/auth.spec.ts:12` — a single test passes on its own.
- `npx playwright test --repeat-each=3 --workers=4` passes: no order or state coupling.
- The HTML report shows the setup and cleanup projects, named steps under each test, and assertions inside each step.
- `npx tsc --noEmit` is clean: locators and fixtures are typed, with no `any`.
- `grep -rn "process.env" tests/ pages/` returns nothing — environment access is confined to `constants/` and `data/`.

## Rules

- No `page.waitForTimeout`. Ever. Assert on the state you are waiting for instead.
- One definition per element. A locator written inline twice must become a getter; a getter duplicated across pages must move to `constants/selectors.ts`.
- No assertions inside page object action methods, and no `test.step` inside page objects — steps belong to the spec, where they describe the scenario.
- No conditional assertions (`if (await x.isVisible())`). A test that branches on the app's state has stopped testing a known outcome.
- No URL, endpoint, credential, or magic value inline in a spec. It belongs in `constants/` or `data/`.
- No test data shared between tests. Create what a test needs inside it, or through a fixture that creates it per test.
- One config. Environments differ by variables, not by `playwright.staging.config.ts`.
