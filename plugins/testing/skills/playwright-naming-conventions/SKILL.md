---
name: playwright-naming-conventions
description: The naming and file-layout rules for a TypeScript Playwright suite — kebab-case file names with role suffixes (.spec.ts, .page.ts, .fixture.ts), PascalCase for classes and types, when to declare a type at all versus derive or inline it, camelCase for functions and variables, UPPER_SNAKE_CASE for module constants, plus where constants, data, helpers, pages, and fixtures each belong. Use when naming or renaming a file, class, fixture, or constant in a test suite, when deciding which folder something goes in, or when reviewing naming in a PR.
---

# Naming conventions

The single reference for every other Playwright skill in this plugin. Identifier rules follow the TypeScript team's own coding guidelines; file rules follow what Playwright's runner already forces on you.

## Files

**kebab-case, always lowercase.** Multi-word: `order-details.page.ts`, not `orderDetails.page.ts` and not `OrderDetails.page.ts`.

The reason is not taste. macOS and Windows filesystems are case-insensitive, Linux CI is not, so a `PascalCase` file imported with the wrong casing passes locally and fails only in CI. Lowercase file names make that mistake impossible. Playwright's own documentation uses kebab-case (`playwright-dev-page.ts`), and the runner already forces `.spec.ts` on you — PascalCase files would leave the suite half in one style and half in the other.

**A dot suffix marks the role.** Use one only for the roles that have a meaning to the runner or to a reader scanning a file list:

| Suffix | For | Example |
|---|---|---|
| `.spec.ts` | Test files. Matched by `testMatch` | `checkout.spec.ts` |
| `.setup.ts` | Setup projects | `auth.setup.ts` |
| `.teardown.ts` | Teardown projects | `global.teardown.ts` |
| `.page.ts` | One page object class | `order-details.page.ts` |
| `.fixture.ts` | One group of fixtures | `network.fixture.ts` |
| `.factory.ts` | A test-data builder | `order.factory.ts` |

Everything else is a plain kebab-case name inside a folder that already says what it is: `constants/routes.ts`, `helpers/url.ts`, `data/users.ts`.

**The file name does not have to match the class name.** `login.page.ts` exports `LoginPage` — file names follow file convention, identifiers follow identifier convention. They are different namespaces, and TypeScript places no requirement on either.

## Folders

```
e2e/
├── playwright.config.ts
├── constants/     routes.ts, endpoints.ts      — paths and fixed values, no logic
├── data/          users.ts, order.factory.ts   — test data and builders
├── helpers/       url.ts, unique.ts            — pure functions, no `page`, no `expect`
├── pages/         base.page.ts, login.page.ts  — one class per screen
├── fixtures/      index.ts, test.fixture.ts    — everything injected into tests
└── tests/         auth.setup.ts, auth.spec.ts  — specs and runner setup files
```

What decides the folder:

- **`constants/`** — values that never change at runtime: UI routes, API endpoints and their glob patterns, selectors shared across pages, timeouts with a name, feature-flag keys. No functions except path builders (`order: (id) => ...`).
- **`data/`** — what a test acts *on*: accounts, payloads, factories producing unique records. Anything read from the environment lives here behind a getter, never re-read from `process.env` in a spec.
- **`helpers/`** — pure TypeScript, importable anywhere, with no Playwright objects in the signature. `withQuery`, `pathOf`, `uniqueName`. The moment a function needs `page`, it is a page object method or a fixture, not a helper.
- **`pages/`** — one class per screen, extending `BasePage`.
- **`fixtures/`** — one `*.fixture.ts` per concern, composed in `index.ts` with `mergeTests`, so every spec has one import line.
- **`tests/`** — specs grouped by user-facing flow, plus `*.setup.ts` and `*.teardown.ts`.

## Identifiers

| Kind | Convention | Example |
|---|---|---|
| Class, type alias, enum | `PascalCase` | `LoginPage`, `TestUser`, `UserRole` |
| Enum member | `PascalCase` | `UserRole.Admin` |
| Function, method, fixture name | `camelCase`, verb first | `signIn`, `uniqueEmail`, `mockApi` |
| Variable, parameter, property | `camelCase` | `orderId`, `loginPage` |
| Locator getter | `get` + element name, `camelCase` | `getSubmitButton()`, `getErrorMessage()` |
| Selector constant group | `PascalCase` name, `PascalCase` keys | `HeaderSelectors.UserMenu` |
| Module-level fixed primitive | `UPPER_SNAKE_CASE` | `BASE_URL`, `STORAGE_STATE` |
| Exported lookup object | `camelCase`, `as const` | `routes`, `endpoints`, `users` |
| Boolean | `is` / `has` / `can` prefix | `isVisible`, `hasError` |
| Type parameter | single capital, or `PascalCase` | `T`, `TResponse` |
| File-private helper | `camelCase`, not exported | `requireEnv` |

`UPPER_SNAKE_CASE` is for a module-level primitive that is fixed for the whole run. A `const` inside a function is `camelCase` even though it cannot be reassigned — `const orderId = ...` is a variable, not a constant.

## Types

**Declare a type only when it cannot be inferred, and prefer `type` over `interface`.** A type alias does everything an interface does for object shapes, in fewer lines, and it also composes with unions, intersections, and utility types. Keep `interface` for the rare case you actually want declaration merging or a class `implements` contract.

Most type declarations in a test suite are not needed at all:

```ts
// Three lines that can drift from the value they describe.
export type TestUser = { email: string; password: string; role: UserRole };
export const users = { ... };

// Derived from the value, so it cannot drift.
export type TestUser = ReturnType<typeof user>;
```

Inline a one-use type instead of naming it — fixture shapes are the common case:

```ts
export const test = base.extend<{ loginPage: LoginPage; dashboardPage: DashboardPage }>({ ... });
```

Name a type when it appears in more than one signature, or when the name carries meaning the shape does not (`UserRole`, `TestUser`). Derive rather than declare: `ReturnType<typeof fn>`, `(typeof obj)[keyof typeof obj]`, `Awaited<...>`.

`export` a type only when another file imports it. An exported type nobody imports is the same dead code as an unused function.

## Selector constants

Selectors used by more than one page object or spec are grouped in `constants/selectors.ts` as `as const` objects — `PascalCase` group name, `PascalCase` keys, so `HeaderSelectors.UserMenu` reads like an enum member:

```ts
export const HeaderSelectors = {
  UserMenu: "header-user-menu",
  SignOut: "header-sign-out",
} as const;
```

Use an `as const` object rather than a TypeScript `enum`. It produces the same call site, adds no runtime code, and works under `isolatedModules` and `verbatimModuleSyntax`, where `const enum` does not. Derive the union with `(typeof HeaderSelectors)[keyof typeof HeaderSelectors]` when a function needs to accept one.

Name the group after what owns the elements (`HeaderSelectors`, `CommonSelectors`), and the key after the element (`UserMenu`), never after the markup (`DivWrapper2`).

## Titles

Test titles are prose, not identifiers. Sentence case, no prefix codes, and they must state the expected outcome:

```ts
test.describe("Sign in", () => {              // the feature
  test("rejects a wrong password", ...)       // the outcome, not "test login 2"
  await test.step("submit valid credentials") // user intent, not "click button"
});
```

`describe` title + test title should read as one sentence in the report: *Sign in › rejects a wrong password*.

Tags go at the end and are lowercase: `test("loads the dashboard @smoke", ...)`.

## Verify

- `ls` in any folder shows one casing style, all lowercase.
- No file name repeats its folder: `pages/login.page.ts`, not `pages/login-page-object.page.ts`.
- `grep -rn "^export interface" .` is empty or justified: types are `type`, and most are derived rather than declared.
- A class name can be read off its file name, and the file name off its class name, without ambiguity.
- The HTML report reads as sentences.

## Rules

- One casing style per namespace: files kebab, types Pascal, values camel, module constants upper.
- No abbreviations that are not already domain words. `orderId` yes, `ordId` no.
- No `Test`, `Utils`, or `Manager` in a name that already sits in a test suite. `helpers/url.ts`, not `helpers/UrlTestUtils.ts`.
- Rename with the IDE, never by hand: a stale import that differs only in case survives on macOS and dies in CI.
