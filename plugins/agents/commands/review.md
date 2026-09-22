---
description: Review a diff or PR for correctness, scope, and proof, routing tests and UI to their house rules
disable-model-invocation: true
---

# Review

Load skills with the Skill tool in Claude Code (`<plugin>:<name>`), by name in Cursor; do not search the project for `SKILL.md`. If a skill does not load, say so and stop.

1. Scope: the PR, the diff, or the files the user named. Otherwise the branch diff against its base. Read the stated goal.
2. Route the files, if those plugins are installed:
   - Playwright tests → the `playwright-code-review` skill
   - UI components → the `testable-ui` skill
   - Agent tools and gates → the `safeguard-parity` skill and the `agent-tool-design` skill
3. Check that the diff does what the goal says, and nothing else: no unasked refactors, no dead code, no guessed APIs.
4. Look for correctness risks: edge cases, error paths, auth and data boundaries, concurrency, breaking changes for callers.
5. Look for proof: tests that fail without the change. Run the project's check, per the `verify-loop` skill.

For each finding give file:line, why it matters, and a concrete fix. Mark each one **blocks** or **suggestion**, blockers first. Do not edit files unless asked. End with a verdict.
