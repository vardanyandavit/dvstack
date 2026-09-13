# Contributing

This repo is a plugin marketplace. Add only material that exists and is ready to install. Do not register empty plugins or leave README placeholders for topics that are not in the tree.

## Layout

```
plugins/<plugin>/
  .claude-plugin/plugin.json
  .cursor-plugin/plugin.json
  README.md
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

## A plugin

1. Add the folder under `plugins/`.
2. Register it in both `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json` (`name`, `source`, `description`).
3. Keep Claude `source` as `./plugins/<plugin>` and Cursor `source` as `plugins/<plugin>` unless you have confirmed both installers accept one style.
4. Update the root `README.md` only for plugins and skills that exist. Do not mention future topics.
5. Update the plugin `README.md` and bump `version` in both `plugin.json` files (patch for text or skill edits, minor when adding a skill).

## Agent vs harness

- `dvstack-agents` — light habits: quality bar, session hygiene, when to deepen.
- `dvstack-harness` — the heavy system: contracts, tools, verify/recover, durable state, feature maps, hard CI.

Do not merge them. Point across the boundary instead of duplicating.

## Checks

```bash
node scripts/check-marketplace.mjs
```

Fails if a skill is missing frontmatter `name` or `description`, a marketplace `source` path does not exist, or plugin folders drift from the marketplace lists.
