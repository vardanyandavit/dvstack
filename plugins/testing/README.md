# DVstack Testing

Playwright-focused end-to-end testing skills. Every skill carries a working config, fixture, or spec that the agent copies into the project, so the standard arrives as code rather than as prose.

The fifteen skills are written to work together: naming conventions and architecture set the vocabulary, and the rest reference them.

## Skills

**Foundations**

| Skill | Covers | Ask for it with |
|---|---|---|
| [playwright-naming-conventions](skills/playwright-naming-conventions/) | kebab-case files with role suffixes, PascalCase types, camelCase values, `UPPER_SNAKE_CASE` module constants, when to declare a type at all, and which folder anything belongs in | "what should I call this file" |
| [playwright-test-architecture](skills/playwright-test-architecture/) | Folder layout, `playwright.config.ts`, setup and teardown projects, page objects through fixtures, where each locator belongs, `test.step` with an assertion closing every step | "set up Playwright" |
| [playwright-test-strategy](skills/playwright-test-strategy/) | What belongs in e2e versus unit or API, risk-based coverage, smoke and regression tiers, when to delete a test, flaky budget | "how many tests does this need" |
| [playwright-fixtures](skills/playwright-fixtures/) | Test vs worker scope, auto fixtures, option fixtures, setup/teardown around `use()`, merging fixture files, test locks | "this setup is repeated everywhere" |

**Writing tests**

| Skill | Covers | Ask for it with |
|---|---|---|
| [playwright-step-validation](skills/playwright-step-validation/) | Zero hard-coded timeouts, the validation ladder — locator state, then `waitForResponse` with method and status, then response plus rendered UI, then `waitForLoadState` on quiet pages only | "what should this step wait for" |
| [playwright-locators](skills/playwright-locators/) | Role-first locator order, `data-testid` policy, strict-mode scoping, web-first assertions | "fix these selectors" |
| [playwright-api-testing](skills/playwright-api-testing/) | `request` fixture, seeding state through the API instead of the UI, `toBeOK`, cleanup, where the API/UI boundary belongs | "setup is slow because it clicks through the UI" |
| [playwright-network-mocking](skills/playwright-network-mocking/) | `page.route`, stubbing JSON, forcing errors, deferring responses for loading states, what not to mock | "test the error state" |
| [playwright-hard-interactions](skills/playwright-hard-interactions/) | iframes, shadow DOM, dialogs, popups, uploads and downloads, drag and drop, clipboard, date pickers, virtualised lists, canvas, frozen time | "this element can't be clicked" |

**Quality gates**

| Skill | Covers | Ask for it with |
|---|---|---|
| [playwright-accessibility-testing](skills/playwright-accessibility-testing/) | `@axe-core/playwright` with WCAG tags, aria snapshots, keyboard and focus tests, what cannot be automated | "add a11y checks" |
| [playwright-visual-testing](skills/playwright-visual-testing/) | `toHaveScreenshot`, masking, animation and font determinism, per-platform snapshots, update policy | "set up visual regression" |
| [playwright-code-review](skills/playwright-code-review/) | Review checklist ordered by severity, from vacuous assertions down to unused imports, plus the ESLint config that automates half of it | "review these tests" |

**Running and fixing**

| Skill | Covers | Ask for it with |
|---|---|---|
| [playwright-debugging](skills/playwright-debugging/) | UI mode, trace viewer, codegen, `--debug`, `page.pause()`, attachments | "why did this fail" |
| [playwright-flaky-tests](skills/playwright-flaky-tests/) | Trace triage, replacing sleeps with assertions, state isolation, honest retry policy | "this test is flaky" |
| [playwright-ci](skills/playwright-ci/) | Sharding, browser caching, merged blob reports, traces as artifacts, secrets per environment | "add e2e to CI" |

## Conventions these skills enforce

- **Page objects + fixtures.** Intents live on the page object; the page object reaches the test through `test.extend`. A spec never calls `new`.
- **One definition per element, at the narrowest scope.** Used once: inline in the method. Used twice or asserted on from a spec: a `getXxx()` getter. Used across pages: the value goes in `constants/selectors.ts` and the page object wraps it.
- **A step is a step only if it asserts.** Every test is a sequence of `test.step` blocks and every block closes with at least one web-first `expect` — navigate then assert the landing element, click then assert the next element is visible and the previous one hidden.
- **No hard-coded timeout anywhere.** Not in a spec, a page object, a fixture, or a helper. The step waits on the state it needs: a locator, a response with its method and status, both together for data-driven UI, and a load state only on a small, quiet page.
- **Web-first assertions everywhere.** `toBeVisible`, `toHaveText`, `toHaveURL`. No `isVisible()` inside an expect, no `waitForTimeout`, no `networkidle`.
- **Tests are independent** — any test, alone, in any order, in parallel.
- **Nothing hard-coded in a spec.** Routes and endpoints in `constants/`, accounts in `data/`, pure functions in `helpers/`. A spec never reads `process.env`.
- **Setup and teardown are projects, not `globalSetup`** — they show in the report, record traces, and can use fixtures.
- **Types are derived or inlined, not declared.** `type` over `interface`, `ReturnType<typeof fn>` over a hand-written shape.

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-testing@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-testing`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).
