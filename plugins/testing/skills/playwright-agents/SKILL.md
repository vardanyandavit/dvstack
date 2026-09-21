---
name: playwright-agents
description: Use AI agents to plan, generate, and heal Playwright tests without lowering the suite's bar — the built-in planner, generator, and healer agents via `npx playwright init-agents`, the seed test they bootstrap from, Markdown test plans under `specs/`, the Playwright MCP server for driving a real browser from an agent, and the review gate every agent-written test must pass. Use when setting up Playwright agents or Playwright MCP, when an agent is writing or repairing e2e tests, when reviewing AI-generated specs, or when a healed test went green without the bug being fixed.
---

# Playwright agents

Naming and folder placement are defined in `playwright-naming-conventions`; the review gate is `playwright-code-review`.

Playwright ships three agents — **planner**, **generator**, **healer** — and an MCP server that lets any agent drive a real browser. They remove the typing, not the judgement. **An agent-written test is a pull request, not a result.** Everything in this plugin still applies to it, and the healer in particular has a failure mode no other tool has: it can make a suite green by weakening the thing that was protecting you.

## The three agents

| Agent | Does | Produces |
|---|---|---|
| **planner** | Explores the running app and writes a human-readable test plan | Markdown under `specs/` |
| **generator** | Turns one plan into executable specs | `*.spec.ts` files |
| **healer** | Runs the suite and repairs failing tests | Edits to existing specs |

They chain — plan, generate, run, heal — but each is worth using alone. The planner is the most valuable of the three on an unfamiliar app, because a plan is cheap to read and cheap to reject; a hundred generated specs are neither.

## Set it up

```bash
npx playwright init-agents --loop=claude     # also: vscode, codex, opencode
```

This writes agent definitions (instructions plus MCP tools) for your coding tool. **Regenerate them whenever Playwright is updated** — they are versioned against the runner, and a stale definition teaches the agent last year's API.

Then give the agents a way into the app:

```ts
// tests/seed.spec.ts
import { expect, test } from "../fixtures";

test("seed", async ({ page, dashboardPage }) => {
  await dashboardPage.goto();
  await expect(dashboardPage.getRoot()).toBeVisible();
});
```

The **seed test is the contract between your suite and the agents.** The planner runs it to execute everything that makes the app reachable — global setup, project dependencies, fixtures, hooks, storage state — so the agent explores as a signed-in user instead of stalling on a login screen. The generator reads it as the reference example for what a test in *this* suite looks like.

That makes the seed test the single highest-leverage file here. Make it import from `fixtures/index.ts`, use a page object, and end its step with a web-first assertion, and everything generated after it inherits those choices. Point it at a bare `page.goto()` and the agents will produce bare `page.goto()` tests forever.

```
repo/
├── specs/                     # Markdown plans, reviewed like design docs
│   └── checkout.md
├── tests/
│   ├── seed.spec.ts           # the reference example — keep it exemplary
│   └── checkout/
│       └── applies-a-discount.spec.ts
└── playwright.config.ts
```

## Reviewing a plan

A plan is prose, so read it against `playwright-test-strategy` before a single spec exists — this is where the cheap rejection happens:

- **Cut what does not belong in e2e.** A planner that has explored a form will happily propose a test per validation message. One representative failure through the UI; the rest go to component or API tests.
- **Name the risk per scenario.** A scenario nobody can attach a user-visible risk to is a scenario to delete.
- **Merge data-only variants** into one parameterised test.
- **Check what it never saw.** Agents explore what is reachable. Error states, empty states, expired sessions, and permission boundaries are usually missing because the app never showed them — add those yourself; they are where the bugs are.

## Reviewing generated tests

Run `playwright-code-review` over the diff exactly as you would for a human. The recurring misses, in order of how often they appear:

1. **Steps with no validation.** Generated tests often act and move on. Every `test.step` closes with an `expect` — `playwright-step-validation`.
2. **Locators picked from markup.** The MCP snapshot exposes the accessibility tree, which biases the agent towards roles — good — but it will still reach for a CSS class or a `.first()` when two elements match. Scope instead: `playwright-locators`.
3. **`page.waitForTimeout` as a stabiliser.** Non-negotiable. The ESLint config in `playwright-code-review` fails the build so review never has to.
4. **Assertions on what the agent could see rather than on the outcome** — a spinner appearing rather than the row landing in the list.
5. **Inline URLs, credentials, and stub bodies** that belong in `constants/` or `data/`.
6. **New page objects invented per spec** instead of the ones in `pages/`, and specs constructing them with `new SomePage(page)` instead of taking a fixture.
7. **Tests that only pass because they were written against today's data.** Make it create what it needs — `playwright-test-data`.

The cheapest enforcement is not review at all: point the agent at this plugin. A repo with these skills installed, a `playwright-code-review` ESLint config wired in, and an exemplary seed test produces generated code that mostly already complies.

## The healer, and the one rule it must not break

The healer runs the suite, reads the failure and the trace, and edits the test until it passes. That is genuinely useful for the failures that are the test's fault — a renamed button, a moved element, a changed accessible name — and genuinely dangerous for the ones that are not.

**A red test is a claim about the product. Healing it is only correct when the claim was wrong.**

| The failure | Healing is |
|---|---|
| Locator no longer matches after a deliberate UI rename | Correct — update the locator |
| Step waits on an element the redesign removed | Correct — wait on the new one |
| Assertion contradicts an intentional product change | Correct — with the change named in the PR |
| Assertion caught a real regression | **Wrong** — the fix belongs in the app |
| Test is flaky | **Wrong** — diagnose it, `playwright-flaky-tests` |

Watch for these in a healed diff. Each one turns a failing test into a passing test that proves less:

- An assertion **deleted** rather than corrected.
- `toHaveText` relaxed to `toContainText`, or a count assertion dropped to `not.toHaveCount(0)`.
- A timeout raised, a retry added, `test.slow()` appearing, or a `waitForTimeout` introduced.
- `force: true`, `.first()`, or a conditional `if (await x.isVisible())` wrapped around the failing check.
- A step's validation replaced with a weaker one — `toBeAttached` where the test meant `toBeVisible`.

So: **review a healer diff by what it removed**, not by the green run. `git diff` on the specs, and if the count of assertions went down, the healer did not fix anything. Never let a healer run unattended in CI against `main` — heal on a branch, in a PR, where a human reads the diff. A suite that heals itself in CI has become a suite that reports whatever the app does.

## Playwright MCP

The MCP server gives any agent a real browser driven through the **accessibility tree** rather than screenshots — which is why an agent using it picks role-based locators, and why it is cheap enough to run in a loop.

```bash
npx @playwright/mcp@latest --isolated --headless
```

Flags that matter for a coding agent:

| Flag | Why |
|---|---|
| `--isolated` | Profile in memory; nothing leaks between sessions |
| `--allowed-origins` / `--blocked-origins` | Semicolon-separated origin scope. Set it. |
| `--storage-state` | Start signed in from a state file instead of automating a login |
| `--browser`, `--device` | `chrome` / `firefox` / `webkit` / `msedge`; `--device "iPhone 15"` |
| `--headless` | CI and background runs |
| `--user-data-dir` | Persistent profile — the opposite of `--isolated`, so pick one deliberately |

Treat it as a privileged tool, not a convenience. A browser-driving agent reaches the network, any origin it can navigate to, and whatever session you hand it — and the page it reads is untrusted input that can try to steer the next tool call. `--allowed-origins` and `--isolated` are the two flags that keep that bounded. If the project is building an agent rather than testing one, that analysis belongs in `dvstack-harness`: `agent-execution-surfaces` for the channel, `safeguard-parity` for the gate, `agent-boundary-tests` for the proof.

**Never point it at production with a real user's storage state.** Use a test account on a test environment, the same as the suite.

## Verify

- `npx playwright init-agents --loop=<tool>` has been re-run since the last Playwright upgrade.
- `tests/seed.spec.ts` imports from `fixtures/index.ts`, uses a page object, and ends with an assertion.
- Every generated spec passes `npx eslint .` with this plugin's config and `npx tsc --noEmit`.
- Each generated test fails when the behaviour it covers is broken — run it against a deliberately broken build once.
- Every healed diff was read by a person, and the assertion count did not drop.
- No healer, generator, or MCP browser runs unattended against production or with production credentials.
- The MCP server runs with `--isolated` and an explicit origin allowlist.

## Rules

- An agent-written test merges through the same review as a human one. No exceptions for volume.
- Never accept a healed test whose diff removes or weakens an assertion. Fix the app, or delete the test as obsolete — deliberately.
- Never heal on `main`, in CI, or unattended.
- Review the plan before the code. A rejected plan costs one paragraph; a rejected suite costs a day.
- Keep the seed test exemplary. It is the style guide the generator actually reads.
- Regenerate agent definitions on every Playwright upgrade.
- The MCP browser is a privileged tool: scoped origins, isolated profile, test credentials only.
