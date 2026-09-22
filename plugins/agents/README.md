# DVstack Agents

Two portable habits for any coding agent. Everything else a current model already does — quality bar, rigor, session hygiene, general coding rules — was removed because it measured no effect and cost context on every turn (see [evals](../../docs/evals.md)).

| Skill | What it does | Ask for it with |
|---|---|---|
| [repo-recon](skills/repo-recon/) | Bounded orientation before the first edit: package manager from the lockfile, verify commands from CI, enforced conventions, scope, blast radius — as a three-to-five-line note | "orient in this repo first" |
| [verify-loop](skills/verify-loop/) | Find the enforced check, run the narrowest one, widen before the PR, report real output and what was not checked | "prove this works" |

System concerns — contracts, tool gates, recover loops, CI — live in `dvstack-harness`.

## Commands

Type one command, then the task. The case list, including which skills each command loads, is in the [repository README](../../README.md#which-command).

| Case | Cursor | Claude Code |
|---|---|---|
| Build a feature | `/build` | `/dvstack-agents:build` |
| Fix a product bug | `/fix` | `/dvstack-agents:fix` |
| Refactor or migrate app code | `/rewrite` | `/dvstack-agents:rewrite` |
| Review a diff or PR | `/review` | `/dvstack-agents:review` |

These hand off to testing, frontend, and harness when those plugins are installed. A Playwright suite uses the testing commands (`/new-suite`, `/add-tests`, `/rewrite-suite`, `/review-tests`, `/fix-flaky`).

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-agents`.
