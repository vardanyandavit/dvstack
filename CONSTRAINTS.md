# Constraints

Constraints for this marketplace — what DVstack is allowed to ship. Not a product definition of done.

## What exists

Only document plugins and skills that exist in the tree. Do not advertise empty plugins, future topics, or README placeholders.

Shipped plugins:

- `dvstack-frontend` — font-switcher
- `dvstack-testing` — fifteen Playwright skills
- `dvstack-agents` — agent-ops-bar, agent-session, agent-rigor, using-dvstack, anti-rationalization, doubt-check, source-check
- `dvstack-harness` — harness-engineering

## Skills

- One narrow subject per skill.
- `SKILL.md` frontmatter: `name` (same as the folder) and `description` (what it does and when to use it).
- No attribution or source lists in public skills.
- New skills should end with a `## Verification` checklist.

## Agents vs harness

Agents stay light (habits). Harness owns heavy system concerns (contracts, tools, verify/recover, durable state, feature maps, hard CI). Do not duplicate across that boundary — point instead.

## Commands

Plugin `commands/*.md` are force-loaders for installed skills. They tell the agent which `SKILL.md` to Read and follow. They must not invent parallel rules.

## Token-light

Always-on files (`AGENTS.md`, `CLAUDE.md`) stay short. Detail lives in skills that load when relevant.

## Public-safe

This repo is public. No private themes, secrets, personal tokens, or unpublished product internals.
