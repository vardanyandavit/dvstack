# Playbook: harden

Security, reliability, or performance work on existing code — still global habits, not a textbook.

1. `agent-ops-bar`: name the threat or metric; define done and must-not-break.
2. Load `coding-rules`. Read only the references the threat matches. Do not open the rest.
3. `repo-recon` if ownership/entry points are unclear.
4. Prefer root-cause and boundaries (`agent-rigor` when ambiguous). Do not spray drive-by cleanups.
5. Domain routing via `using-dvstack` when the surface is e2e, UI, or an agent system.
6. Encode lasting controls with `agent-trust-stack` (types, lint, CI, paved path) — not comment warnings.
7. `verify-loop` against a real repro or benchmark you recorded, not vibes.
