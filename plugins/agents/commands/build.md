---
description: Build a new feature or app — orient, agree done, implement, prove it
disable-model-invocation: true
---

# Build

Load skills with the Skill tool in Claude Code (`<plugin>:<name>`), by name in Cursor; do not search the project for `SKILL.md`. If a skill does not load, say so and stop.

1. Unfamiliar repo or area → load and follow the `repo-recon` skill. Post the recon note.
2. State what done means, and what is out of scope, in two or three lines. If the ask is ambiguous, ask one question before you edit.
3. Route by what the change touches, if that plugin is installed:
   - UI components → the `testable-ui` skill
   - e2e tests for the feature → the `add-tests` command's steps
   - A tool-using agent → the `design-agent` command's steps
4. Implement the smallest change that meets done, following the patterns of the nearest sibling file.
5. Load and follow the `verify-loop` skill.

Report: what changed, the proof (command and real output), and what was not verified.
