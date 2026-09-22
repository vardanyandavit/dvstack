---
name: coding-rules
description: >-
  Use when writing, changing, or reviewing code, including every dvstack-mode
  playbook that touches code. Short rules for every change. Open a reference
  only when its trigger matches. Not a formatter, and not a database or
  infrastructure tutorial.
---

# Coding rules

What the code must be. How you work is `agent-ops-bar`. The check is `verify-loop`. Where a lasting fix lives is `agent-trust-stack`.

Follow **Every change** on code you touch. Open a reference only when its trigger matches this change. Do not open the others. A rule the change cannot touch is met by inspection.

Project conventions win on formatting, lint, and local style. These rules win on correctness. A rule that can be a type, a lint, or a CI check should become one.

## Every change

- Name by intent, and put a real side effect in the name. If you cannot say what it does in one sentence, fix that, not the length. Explicit over clever.
- Deep modules: a small interface in front of real behavior. A layer that only forwards the call has not earned a file. Write the call site before the implementation.
- Comment the why (constraint, surprise, rejected alternative). A restatement is noise. A contradiction is a bug. Delete dead code, unused imports, obsolete dependencies, and finished flags. A flag gets a removal ticket the day it is created; still on at 100% after six months, that ticket is overdue.
- Build for current requirements. A boundary may leave room for a later change. Do not build that change now. Formatting, lint, and types stay in tools.
- Make the wrong call hard: types, defaults, lint, CI, or a wrapper. Invalid states die at the boundary or in the constructor. In a weak type system, stop there.
- Validate untrusted input, then use a domain type. Escape for the context (HTML, SQL, shell, URL). Do not execute untrusted bytes or loosely deserialize them. Required config fails at startup. No silent default. Bound sizes, pages, queues, retries, caches, recursion, strings, and concurrency.
- Authorize the record, not only the route. Parameterized queries, managed secrets, server-side checks. Deny by default. Hidden UI is not a control.
- Keep calculations pure. Effects stay at the edge: one writer of mutable state, immutable messages, bounded queues with backpressure. Do not mutate a caller's value. No lock or database transaction across I/O or another service. Release what you acquire, including on failure. A multi-step write is one transaction or an explicit compensation. Check-then-act across a process is a race: unique constraint, upsert, compare-and-swap, or row lock. "It cannot happen fast enough" is not an argument.
- A catch handles or rethrows with context, not both. An empty catch swallowed the failure. Domain errors and system failures are handled differently. A programmer error crashes the unit of work and is not retried. Every outbound call has a timeout shorter than the caller's deadline.
- Small and reversible. Compatible where deploys are not atomic. When a feature does not fit, reshape in a behavior-preserving commit first. Do not hide a large refactor in the feature. Read the history before deleting a strange check. Read your whole diff, and say what, why, how verified, what can break, and how to roll back.
- You own generated code. Do not merge an API you cannot explain (`source-check`). Do not hand-roll crypto, TLS, auth, money math, date math, encoding, or parsers. An agent does not declare prototype mode. If the user did not say it cannot be deployed, it is production.

## Open only the references that match

| Trigger | Read |
|---|---|
| Schema, migration, event, time, money, text, ids, personal data, or backup | `references/data.md` |
| Retries, idempotency, logs, metrics, traces, or alerts | `references/failure.md` |
| A new or changed test, a flake, or a coverage claim | `references/prove.md` |
| A flag, a compatibility break, a rollback, or an incident | `references/outcome.md` |
| Deduping, a performance change, a new dependency, a second pattern, or a service split | `references/tradeoffs.md` |

## Verification

- [ ] Every-change rules applied to the lines you touched
- [ ] Each matching reference was read, and the others were not
- [ ] A contested trade-off, if you made one, is named in the description
- [ ] A rule that can be a type, lint, or CI check was promoted

## Not this skill

- Scope and blast radius → `agent-ops-bar`
- The verify command → `verify-loop`
- Where the fix lives → `agent-trust-stack`
- Framework APIs → `source-check`
- Playwright → `dvstack-testing`
- Agent harness → `harness-engineering`
