---
description: Force all DVstack Playwright skills for this task
---

# Playwright (whole plugin)

The user wants Playwright changes in this task to respect the installed **dvstack-testing** skills. Do not improvise a parallel test style.

Load the relevant skills below with the Skill tool (namespaced as `dvstack-testing:<name>`) and follow
them. Each skill arrives with its own base directory — do not go looking for `SKILL.md` on disk, and do
not answer from general knowledge if a skill fails to load.

Relevant skills:

- `playwright-naming-conventions`
- `playwright-test-architecture`
- `playwright-test-strategy`
- `playwright-step-validation`
- `playwright-fixtures`
- `playwright-locators`
- `playwright-auth-and-roles`
- `playwright-test-data`
- `playwright-api-testing`
- `playwright-network-mocking`
- `playwright-hard-interactions`
- `playwright-mobile-web`
- `playwright-accessibility-testing`
- `playwright-visual-testing`
- `playwright-code-review`
- `playwright-debugging`
- `playwright-flaky-tests`
- `playwright-ci`
- `playwright-agents`
- `playwright-migration`

For a focused task, prefer the matching single-skill command (for example `/dvstack-testing:locators`). Use this command when the change spans architecture, strategy, writing, or review.

Before finishing: self-check against the `dvstack-testing:playwright-code-review` skill and the naming/architecture conventions. Do not invent patterns that contradict those skills.
