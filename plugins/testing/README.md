# DVstack Testing

Opinionated Playwright house conventions. The skills carry only what a current model would not write unprompted — the house choices, the templates to copy, and the review rules — not a tutorial of the Playwright API.

| Skill | Covers | Ask for it with |
|---|---|---|
| [playwright-test-architecture](skills/playwright-test-architecture/) | Folder layout, file and identifier naming, locator tiers, page objects through fixtures, setup/teardown projects, step-per-assertion spec shape; ships `files/` templates | "set up Playwright" / "where does this go" |
| [playwright-step-validation](skills/playwright-step-validation/) | Zero hard-coded waits, the validation ladder, network waits registered first, fixing flaky tests from the trace | "what should this step wait for" / "this test is flaky" |
| [playwright-code-review](skills/playwright-code-review/) | Severity-ordered review, house rules per area (auth, data, mocking, a11y, visual, mobile, CI, migration), healed-diff review; ships an ESLint config | "review these tests" |
| [playwright-agents](skills/playwright-agents/) | `init-agents` planner/generator/healer, the seed test, Playwright MCP scoping, the gate for AI-written tests | "let an agent write these tests" |

## Conventions these skills enforce

- **Page objects through fixtures.** A spec never calls `new`.
- **One definition per element, at the narrowest tier:** inline, `getXxx()` getter, or `constants/selectors.ts`.
- **Every `test.step` ends with a web-first `expect`**, and there is no hard-coded timeout anywhere.
- **Nothing hard-coded in a spec.** Routes and endpoints in `constants/`, accounts in `data/`; a spec never reads `process.env`.
- **Every test creates what it needs and cleans up through the API.**
- **An agent-written test is a pull request, not a result.**

## Commands

Type one command, then the task. The case list, including which skills each command loads, is in the [repository README](../../README.md#which-command).

| Case | Cursor | Claude Code |
|---|---|---|
| No suite yet | `/new-suite` | `/dvstack-testing:new-suite` |
| Add tests to a suite that exists | `/add-tests` | `/dvstack-testing:add-tests` |
| Rewrite a suite, or move Cypress/Selenium | `/rewrite-suite` | `/dvstack-testing:rewrite-suite` |
| Review tests | `/review-tests` | `/dvstack-testing:review-tests` |
| A test fails sometimes, or only in CI | `/fix-flaky` | `/dvstack-testing:fix-flaky` |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-testing@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-testing`.
