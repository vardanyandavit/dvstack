---
name: playwright-agents
description: Playwright's planner, generator, and healer agents (`npx playwright init-agents`), the seed test they bootstrap from, Playwright MCP scoping, and the review gate for AI-written or healed tests. Use when an agent writes, heals, or drives e2e tests.
---

# Playwright agents

An agent-written test is a pull request, not a result. Review gate: `playwright-code-review`.

| Agent | Does | Produces |
|---|---|---|
| planner | Explores the running app | Markdown plans under `specs/` |
| generator | Turns one plan into specs | `*.spec.ts` |
| healer | Runs the suite, repairs failures | Edits to existing specs |

## Set up

```bash
npx playwright init-agents --loop=claude     # also: vscode, codex, opencode
```

Re-run on every Playwright upgrade — definitions are versioned against the runner.

**The seed test (`tests/seed.spec.ts`) is the contract.** The planner runs it to reach the app (setup projects, fixtures, storage state); the generator copies its style. Make it exemplary — import from `fixtures/index.ts`, use a page object, end the step with a web-first assertion — or every generated test inherits bare `page.goto()`.

## Review the plan before the code

- Cut what does not belong in e2e (one representative validation failure, not one per message).
- Every scenario names a user-visible risk, or it goes.
- Merge data-only variants into one parameterised test.
- Add what the agent never saw: error, empty, expired-session, and permission states.

## Generated tests: recurring misses

Steps without a validation; `.first()` or CSS when two elements match; `waitForTimeout`; asserting a spinner appeared instead of the outcome; inline URLs/credentials; new page objects per spec or `new SomePage(page)`; tests that pass only on today's data.

## The healer

| Failure | Healing is |
|---|---|
| Locator broke after a deliberate UI rename | Correct |
| Assertion contradicts an intentional product change | Correct — name the change in the PR |
| Assertion caught a real regression | **Wrong** — fix the app |
| Test is flaky | **Wrong** — `playwright-step-validation` |

Review a healed diff by what it removed; if the assertion count dropped, nothing was fixed. Heal on a branch in a PR — never on `main`, in CI, or unattended.

## Playwright MCP

```bash
npx @playwright/mcp@latest --isolated --headless --allowed-origins "https://staging.example.com"
```

It drives the browser via the accessibility tree. Treat it as privileged: the page is untrusted input that can steer the next tool call. Always `--isolated` (or a deliberate `--user-data-dir`) and an origin allowlist; `--storage-state` for a **test** account only. Never production, never real user state.

## Verify

- Agent definitions regenerated since the last Playwright upgrade; seed test is exemplary.
- Generated specs pass ESLint and `tsc`, and fail against a deliberately broken build.
- Every healed diff read by a person; no net loss of assertions.
