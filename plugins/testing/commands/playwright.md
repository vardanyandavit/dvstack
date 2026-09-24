---
description: Create, add, rewrite, review, or fix Playwright tests. Reads the repo and the ask, then loads only the skills that job needs.
disable-model-invocation: true
---

# Playwright

Decide the job from the user's message and the repo, then load only that row (Claude Code: Skill tool, `dvstack-testing:<name>`; do not search the project for `SKILL.md`). If a skill in the row does not load, say so and stop.

**Create** — no Playwright suite. Load and follow the `playwright-test-architecture` skill and the `playwright-step-validation` skill. Copy its templates, adapt them to this app, and write the first spec for the flow the user named. If a suite already exists, switch to Add or Rewrite. Run that spec, then the suite with `--repeat-each=3 --workers=4`. Check the diff against the blockers in the `playwright-code-review` skill and fix them. Done when the suite passes from a clean checkout with no `.auth/`. Report the commands and their real output.

**Add** — the suite exists and the user wants more tests. Load the same two skills, then the blockers in the `playwright-code-review` skill. Read the config, fixtures, and one neighbouring spec first. If the suite's conventions differ, follow the suite and say so. Name the risk each new test protects. Skip anything a unit or API test already proves. Run the new tests, then `--repeat-each=3 --workers=4`. Break the behaviour once and see each new assertion fail. Report the tests, the risk each covers, and the real output.

**Rewrite** — rewrite the suite, or move it from Cypress or Selenium. Load and follow the `playwright-test-architecture` skill, the `playwright-step-validation` skill, and the `playwright-code-review` skill, including its migration rules. Inventory the suite and show a port / rewrite / delete list before editing. Work one flow at a time: the slice is green with `--repeat-each=3`, and its old tests are deleted in the same change. One suite blocks CI at a time. Report per slice what was ported, rewritten, and deleted, and the real output.

**Review** — the user wants a review. Load and follow the `playwright-code-review` skill. When an agent wrote or healed the diff, also load the `playwright-agents` skill. Scope is the diff or the files named, otherwise the branch diff. Run `npx eslint` and `npx tsc --noEmit` on the changed files when the project has them. Do not edit unless asked. For each finding give file:line, the group, and the replacement. Mark **blocks** or **suggestion**. End with a verdict: merge, merge after the blockers, or rework.

**Flaky** — a test fails sometimes, or only in CI. Load and follow the `playwright-step-validation` skill. Reproduce with `--repeat-each=10 --workers=4`, or the CI trace. Name the cause before changing code. If the cause is a product bug, leave the test red. Prove the fix with `--repeat-each=20 --workers=4`, alone and in the full suite. Report the cause, the trace evidence, the fix, and the real output.

**Agent-written** — the user wants the planner, generator, or healer to write tests. Load the `playwright-agents` skill, then review the result with the `playwright-code-review` skill.
