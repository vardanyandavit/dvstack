# Agent notes for this repository

DVstack is a plugin marketplace of skills. Which plugin or skill applies: `plugins/agents/skills/using-dvstack/SKILL.md`. Starting in an unfamiliar repo: `plugins/agents/skills/repo-recon/SKILL.md`. When writing or reviewing code with agents, follow `plugins/agents/skills/agent-ops-bar/SKILL.md` and `plugins/agents/skills/coding-rules/SKILL.md`; to find and run the project's honest check, `plugins/agents/skills/verify-loop/SKILL.md`. For session and token hygiene, follow `plugins/agents/skills/agent-session/SKILL.md`. When ambiguity or risk is high and you need to deepen, follow `plugins/agents/skills/agent-rigor/SKILL.md`. Where a lasting agent fix should live, or before scaling agent count: `plugins/agents/skills/agent-trust-stack/SKILL.md`. Nontrivial work that should apply the global bar and route to domain skills: `plugins/agents/skills/dvstack-mode/SKILL.md`. For multi-step or side-effectful agent systems, see `plugins/harness/skills/harness-engineering/SKILL.md`.

Light by default. Scale with blast radius. Stay token-efficient.

Compressed bar:
- Orient before editing an unfamiliar repo; read the lockfile and the enforced config, not the whole tree.
- Spend where it changes the result, save where it does not; narrow and cheap first, escalate on evidence.
- Throwaway vs production: production needs a higher bar (esp. money, auth, user data).
- Agree done, constraints, and the files in scope; then let the agent work; reject bad changes before PR.
- Agents need verify loops (build/test/lint); keep the inner loop narrow, full suite before the PR. Never claim a run that did not happen.
- Encode repeated misses into skills or rules; keep always-on files short, detail goes in skills.
- No unasked refactors, speculative layers, or summaries nobody asked for — ship the change plus its proof.
- Hold design and quality; blast radius decides how deep you read and how much you spend.
- Code an agent writes or changes follows `coding-rules` (dvstack-mode loads it): intent, correctness that cannot be bypassed, data shape, bounded effects, loud failure, tests of behavior, and a reversible outcome.

Editing this repo: skills stay one narrow subject each, agents-vs-harness stays separated (point, don't duplicate), framework APIs are checked against official docs before shipping, and `node scripts/check-marketplace.mjs` passes. Limits: `CONSTRAINTS.md`.

Install for other projects: `dvstack-agents` and `dvstack-harness` from this marketplace (see README).
