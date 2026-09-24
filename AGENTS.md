# Agent notes for this repository

DVstack is a plugin marketplace of skills. Limits: `CONSTRAINTS.md`.

Editing this repo:
- A skill earns its place only with content a modern model would not produce unprompted — house conventions, copyable files, APIs newer than training. Cut general good practice.
- Skill descriptions are always in context: one or two sentences, key use case first, under 300 characters.
- One call per plugin. A command exists only when the job needs several skills (`playwright`). A single-skill job is the skill. Rules in `CONSTRAINTS.md`.
- Framework APIs in a skill are checked against the installed version's official docs before shipping.
- `node scripts/check-marketplace.mjs` passes. Measure a skill change with `claude plugin eval` (see `docs/evals.md`) — the with/without delta is the proof.

## Token and session cost

Cost is the finished task. Fewer turns and fewer retries beat a cheaper rate that forces a redo.

- Verify with the real check for this change. Here that is `node scripts/check-marketplace.mjs`, plus the narrowest test or build the repo already has. A check that fails early is cheaper than more thinking on the next turn.
- On a stall in well-scoped work, raise the reasoning budget before switching models. Use a lower budget for mechanical renames and repeated patterns. Change effort or model only at a natural break — a settings change mid-run busts the prefix cache.
- Daily supervised coding stays on the main coding model. Move to a frontier model only after the same problem fails twice at high effort. Cheap models are for search and log-lookup subagents, not primary code edits.
- Keep this file well under ~200 lines. Every line is resent every turn. Playbooks live in skills that load on demand.
- Set tools, MCP, and effort at session start. Leave them stable for the run. Clear context between unrelated tasks. At a break, compact and say what to keep. Disconnect MCP servers the task is not using.
- After a real task, read session usage: input, output, and cache share. Low cache on a long run, huge output on a tiny change, or input far above the conversation size means wasted turns.
