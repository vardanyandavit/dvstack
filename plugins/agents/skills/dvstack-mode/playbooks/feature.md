# Playbook: feature

1. If the repo is unfamiliar, load and follow `repo-recon`.
2. Load and follow `agent-ops-bar`: agree done, constraints, files in scope, blast-radius bar.
3. Load and follow `coding-rules`. Apply every rule the change can violate. Walk its verification checklist before claiming done.
4. If the change crosses module boundaries or data shape is unclear, deepen with `agent-rigor` (short restatement only).
5. Route domain needs with `using-dvstack` (UI testability → frontend; e2e → testing; agent systems → harness). Load only the narrowest matching skills.
6. Implement the smallest change that meets done. `coding-rules` decides how that change is written.
7. Load and follow `verify-loop`; run the honest check.
8. If a miss will recur, load `agent-trust-stack` and promote the fix up the ladder — a type, lint, or CI check when the rule can be mechanical.
