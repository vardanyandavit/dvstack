# Contributing

This repo is a plugin marketplace. Add only material that exists and is ready to install. Read [CONSTRAINTS.md](CONSTRAINTS.md) first — especially "What earns a skill".

## Layout

```
plugins/<plugin>/
  .claude-plugin/plugin.json
  .cursor-plugin/plugin.json
  README.md
  commands/<scenario>.md      # optional scenario workflows
  evals/<case>/case.yaml
  skills/<skill-name>/
    SKILL.md
    …optional files the agent should copy
```

## A skill

- Folder name is the skill name.
- Frontmatter `name` (same as the folder) and `description` — the trigger, at most 300 characters, key use case first.
- One narrow subject. Keep the body to the rules and code a model would not write unprompted.
- Files the agent should copy live next to `SKILL.md`; the skill tells the agent to copy them.
- Verify any framework API the skill teaches against that library's official docs before shipping it.
- Add or update an eval case that the base model fails without the skill. No delta, no skill.

## A command

See "Commands" in [CONSTRAINTS.md](CONSTRAINTS.md). One command per plugin, and only when the job needs several skills. Frontmatter `description` and `disable-model-invocation: true`. The body names the skills to load ("the `playwright-code-review` skill"), the steps, and what to report. Invoked as `/plugin-name:command` in Claude Code and `/command` in Cursor. A single-skill job has no command file.

## A plugin

1. Add the folder under `plugins/`.
2. Register it in both `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json` (`name`, `source`, `description`).
3. Keep Claude `source` as `./plugins/<plugin>` and Cursor `source` as `plugins/<plugin>` unless you have confirmed both installers accept one style.
4. Update the root `README.md` and the plugin `README.md`; bump `version` in both `plugin.json` files.

## Checks

```bash
node scripts/check-marketplace.mjs
```

Fails if a skill is missing frontmatter, a description exceeds 300 characters, a command lacks `disable-model-invocation: true`, shares a skill's name, or references a skill or command that does not exist, a marketplace `source` does not exist, or plugin folders drift from the marketplace lists.

Evals — see [docs/evals.md](docs/evals.md):

```bash
cd plugins/testing && claude plugin eval . --judge-model sonnet --runs 4
```
