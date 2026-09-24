---
name: agent-rules
description: Add the global rules agents skip into an existing AGENTS.md or CLAUDE.md. Keeps what /init wrote. From rules the user pastes, keep only what this repo needs. Use after init.
---

# Agent rules

`/init` writes the instruction file by reading the project. This skill does not. It adds one marked block to files that already exist.

## Where it goes

Look for `AGENTS.md`, `CLAUDE.md`, and `.claude/CLAUDE.md`. Update each one that exists, with the same block. If none exist, stop and tell the user to run `/init` first. Do not create a file. Do not add `.cursor/rules`.

Leave every line outside the markers. No markers yet: append the block, immediately before `## Project` if that heading is already there. Markers present: replace only `<!-- dvstack:start -->` … `<!-- dvstack:end -->`.

## What goes in the block

Copy the bullets from `files/global-rules.md`. Leave the `section:` comments out. Wrap the chosen sections in the markers.

Always include `section:always`. Fill `Verify:` and `Full check:` from this repo: CI workflow first, then package scripts. No check exists? Write `none`. Do not invent a command.

Add another section only when the repo has that stack. Read the existing instruction file, the lockfile, and package scripts — stop there.

| Section | Include when |
|---|---|
| `section:web` | A DOM UI (React, Vue, Svelte, Next, Angular, HTML pages). Skip for a canvas or game loop with no document UI (Phaser, Pixi, Unity, Godot). |
| `section:e2e` | Playwright, Cypress, or Selenium is already a dependency or config. |

## Rules the user pastes

Keep a pasted rule when it names a tool, path, command, or risk this repo has. Drop a rule that needs a framework the repo does not have, and a rule that repeats the block. Append kept rules under `## Project`, outside the markers. Create that heading only if it is missing. Do not put pasted rules inside the markers.

Report the files updated, the sections included, the verify lines, and each pasted rule kept or dropped.
