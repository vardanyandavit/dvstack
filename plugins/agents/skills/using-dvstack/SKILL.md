---
name: using-dvstack
description: Use when starting work in a repo that has DVstack plugins installed, or when asked which DVstack skill or plugin applies. Marketplace router only — maps Playwright, frontend, agent habits, and harness. Prefer the narrowest skill; slash commands force-load.
---

# Using DVstack

This skill routes to **this marketplace**. It does not replace the skill it points at.

## When to use

- The repo (or the session) has DVstack plugins installed and work is starting.
- The user asks which DVstack skill, plugin, or slash command applies.

## Plugins

| Plugin | When | Force |
|---|---|---|
| `dvstack-testing` | Playwright, e2e, test-suite work | `/playwright` (whole pack) or a skill command such as `/playwright-locators` |
| `dvstack-frontend` | Component markup that tests and agents must drive; typography picker | `/testable-ui`, `/font-switcher` |
| `dvstack-agents` | Light agent habits (orient, bar, verify, session, rigor, trust, coding rules, mode, doubt, sources) | `/repo-recon`, `/ops-bar`, `/verify-loop`, `/session`, `/rigor`, `/trust`, `/code`, `/mode`, `/anti-rationalization`, `/doubt-check`, `/source-check` |
| `dvstack-harness` | Multi-step or side-effectful agent **systems** (surfaces, tools, parity, boundary tests, risk chains) | `/harness`, `/execution-surfaces`, `/tool-design`, `/safeguard-parity`, `/boundary-tests`, `/risk-chains` |

**Common asks, straight to the skill:**

| Ask | Skill |
|---|---|
| New repo, first edit | `repo-recon` → `agent-ops-bar` |
| Writing, changing, or reviewing code | `coding-rules` (`dvstack-mode` loads it) |
| "Does it work?" | `verify-loop` |
| Set up an e2e suite | `playwright-test-architecture` |
| Tests sign in every time / add a second role | `playwright-auth-and-roles` |
| Flaky in parallel, shared records | `playwright-test-data` → `playwright-flaky-tests` |
| AI wrote or healed the tests | `playwright-agents` → `playwright-code-review` |
| Cypress/Selenium suite to move | `playwright-migration` |
| Bug only on phones | `playwright-mobile-web` |
| A test can only find it by CSS class | `testable-ui` |
| Defining an agent's tools | `agent-tool-design` |
| Where should this agent fix live / scale agents safely? | `agent-trust-stack` |
| Nontrivial work / want the global DVstack bar | `dvstack-mode` |

Exact slash form in Claude Code is `/plugin-name:command-name` (see `/help`). Cursor and other tools force via the skill name or a direct ask.

## Core behaviors

1. **Surface assumptions.** Say what you are assuming about scope, files, and done. Do not silently invent scope.
2. **Verify, don't assume.** Run the project's honest check. Reading a diff is not proof.
3. **Narrowest skill.** Load the one skill that matches. Load more only when the change actually spans them.
4. **Several can apply.** Playwright work can also need ops-bar. Point; don't merge plugins.
5. **Slash command = hard force-load.** If the user invoked a command, Read that skill (or pack) and follow it. Commands do not invent extra rules.

Agents stay light. Harness owns contracts, tool gates, verify/recover, durable state, feature maps, hard CI, and bound-action QA.

## Not this skill

Writing Playwright tests: `dvstack-testing`. Building an agent harness: `harness-engineering` (narrower: `agent-execution-surfaces`, `agent-tool-design`, `safeguard-parity`, `agent-boundary-tests`, `agent-risk-chains`). Component markup: `testable-ui`. Font picker implementation: `font-switcher`.

## Verification

- [ ] Named the plugin/skill that applies (or said none does)
- [ ] Did not expand scope past what the user asked
- [ ] Loaded the narrowest matching skill, not the whole marketplace
- [ ] If a slash command was invoked, that skill was actually read
