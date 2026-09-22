---
description: Audit UI components for testability and agent-drivability, then fix what blocks role-based locators
disable-model-invocation: true
---

# Review UI for testability

Load and follow the `testable-ui` skill (Claude Code: Skill tool, `dvstack-frontend:testable-ui`; do not search the project for `SKILL.md`). If it does not load, say so and stop.

1. Scope: the components or diff the user named. Otherwise the components the current e2e tests reach with CSS or XPath.
2. For each problem give file:line, the rule from the skill, the markup fix, and the locator it enables — `getByRole(...)`, not a class name.
3. Order the findings: controls with no accessible name, then `div` click handlers, then ambiguous duplicates, then missing states.
4. Fix only if the user asks. When you fix, update any test selector that the change breaks.

End with a count: controls reachable by role before and after.
