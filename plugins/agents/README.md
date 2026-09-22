# DVstack Agents

Two portable habits for any coding agent. Everything else a current model already does — quality bar, rigor, session hygiene, general coding rules — was removed because it measured no effect and cost context on every turn (see [evals](../../docs/evals.md)).

| Skill | What it does | Ask for it with |
|---|---|---|
| [repo-recon](skills/repo-recon/) | Bounded orientation before the first edit: package manager from the lockfile, verify commands from CI, enforced conventions, scope, blast radius — as a three-to-five-line note | "orient in this repo first" |
| [verify-loop](skills/verify-loop/) | Find the enforced check, run the narrowest one, widen before the PR, report real output and what was not checked | "prove this works" |

System concerns — contracts, tool gates, recover loops, CI — live in `dvstack-harness`.

## Commands

| Command | Use it to |
|---|---|
| `build` | Build a feature: orient, agree done, implement, prove |
| `fix` | Fix a bug: reproduce, root cause, minimal fix, prove |
| `rewrite` | Refactor or migrate in behaviour-preserving slices |
| `review` | Review a diff for correctness, scope, and proof |

They hand off to testing, frontend, and harness skills when those plugins are installed. Claude Code: `/dvstack-agents:<command>`. Cursor: `/<command>`.

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.
