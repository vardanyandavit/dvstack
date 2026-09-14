# Using DVstack commands and skills

Install a plugin once. Then force its conventions for a task with a slash command (Claude Code) or the skill name (Cursor and other `SKILL.md` readers).

Commands are **force-loaders**. They point at installed skills. They do not add a second rulebook.

## Claude Code

After `claude plugin install dvstack-testing@dvstack` (and the other plugins you want), commands from each plugin's `commands/` folder show up as namespaced slash commands. Exact labels appear in `/help`. Typical form:

```text
/dvstack-testing:playwright
/dvstack-testing:playwright-locators
/dvstack-agents:ops-bar
/dvstack-agents:using-dvstack
/dvstack-harness:harness
/dvstack-frontend:font-switcher
```

- `/dvstack-testing:playwright` — whole Playwright pack (architecture, strategy, writing, review).
- `/dvstack-testing:playwright-locators` (and the other skill file names) — one skill.

The agent should Read that skill (or every relevant testing skill) and follow it.

## Cursor

Install the marketplace plugin. Skills appear in the skill list. Force one with `/` or `@` plus the skill name, or in natural language ("follow playwright-locators", "use dvstack-testing").

Cursor does **not** load Claude plugin `commands/*.md` the same way. Skills are the primary force mechanism. Asking "use dvstack-testing" or "follow playwright-locators" still works.

## Grok Bot and other SKILL.md readers

If the skill is in that tool's skill library, invoke it with `/` or `@` plus the skill name. Otherwise copy the skill folder, or paste the GitHub skill URL and ask the agent to follow it.

Grok Bot does **not** load Claude plugin `commands/` automatically.

## Pattern

1. Install the plugin (or copy the skill folder).
2. Force it for this task: command **or** skill name.
3. The agent reads `SKILL.md` and any files it ships — and does not invent a conflicting pattern.
