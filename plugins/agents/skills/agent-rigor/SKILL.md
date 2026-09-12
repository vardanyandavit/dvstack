---
name: agent-rigor
description: Use when agent work needs verification, design exploration, or a better harness. Complements agent-ops-bar. Light by default; add cost only when risk or ambiguity is high.
---

# Agent rigor

Keep standards. Stay cheap by default. Scale with blast radius.

## Always (cheap)

1. **Done + proof.** Know what done looks like and how you will prove it.
2. **Enough context.** Relevant code, flows, and constraints — not a whole-repo dump.
3. **Evidence over vibes.** Mechanism and a real check beat unsupported confidence.
4. **Small steps.** Self-contained, independently verifiable increments.
5. **Encode repeats.** If the same miss or friction happens twice, write it into a rule or skill.

## When risk or ambiguity is high

- **Restate first** before editing.
- **Check live** — inspect the real app, not only “tests passed.”
- **Compare options lightly** — spikes and measurements, not committees.
- **Smell chronic hacks** — repeated escape hatches mean reconsider the design.
- **Isolate parallel work** only when you are actually parallelizing.

## Do not by default

- Review swarms on tiny PRs
- Long planning for obvious fixes
- Automate everything before one verify works
- Paste essays into every project

## Start small

One trusted verify path is enough. Grow the harness when the same check keeps slowing you down.
