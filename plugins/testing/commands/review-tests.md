---
description: Review Playwright test code or a PR against DVstack house rules, including agent-written and healed tests
disable-model-invocation: true
---

# Review Playwright tests

Load and follow the `playwright-code-review` skill (Claude Code: Skill tool, `dvstack-testing:playwright-code-review`; do not search the project for `SKILL.md`). If the diff was written or healed by an agent, also load the `playwright-agents` skill. If a skill does not load, say so and stop.

1. Scope: the diff or the files the user named. Otherwise the branch diff against its base.
2. Run `npx eslint` and `npx tsc --noEmit` on the changed files, if the project has them, so review time goes to what tools cannot catch.
3. Walk the review order. Blockers first.
4. For each finding give file:line, the group, and the replacement as code. Mark each one **blocks** or **suggestion**.
5. For a healed diff, count assertions before and after.

Do not edit files unless the user asks. End with a verdict: merge, merge after the blockers are fixed, or rework.
