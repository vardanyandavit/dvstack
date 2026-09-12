# Agent notes for this repository

Same as `AGENTS.md`. DVstack is a plugin marketplace of skills. When writing or reviewing code with agents, follow `plugins/agents/skills/agent-ops-bar/SKILL.md`. For verification or design exploration, also follow `plugins/agents/skills/agent-rigor/SKILL.md`.

Light by default. Scale with blast radius. Stay token-efficient.

Compressed bar:
- Match the bar to blast radius (higher for money, auth, user data).
- Agree done + constraints, then let the agent work; reject bad changes before PR.
- One honest verify path; encode repeated misses into skills or rules.
- Hold design and quality without process theater.

Install for other projects: `dvstack-agents` from this marketplace (see README).
