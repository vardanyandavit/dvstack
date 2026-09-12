# Agent notes for this repository

DVstack is a plugin marketplace of skills. When writing or reviewing code with agents, follow `plugins/agents/skills/agent-ops-bar/SKILL.md`. For verification, design exploration, or a better harness, also follow `plugins/agents/skills/agent-rigor/SKILL.md`.

Compressed bar:
- Throwaway vs production: production needs a higher bar (esp. money, auth, user data).
- Agree done + constraints, then let the agent work; reject bad changes before PR.
- Agents need verify loops (build/test/lint); encode repeated misses into skills or rules.
- Hold design and quality; blast radius decides how deep you read.

Install for other projects: `dvstack-agents` from this marketplace (see README).
