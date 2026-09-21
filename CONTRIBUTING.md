# Contributing

This repo is a plugin marketplace. Add only material that exists and is ready to install. Do not register empty plugins or leave README placeholders for topics that are not in the tree. See [CONSTRAINTS.md](CONSTRAINTS.md).

## Layout

```
plugins/<plugin>/
  .claude-plugin/plugin.json
  .cursor-plugin/plugin.json
  README.md
  commands/<name>.md          # optional Claude Code slash commands
  skills/<skill-name>/
    SKILL.md
    …optional files the agent should copy
```

## A skill

- Folder name is the skill name.
- `SKILL.md` starts with YAML frontmatter that has `name` (same as the folder) and `description` (what it does and when to use it — that sentence is the trigger).
- One narrow subject. Keep the body short.
- No attribution or source lists in the skill.
- Files the agent should copy live next to `SKILL.md`; the skill tells the agent to copy them.
- New skills should end with a `## Verification` checklist (the Playwright skills use `## Verify` plus `## Rules` — match the plugin you are adding to).
- Verify any framework API the skill teaches against that library's official docs before shipping it.

## A command

- Flat file: `plugins/<plugin>/commands/<name>.md` (plugin root, not inside `.claude-plugin/`).
- YAML frontmatter with `description:` (the `/help` text).
- Body tells the agent which skill(s) to Read and follow. Do not invent parallel rules.
- After install in Claude Code, invoked as `/plugin-name:command-name`. Cursor and other tools force via the skill name — see [docs/using-commands.md](docs/using-commands.md).

## A plugin

1. Add the folder under `plugins/`.
2. Register it in both `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json` (`name`, `source`, `description`).
3. Keep Claude `source` as `./plugins/<plugin>` and Cursor `source` as `plugins/<plugin>` unless you have confirmed both installers accept one style.
4. Update the root `README.md` only for plugins and skills that exist. Do not mention future topics.
5. Update the plugin `README.md` and bump `version` in both `plugin.json` files (patch for text or skill edits, minor when adding a skill or commands).

## Agent vs harness

- `dvstack-agents` — light habits: repo recon, quality bar, verify loop, session hygiene, when to deepen, trust ladder, coding rules, dvstack-mode conductor, marketplace router, short self-checks.
- `dvstack-harness` — the heavy system: contracts, tool design, verify/recover, durable state, feature maps, hard CI, plus execution-surface, safeguard-parity, boundary-test, and risk-chain QA.

Do not merge them. Point across the boundary instead of duplicating.

## Naming rule: a command must not share a skill's name

A command named the same as a skill **shadows it**. Invoking the skill then returns the command
body instead of `SKILL.md`, and the real skill never loads. Give the command a shorter, distinct
name (`/dvstack-testing:locators` loads the `playwright-locators` skill).

A command must also never point at `skills/<name>/SKILL.md`. That path resolves against the
user's project, not the plugin root, so it never loads — the agent searches, fails, and answers
from general knowledge. Name the skill for the Skill tool instead:

```md
Load the skill **`dvstack-testing:playwright-locators`** with the Skill tool now, and follow it
for this task. The skill arrives with its own base directory, so do not go looking for
`SKILL.md` on disk.

If the skill does not load, say so plainly and stop — do not answer from general knowledge instead.
```

Both shipped once and cost measurable answer quality. See [docs/evals.md](docs/evals.md).

## Checks

```bash
node scripts/check-marketplace.mjs
```

Fails if a skill is missing frontmatter `name` or `description`, a command `.md` is missing `description`, a command name collides with a skill name, a command points at a relative `skills/.../SKILL.md` path, a marketplace `source` path does not exist, or plugin folders drift from the marketplace lists.

Eval suites live in `plugins/*/evals/` — see [docs/evals.md](docs/evals.md).

```bash
cd plugins/frontend && claude plugin eval . --judge-model sonnet --runs 4
```
