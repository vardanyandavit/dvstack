# Using DVstack commands and skills

Install and update details live in [README Install](../README.md#install).

Install a plugin once. Then force its conventions for a task with a slash command (Claude Code) or the skill name (Cursor).

Commands are **force-loaders**. They point at installed skills. They do not add a second rulebook.

## Which command to use

These are the daily ones. Say the kind of work in the same message. `/dvstack-agents:mode` loads the `dvstack-mode` skill, which already applies the coding rules, the quality bar, and the verify step.

| Work | Claude Code | Cursor |
|---|---|---|
| New app | `/dvstack-agents:mode` — "new app" | `@dvstack-mode` — "new app" |
| Bug in the current app | `/dvstack-agents:mode` — "bugfix" | `@dvstack-mode` — "bugfix" |
| Playwright suite from scratch | `/dvstack-agents:mode` and `/dvstack-testing:test-architecture` — "new suite" | `@dvstack-mode` and `@playwright-test-architecture` — "new suite" |
| Rewrite old Playwright | `/dvstack-agents:mode` and `/dvstack-testing:test-architecture` — "rewrite" | `@dvstack-mode` and `@playwright-test-architecture` — "rewrite" |
| Review the app | `/dvstack-agents:mode` — "review" | `@dvstack-mode` — "review" |
| Review Playwright | `/dvstack-agents:mode` and `/dvstack-testing:code-review` | `@dvstack-mode` and `@playwright-code-review` |

`/dvstack-testing:migration` (Cursor: `@playwright-migration`) is for a Cypress, Selenium, WebdriverIO, or Protractor suite. A suite that is already Playwright uses the rewrite row.

Unsure which skill applies: `/dvstack-agents:dvstack` or `@using-dvstack`. That only picks a skill. The lists below are the rest.

The same table is at the top of the [repository README](../README.md#which-command-to-use).

## Claude Code

After `claude plugin install dvstack-testing@dvstack` (and the other plugins you want), commands from each plugin's `commands/` folder show up as namespaced slash commands. Exact labels appear in `/help`. Typical form:

```text
/dvstack-testing:playwright
/dvstack-testing:locators
/dvstack-agents:dvstack
/dvstack-agents:recon
/dvstack-agents:ops-bar
/dvstack-agents:code
/dvstack-agents:verify
/dvstack-harness:harness
/dvstack-harness:execution-surfaces
/dvstack-harness:tool-design
/dvstack-harness:parity
/dvstack-harness:boundary-tests
/dvstack-harness:risk-chains
/dvstack-frontend:testable
/dvstack-frontend:fonts
```

One command per skill, plus `playwright` for the whole testing pack. `/help` lists them all after install.

**Command names are deliberately shorter than the skill names they load** (`/dvstack-testing:locators` loads
`playwright-locators`). A command that shares a skill's name shadows it, and invoking the skill then returns the
command body instead of `SKILL.md` — see [evals](evals.md). `scripts/check-marketplace.mjs` fails the build on it.

- `/dvstack-testing:playwright` — whole Playwright pack (architecture, strategy, writing, review).
- `/dvstack-testing:locators` (and one per remaining skill) — force a single skill.

The command loads that skill (or every relevant testing skill) with the Skill tool and follows it. The skill
arrives with its own base directory — nothing needs to be read off disk by path.

## Cursor

Install the marketplace plugin. Skills appear in the skill list. Force one with `/` or `@` plus the skill name, or in natural language ("follow playwright-locators", "use dvstack-testing").

Cursor does **not** load Claude plugin `commands/*.md` the same way. Skills are the primary force mechanism. Asking "use dvstack-testing" or "follow playwright-locators" still works.

Other tools that read `SKILL.md` can copy a skill folder or invoke the skill by name.

## Pattern

1. Install the plugin (or copy the skill folder).
2. Force it for this task: command **or** skill name.
3. The agent reads `SKILL.md` and any files it ships — and does not invent a conflicting pattern.
