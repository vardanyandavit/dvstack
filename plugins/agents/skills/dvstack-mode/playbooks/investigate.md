# Playbook: investigate

Read-only how/why. No code changes unless the user asks.

1. `repo-recon` if unfamiliar.
2. Answer from evidence (code, tests, traces, docs). Use `source-check` for framework behavior.
3. If the question is whether the code meets the engineering bar, load `coding-rules` and only the references the question touches.
4. `doubt-check` once on the key conclusion if stakes are high.
5. Keep the write-up short. Route to a build/fix playbook only if the user then asks to change code.
