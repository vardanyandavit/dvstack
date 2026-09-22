---
description: Rewrite, refactor, or migrate existing code in safe slices without changing behaviour
disable-model-invocation: true
---

# Rewrite

Load skills with the Skill tool in Claude Code (`<plugin>:<name>`), by name in Cursor; do not search the project for `SKILL.md`. If a skill does not load, say so and stop.

1. Load and follow the `repo-recon` skill. Name what must not change: public API, behaviour, data.
2. Pin the behaviour first. If tests do not cover it, add characterisation tests and see them pass on the old code.
3. Propose the slices — each one small and shippable alone — and confirm with the user before a large rewrite.
4. Per slice: change, then run the `verify-loop` skill's narrow check, then continue. Delete the old path in the same slice that replaces it.
5. Either convert the whole area or follow the existing pattern. Never leave two patterns without saying which one is current.
6. A Playwright suite → use the `rewrite-suite` command's steps instead, if dvstack-testing is installed.

Before calling it done, run the full check. Report per slice what moved, and the real output.
