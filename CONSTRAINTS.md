# Constraints

Constraints for this marketplace — what DVstack is allowed to ship. Not a product definition of done.

## What exists

Only document plugins and skills that exist in the tree. Do not advertise empty plugins, future topics, or README placeholders.

Shipped plugins:

- `dvstack-frontend` — testable-ui, font-switcher
- `dvstack-testing` — twenty Playwright skills
- `dvstack-agents` — using-dvstack, repo-recon, agent-ops-bar, verify-loop, agent-session, agent-rigor, anti-rationalization, doubt-check, source-check, agent-trust-stack, coding-rules, dvstack-mode
- `dvstack-harness` — harness-engineering, agent-execution-surfaces, agent-tool-design, safeguard-parity, agent-boundary-tests, agent-risk-chains, token-efficient-coding-loops

## Skills

- One narrow subject per skill.
- `SKILL.md` frontmatter: `name` (same as the folder) and `description` (what it does and when to use it).
- No attribution or source lists in public skills.
- New skills should end with a `## Verification` checklist. The Playwright skills use `## Verify` plus `## Rules` for the same purpose — follow the plugin's local convention rather than mixing both.
- Claims about a framework API are checked against the installed version's official docs before they ship, per `source-check`. A wrong API in a skill is worse than no skill.

## Agents vs harness

Agents stay light (habits). Harness owns heavy system concerns (contracts, tools, verify/recover, durable state, feature maps, hard CI, plus execution-surface / tool-design / safeguard-parity / boundary-test / risk-chain QA, and coding-loop cost). Do not duplicate across that boundary — point instead.

## Scope

Only subjects covered by real, first-hand experience: Playwright and test automation, the front-end side of making an app testable, the system around coding agents, and the universal rules an agent applies when it writes or changes code (`coding-rules`).

`coding-rules` states invariants (correctness, data, effects, failure, proof, ownership). The skill file is the short list for every change. Detail that does not apply to every change lives in `references/` and is opened only when its trigger matches. It is not a backend, SQL, or infrastructure tutorial: no migration recipes, query patterns, or cloud runbooks.

## Commands

Plugin `commands/*.md` are force-loaders for installed skills. They tell the agent which `SKILL.md` to Read and follow. They must not invent parallel rules.

## Token-light

`AGENTS.md` is the single always-on file, and it stays short. Detail lives in skills that load when relevant.

Claude Code reads `AGENTS.md` as project instructions when a repository has no `CLAUDE.md` (v2.1.277+, on the default setting), and Cursor and other agents read it too — so one file covers every tool. Do not add a `CLAUDE.md` here: its presence makes Claude Code skip `AGENTS.md` entirely, and the two would drift.

## Public-safe

This repo is public. No private themes, secrets, personal tokens, or unpublished product internals.
