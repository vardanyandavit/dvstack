---
description: Rewrite an existing Playwright suite, or migrate from Cypress/Selenium, to DVstack house conventions
disable-model-invocation: true
---

# Rewrite or migrate a suite

Load and follow the `playwright-test-architecture` skill, the `playwright-step-validation` skill, and the `playwright-code-review` skill — its migration rules apply (Claude Code: Skill tool, `dvstack-testing:<name>`; do not search the project for `SKILL.md`). If one does not load, say so and stop.

1. Inventory the current suite: specs, helpers, custom commands, and how it runs in CI. Note the pass rate.
2. For each test decide **port, rewrite, or delete** — delete any test nobody can name a risk for. Show the list before you edit anything.
3. Lay down the target structure (templates from the architecture skill) next to the old suite.
4. Work in thin slices, one flow at a time. Each slice is green with `--repeat-each=3`, and its old tests are deleted in the same change.
5. Never port a sleep, an implicit wait, a retry wrapper, or a structural selector. Custom commands become fixtures.
6. Keep one suite blocking CI at a time.

Report per slice: tests ported, rewritten, and deleted, and the real run output.
