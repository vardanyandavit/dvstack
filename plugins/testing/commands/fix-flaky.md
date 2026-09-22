---
description: Diagnose and fix a flaky, intermittent, or CI-only Playwright test at its root cause
disable-model-invocation: true
---

# Fix a flaky test

Load and follow the `playwright-step-validation` skill (Claude Code: Skill tool, `dvstack-testing:playwright-step-validation`; do not search the project for `SKILL.md`). If it does not load, say so and stop.

1. Reproduce: `npx playwright test <spec> --repeat-each=10 --workers=4`. If it only fails in CI, get the trace from the CI artifact.
2. Read the trace's before-snapshot at the failing action. Name the cause from the skill's table before changing any code.
3. Fix the cause: wait on the right state, isolate the data, or freeze the non-determinism. No timeout, sleep, retry, or `workers: 1`.
4. If the cause is a product bug, say so and leave the test red.
5. Prove it: `--repeat-each=20 --workers=4` passes, alone and in the full suite.

Report: the cause, the evidence from the trace, the fix, and the real run output.
