# Agent notes for this repository

Same as `AGENTS.md`. DVstack is a plugin marketplace of skills. When writing or reviewing code with agents, follow `plugins/agents/skills/agent-ops-bar/SKILL.md`. For verification or design exploration, also follow `plugins/agents/skills/agent-rigor/SKILL.md`.

Light by default. Scale with blast radius. Stay token-efficient.

Compressed bar:
- Spend where it changes the result, save where it does not; narrow and cheap first, escalate on evidence.
- Throwaway vs production: production needs a higher bar (esp. money, auth, user data).
- Agree done, constraints, and the files in scope; then let the agent work; reject bad changes before PR.
- Agents need verify loops (build/test/lint); keep the inner loop narrow, full suite before the PR.
- Encode repeated misses into skills or rules; keep always-on files short, detail goes in skills.
- No unasked refactors, speculative layers, or summaries nobody asked for — ship the change plus its proof.
- Hold design and quality; blast radius decides how deep you read and how much you spend.

Install for other projects: `dvstack-agents` from this marketplace (see README).
