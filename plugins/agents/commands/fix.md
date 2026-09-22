---
description: Fix a bug — reproduce first, find the root cause, minimal fix, prove it
disable-model-invocation: true
---

# Fix a bug

Load skills with the Skill tool in Claude Code (`<plugin>:<name>`), by name in Cursor; do not search the project for `SKILL.md`. If a skill does not load, say so and stop.

1. Unfamiliar repo or area → load and follow the `repo-recon` skill.
2. Reproduce it: a failing test if the repo has a runner, otherwise exact steps or a script. Show it failing. No reproduction, no fix — report what you tried.
3. Name the root cause in one or two sentences, with the evidence. Fix the cause, not the symptom.
4. Make the smallest fix. Search for the same pattern elsewhere and list the hits; fix them only if the user agrees.
5. A flaky e2e test instead of a product bug → follow the `fix-flaky` command's steps, if dvstack-testing is installed.
6. Load and follow the `verify-loop` skill: the reproduction is now green, and the wider check still passes.

Report: the cause, the fix, the proof, and any other places the pattern lives.
