# Constraints

Constraints for this marketplace — what DVstack is allowed to ship. Not a product definition of done.

## What exists

Only document plugins and skills that exist in the tree. Do not advertise empty plugins, future topics, or README placeholders.

Shipped plugins:

- `dvstack-testing` — playwright-test-architecture, playwright-step-validation, playwright-code-review, playwright-agents. One command, `playwright`, picks among them.
- `dvstack-frontend` — font-switcher
- `dvstack-agents` — agent-rules. Adds a filtered block to an `AGENTS.md` or `CLAUDE.md` that already exists. Does not create that file.

## What earns a skill

A skill costs context twice: its description on every turn, and its body whenever it loads. It ships only content a current model would not produce unprompted:

- **House conventions** — an opinionated choice between valid options (folder layout, locator tiers, "assert both directions of a toggle").
- **Copyable files** — templates, configs, source the agent copies instead of retyping.
- **Knowledge newer than training** — recent APIs and tools, verified against official docs.
- **Domain systems work** the model does not do by default — e.g. the copyable Playwright suite and the `AGENTS.md` block.

Not a skill: general engineering good practice (naming, SOLID, "run the tests", "don't invent APIs", "restate ambiguous asks"), tutorials of documented APIs, or advice aimed at the human operator rather than the model. Measure before adding: a skill whose eval delta is zero has not earned its place.

## Skills

- One narrow subject per skill. Merge rather than split when two skills share a trigger.
- `SKILL.md` frontmatter: `name` (same as the folder) and `description` — one or two sentences, key use case first, at most 300 characters (enforced by the check script).
- Bodies state the rule and the code; skip the explanation of why a well-known practice is good.
- No "Not this skill" routing sections or checklists that restate the body. A short `## Verify` with runnable checks is fine.
- No attribution or source lists in public skills.
- Claims about a framework API are checked against the installed version's official docs before they ship. A wrong API in a skill is worse than no skill.

## Scope

Only subjects covered by real, first-hand experience: Playwright tests, the font switcher, and the `AGENTS.md` a coding agent should follow in a repo.

## Commands

One call per plugin. The agent decides which skills that call needs. The user does not pick a skill or a scenario.

A command exists only when one job needs several skills. `playwright` is that command: it chooses create, add, rewrite, review, flaky, or agent-written, and loads only that row.

A job with one skill has no command. The skill is the call (`/font-switcher`, `/agent-rules`). A command that only loads one skill adds nothing.

- `disable-model-invocation: true`, so the description costs no context until the user runs it.
- Its name never equals a skill name — a command shadows a skill of the same name.
- It references skills as "the `name` skill" and other commands as "the `name` command", so the check script can verify both exist.
- It says what to load and what to report. Never restate a skill's rules.

## Token-light

`AGENTS.md` is the single always-on file, and it stays short. Detail lives in skills that load when relevant.

Claude Code reads `AGENTS.md` as project instructions when a repository has no `CLAUDE.md` (v2.1.277+, on the default setting), and Cursor and other agents read it too — so one file covers every tool. Do not add a `CLAUDE.md` here: its presence makes Claude Code skip `AGENTS.md` entirely, and the two would drift.

## Public-safe

This repo is public. No private themes, secrets, personal tokens, or unpublished product internals.
