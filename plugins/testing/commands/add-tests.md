---
description: Add Playwright tests for a feature or flow to an existing suite
disable-model-invocation: true
---

# Add Playwright tests

Load and follow the `playwright-test-architecture` skill and the `playwright-step-validation` skill (Claude Code: Skill tool, `dvstack-testing:<name>`; do not search the project for `SKILL.md`). If one does not load, say so and stop.

1. Read the existing suite first: config, fixtures, the page objects the flow touches, one neighbouring spec.
2. If the suite's conventions differ from the skills, follow the suite and say so — do not mix two styles. Converting it is the `rewrite-suite` command.
3. Name the risk each new test protects. Skip anything a unit or API test already proves.
4. Reuse page objects and fixtures; add getters at the right locator tier; create the data each test needs.
5. Run the new tests alone, then with `--repeat-each=3 --workers=4`. Break the behaviour once to see each new assertion fail.
6. Check the diff against the blockers in the `playwright-code-review` skill.

Report: tests added, the risk each one covers, and the real run output.
