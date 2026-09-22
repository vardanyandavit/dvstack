# Playbook: bugfix

1. Reproduce first (failing test, script, or exact manual steps). No fix without a repro.
2. Load `agent-ops-bar`: scope the fix; no drive-by refactors.
3. Load and follow `coding-rules` for the fix. Read `references/prove.md` before adding or changing a test, and see that test fail once.
4. Root-cause before patching. If stuck twice on the same premise, use `doubt-check` / `agent-rigor`.
5. Route domain (e.g. flaky e2e → testing skills via `using-dvstack`).
6. Smallest fix at the root cause. Fix the class when the same pattern lives elsewhere, per `coding-rules`.
7. `verify-loop`: prove the repro is green; run the honest project check.
8. `agent-trust-stack`: if this class of bug can return, encode CI/lint/structure — not only a comment.
