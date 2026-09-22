# Constraints

Constraints for this marketplace — what DVstack is allowed to ship. Not a product definition of done.

## What exists

Only document plugins and skills that exist in the tree. Do not advertise empty plugins, future topics, or README placeholders.

Shipped plugins:

- `dvstack-frontend` — testable-ui, font-switcher
- `dvstack-testing` — playwright-test-architecture, playwright-step-validation, playwright-code-review, playwright-agents
- `dvstack-agents` — repo-recon, verify-loop
- `dvstack-harness` — harness-engineering, agent-execution-surfaces, agent-tool-design, safeguard-parity, agent-boundary-tests, agent-risk-chains, token-efficient-coding-loops

## What earns a skill

A skill costs context twice: its description on every turn, and its body whenever it loads. It ships only content a current model would not produce unprompted:

- **House conventions** — an opinionated choice between valid options (folder layout, locator tiers, "assert both directions of a toggle").
- **Copyable files** — templates, configs, source the agent copies instead of retyping.
- **Knowledge newer than training** — recent APIs and tools, verified against official docs.
- **Domain systems work** the model does not do by default — e.g. the agent harness.

Not a skill: general engineering good practice (naming, SOLID, "run the tests", "don't invent APIs", "restate ambiguous asks"), tutorials of documented APIs, or advice aimed at the human operator rather than the model. Measure before adding: a skill whose eval delta is zero has not earned its place.

## Skills

- One narrow subject per skill. Merge rather than split when two skills share a trigger.
- `SKILL.md` frontmatter: `name` (same as the folder) and `description` — one or two sentences, key use case first, at most 300 characters (enforced by the check script).
- Bodies state the rule and the code; skip the explanation of why a well-known practice is good.
- No "Not this skill" routing sections or checklists that restate the body. A short `## Verify` with runnable checks is fine.
- No attribution or source lists in public skills.
- Claims about a framework API are checked against the installed version's official docs before they ship. A wrong API in a skill is worse than no skill.

## Agents vs harness

Agents holds only portable habits with a measurable effect. Harness owns the system around an agent. Do not duplicate across that boundary — point instead.

## Scope

Only subjects covered by real, first-hand experience: Playwright and test automation, the front-end side of making an app testable, and the system around coding agents.

## Commands

Commands are **scenario workflows**, not skill aliases. Every skill is already slash-invocable (`/plugin-name:skill-name` in Claude Code, `/skill-name` in Cursor), so a command that only loads one skill adds nothing. A command earns its place by chaining the right skills in the right order for a job — new, add, rewrite, review, fix — with its deliverable and its proof.

- `disable-model-invocation: true`, so the description costs no context until the user runs it.
- Its name never equals a skill name — a command shadows a skill of the same name.
- It references skills as "the `name` skill" and other commands as "the `name` command", so the check script can verify both exist.
- It says what to load and in what order, and what to report. Never restate a skill's rules.

## Token-light

`AGENTS.md` is the single always-on file, and it stays short. Detail lives in skills that load when relevant.

Claude Code reads `AGENTS.md` as project instructions when a repository has no `CLAUDE.md` (v2.1.277+, on the default setting), and Cursor and other agents read it too — so one file covers every tool. Do not add a `CLAUDE.md` here: its presence makes Claude Code skip `AGENTS.md` entirely, and the two would drift.

## Public-safe

This repo is public. No private themes, secrets, personal tokens, or unpublished product internals.
