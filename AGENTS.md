# Agent notes for this repository

DVstack is a plugin marketplace of skills. Limits: `CONSTRAINTS.md`.

Editing this repo:
- A skill earns its place only with content a modern model would not produce unprompted — house conventions, copyable files, APIs newer than training. Cut general good practice.
- Skill descriptions are always in context: one or two sentences, key use case first, under 300 characters.
- One call per plugin. A command exists only when the job needs several skills (`playwright`). A single-skill job is the skill. Rules in `CONSTRAINTS.md`.
- Framework APIs in a skill are checked against the installed version's official docs before shipping.
- `node scripts/check-marketplace.mjs` passes. Measure a skill change with `claude plugin eval` (see `docs/evals.md`) — the with/without delta is the proof.
