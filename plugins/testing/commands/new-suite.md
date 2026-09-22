---
description: Create a new Playwright e2e suite from scratch with DVstack house conventions
disable-model-invocation: true
---

# New Playwright suite

Load and follow the `playwright-test-architecture` skill and the `playwright-step-validation` skill (Claude Code: Skill tool, `dvstack-testing:<name>`; do not search the project for `SKILL.md`). If one does not load, say so and stop.

1. Read the lockfile and any existing e2e config. If a Playwright suite already exists, stop and point to the `add-tests` command or the `rewrite-suite` command.
2. Copy the architecture skill's `files/` templates; adapt routes, endpoints, and accounts to this app.
3. Write the first spec for the flow the user named — every step ends in a validation.
4. Run that spec, then the suite with `--repeat-each=3 --workers=4`.
5. Check the diff against the blockers in the `playwright-code-review` skill and fix them.

Done: the suite passes from a clean checkout with no `.auth/`. Report the commands you ran and their real output.
