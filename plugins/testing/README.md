# DVstack Testing

Opinionated Playwright house conventions. One command, `/playwright`. It decides create, add, rewrite, review, flaky, or agent-written, and loads only the skills that job needs.

The skills carry the house choices, the templates to copy, and the review rules — not a tutorial of the Playwright API.

| Skill | Covers |
|---|---|
| [playwright-test-architecture](skills/playwright-test-architecture/) | Folder layout, naming, locator tiers, page objects through fixtures, setup/teardown projects, step-per-assertion spec shape; ships `files/` templates |
| [playwright-step-validation](skills/playwright-step-validation/) | Zero hard-coded waits, the validation ladder, network waits registered first, fixing flaky tests from the trace |
| [playwright-code-review](skills/playwright-code-review/) | Severity-ordered review, house rules per area, healed-diff review; ships an ESLint config |
| [playwright-agents](skills/playwright-agents/) | `init-agents` planner/generator/healer, the seed test, Playwright MCP scoping, the gate for AI-written tests |

## Conventions these skills enforce

- **Page objects through fixtures.** A spec never calls `new`.
- **One definition per element, at the narrowest tier:** inline, `getXxx()` getter, or `constants/selectors.ts`.
- **Every `test.step` ends with a web-first `expect`**, and there is no hard-coded timeout anywhere.
- **Nothing hard-coded in a spec.** Routes and endpoints in `constants/`, accounts in `data/`; a spec never reads `process.env`.
- **Every test creates what it needs and cleans up through the API.**
- **An agent-written test is a pull request, not a result.**

## Call

| Cursor | Claude Code |
|---|---|
| `/playwright` | `/dvstack-testing:playwright` |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-testing@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-testing`.
