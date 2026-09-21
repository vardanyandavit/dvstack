# Using DVstack commands and skills

Install and update details live in [README Install](../README.md#install).

Install a plugin once. Then force its conventions for a task with a slash command (Claude Code) or the skill name (Cursor and other `SKILL.md` readers).

Commands are **force-loaders**. They point at installed skills. They do not add a second rulebook.

## Claude Code

After `claude plugin install dvstack-testing@dvstack` (and the other plugins you want), commands from each plugin's `commands/` folder show up as namespaced slash commands. Exact labels appear in `/help`. Typical form:

```text
/dvstack-testing:playwright
/dvstack-testing:locators
/dvstack-agents:dvstack
/dvstack-agents:recon
/dvstack-agents:ops-bar
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

## Grok Bot and other SKILL.md readers

Catalog plugins `dvstack-testing` and `dvstack-frontend` install from the plugin catalog (ask in chat, or install them in Cursor on the same account). For `dvstack-agents`, `dvstack-harness`, and `dvstack-mode`, copy the skill folder from GitHub or install from the Claude Code marketplace. Refresh by reinstalling the catalog plugin or by copying the skill folder again.

If the skill is in that tool's skill library, invoke it with `/` or `@` plus the skill name. Otherwise copy the skill folder, or paste the GitHub skill URL and ask the agent to follow it.

Grok Bot does **not** load Claude plugin `commands/` automatically.

## Pattern

1. Install the plugin (or copy the skill folder).
2. Force it for this task: command **or** skill name.
3. The agent reads `SKILL.md` and any files it ships — and does not invent a conflicting pattern.
