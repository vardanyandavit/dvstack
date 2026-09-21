# Playbook: bugfix

1. Reproduce first (failing test, script, or exact manual steps). No fix without a repro.
2. Load `agent-ops-bar`: scope the fix; no drive-by refactors.
3. Root-cause before patching. If stuck twice on the same premise, use `doubt-check` / `agent-rigor`.
4. Route domain (e.g. flaky e2e → testing skills via `using-dvstack`).
5. Smallest fix at the root cause.
6. `verify-loop`: prove the repro is green; run the honest project check.
7. `agent-trust-stack`: if this class of bug can return, encode CI/lint/structure — not only a comment.
