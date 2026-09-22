# Playbook: rewrite

For migrating or rewriting a codebase or suite (example: old Playwright repo → DVstack testing conventions).

1. `repo-recon`: stack, lockfile, current verify command, layout, blast radius.
2. `agent-ops-bar`: define done for this slice (not “rewrite everything”); constraints; what must not break.
3. Load `coding-rules`. Read `references/tradeoffs.md` and name the consistency-vs-improvement call: convert this slice with a guard, or follow the existing convention.
4. `using-dvstack`: pick the domain plugin the user named (or infer). For Playwright rewrites, load architecture/strategy first, then locators/fixtures/auth/data as each slice needs — never all twenty skills at once.
5. `agent-trust-stack`: make the easy path the right path; plan mechanical guards for old bad patterns as you touch them.
6. Rewrite in thin vertical slices; each slice ends in `verify-loop`.
7. Comments follow `coding-rules`: why only. Delete narration that excused the old debt.
8. Before calling the whole rewrite done: full honest suite (or the agreed subset) via `verify-loop`.
