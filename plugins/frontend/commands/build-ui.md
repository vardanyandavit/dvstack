---
description: Build or change UI components that tests and AI agents can drive
disable-model-invocation: true
---

# Build testable UI

Load and follow the `testable-ui` skill (Claude Code: Skill tool, `dvstack-frontend:testable-ui`; do not search the project for `SKILL.md`). If it does not load, say so and stop.

1. Read the nearest existing component and follow its patterns: framework, styling, and how it names test ids.
2. Build it with native elements and accessible names first. Add a `data-testid` only where the skill says a role cannot work.
3. Loading, empty, and error states render in the DOM, and async results are announced.
4. Prove it: the typecheck or build passes. If dvstack-testing is installed, add one test that queries by role, following the `add-tests` command's steps.

Report: the components changed, the locator a test would use for each control, and the real check output.
