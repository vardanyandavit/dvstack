---
name: coding-rules
description: >-
  Use when writing, changing, or reviewing code, including every dvstack-mode
  playbook that touches code. Rules the change itself must satisfy: readable
  intent, correctness that cannot be bypassed, data that outlives the code,
  isolated effects, loud failure, tests of behavior, and an owned outcome.
  Not a formatter, and not a database or infrastructure tutorial.
---

# Coding rules

These are the rules for code you write or change. `agent-ops-bar` is how you work. `agent-trust-stack` is where a lasting fix lives. `verify-loop` is how you prove the run. This skill is what the code must be.

Apply every rule the change can violate. A rule the change cannot touch is met by inspection — do not add a backup drill, a migration, or a new abstraction just to demonstrate it.

Project conventions win on formatting, lint, and local style. These rules win on correctness. Where the project already enforces a rule with a type, a lint, or CI, use that mechanism.

A rule that lives only in this file is a suggestion. When a rule can become a type, a lint rule, or a CI check in the project you are in, add that too (`agent-trust-stack`).

## 1. Optimize for the next reader

They are unfamiliar with the feature, under time pressure, and possibly you in six months.

- Name by intent, not mechanism. Reveal an important side effect in the name.
- If naming is hard, try to explain the thing in one sentence to a domain expert. If you can't, that is the problem to fix, not the function's length.
- Prefer explicit and unsurprising. Cleverness is a loan against future maintenance.
- Prefer deep modules: a small interface in front of a lot of behavior. A layer that forwards each call to the layer below adds files to read and hides nothing. If understanding the interface takes as long as understanding the implementation, the module is not paying for itself.
- Write the call site before the implementation. Bad ergonomics are obvious from outside a module and invisible from inside it.
- Comment the why: constraints, surprising decisions, rejected alternatives. Delete comments that no longer match reality. A comment that restates the code is noise. A comment that contradicts the code is a bug with a longer life than most.
- Delete dead code, unused imports, obsolete dependencies, and finished feature flags. Git preserves history. A flag gets its removal ticket the day it is created; a flag at 100% for six months means that ticket is overdue.
- Build for current requirements. Create boundaries that make a future change possible, and do not implement that change now.
- Follow project conventions over personal preference. Settle formatting, linting, and type checking with tools so they never reach review.

## 2. Put correctness where it can't be bypassed

Anything that depends on an engineer remembering will eventually not happen. That includes this skill.

- Make the correct path the easy path. Move rules into types, defaults, lint, templates, CI, or wrappers that make the unsafe call unreachable.
- Make invalid states hard to represent, via types, constructors, and encapsulation. In a weak type system this pays at boundaries and at construction, and becomes noise everywhere else. A constructor-time check with a good error message is a legitimate stopping point.
- Validate external input at every trust boundary (APIs, users, files, queues, config, third parties), then convert it into trusted domain types. Sanitization is context-specific: HTML, SQL, shell, and URLs need different escaping. Do not turn untrusted bytes into executable code, and do not loosely deserialize them into live objects.
- Fail at startup, not at request time. Parse configuration, environment, and required connections into typed values when the process boots. A missing variable fails the deploy. Do not add a silent default that hides a required value until a user hits that path.
- Bound everything: request bodies, list and page sizes, queue depths, retry counts, cache entries, recursion depth, string lengths, concurrent connections. Unbounded is a bug waiting for load.
- Security belongs in the default path: least privilege, parameterized queries, managed secrets, output encoding, server-side authorization. Hidden UI controls and client-side validation are not controls.
- Authorize the object, not just the route. "May this user call this endpoint" and "may this user see this record" are different checks. Skipping the record check is broken object-level authorization. Deny by default.

## 3. Respect the data

Code is rewritten in an afternoon. Data is forever, and consumers you don't control are coupled to its shape.

- Schemas, API contracts, and event payloads get disproportionate design care relative to the code that reads them.
- Push invariants into the database: NOT NULL, unique constraints, foreign keys, check constraints. They outlive the language, the framework, and the service boundary.
- Add columns rather than repurposing them. Expand, then contract. Version events.
- A migration ships in its own deploy, before the code that needs it, and is either reversible or explicitly declared not to be. In a pull request the migration commit comes first and is safe to deploy alone.
- Time: store instants in UTC. A future event a human scheduled in local time is not an instant; store the local time plus the zone identifier, because zone rules change and the user meant that wall-clock time. Never hand-roll date math.
- Money: integer minor units or decimals, rounding defined explicitly, and the currency stored next to the amount. An amount without a currency is a number, not money. Do not introduce a float amount.
- Text: assume any script and any length. Do not validate names, addresses, or phone numbers against a pattern you invented. Normalize Unicode to one form at the boundary before comparing. A length limit names its unit — bytes, code points, or grapheme clusters — and the API, the store, and the UI use that same unit.
- Identity: keep a stable internal ID. Treat every external identifier (email, username, phone, a third party's ID) as a mutable attribute.
- If you store personal data, the way to delete it is part of the change.
- A backup you have not restored is a hope. When you add or change backup or restore, restore into a scratch environment on a schedule and time it. The restore time is the real recovery objective.

## 4. Isolate effects; assume anything that can interleave, will

- Keep calculations and transformations pure where practical. Push databases, network calls, clocks, randomness, and file access to clear boundaries. The payoff is a core you can test without mocks and an edge you can enumerate.
- A pure core does not make the orchestration around it safe. That is where the races live.
- Do not mutate a value the caller still owns.
- Prefer single-writer ownership of mutable state, immutable messages over shared memory, and bounded queues with backpressure over locks.
- Never hold a lock across I/O. Never hold a database transaction open across a call to another service.
- Release what you acquire — transaction, connection, file, lock, subscription — on every path, including failure.
- A multi-step write is one transaction or an explicit compensation. A sequence that can stop halfway leaves a corrupt record.
- Check-then-act across a process boundary is a race. "Look it up, then insert if missing" belongs to the database: a unique constraint, an upsert, a compare-and-swap, or a row lock. The application-level check is a hint.
- If a correctness argument rests on "that can't happen fast enough," it isn't an argument.

## 5. Fail loudly, recover deliberately

- Never silently swallow a failure. Add context, preserve the original cause, and recover only where recovery is actually valid.
- Every catch either handles or rethrows with context, not both. Logging and rethrowing at every level records the same failure many times and hides which line is real. An empty catch is a swallowed failure.
- Distinguish expected domain errors from unexpected system failures. They get different handling and different alerting.
- Programmer errors (a null that could not happen, an impossible enum value) crash the unit of work loudly. Do not retry them.
- Design for networks timing out, processes restarting, and messages arriving twice: a timeout on every outbound call, idempotency, bounded retries, and transactional boundaries that mean something.
- An outbound timeout is shorter than the caller's deadline, or the caller never observes the failure.
- Retries need exponential backoff, jitter, and a budget. A retry storm is how a blip becomes an outage. Idempotency keys are what make retrying a write safe.
- Make behavior observable with structured logs, metrics, traces, and actionable error messages that carry useful identifiers. Never log passwords, tokens, or sensitive personal data.
- An alert nobody acts on trains the team to ignore alerts. Every alert has an owner and a response, or it is deleted. Do not add an alert you cannot name a response for.

## 6. Prove it where it counts

Test design lives here. Finding and running the project's check is `verify-loop`.

- Test observable contracts: outputs, state transitions, errors, user-visible behavior. Not private implementation steps. An internal test earns its place when it verifies meaningful logic.
- For any test, ask what change would make it fail. If the only answer is renaming a private method, delete it.
- See every new test fail once, by breaking the code or asserting the wrong literal, before you trust it. A test that has never failed has proven nothing.
- Fake only what you must: the clock, the network, the filesystem, the browser, the third party. Prefer a real database in a container to a mock of the database. A test that mocks everything beneath the function under test is asserting the implementation back to itself.
- Control time, randomness, and ordering. A test that reads the wall clock, iterates an unordered set, or depends on which of two async tasks finishes first is a flaky test that has not happened yet.
- Protect trust in the suite. Quarantine a flaky test the day it appears, with an owner and a deadline, or delete it. Do not add a retry to hide it. If the runner retries anyway, a pass on the second attempt is a bug report, not a green build.
- Reproduce before you fix. Write the failing test first.
- Fix the class, not the instance. After the fix, ask where else that pattern lives. If a lint rule or a type can catch the class, add it.
- Coverage measures what ran, not what was checked. Use it to find untested code. It does not prove code is tested. When you want a number that means something, mutation-test the code that matters.

## 7. Own the outcome

Passing tests are not success. Deployment, migration, compatibility, failure modes, and rollback are part of the change.

- Keep changes small and reversible. Preserve backward compatibility wherever deploys are not atomic. A change should be easy to review, test, deploy, and roll back.
- Main stays deployable. Separate deploy from release with a flag when a change is risky. After it ships, watch the metrics it should have moved and the ones it should not have.
- Make the change easy, then make the easy change. When a feature is awkward to add, reshape the code in its own behavior-preserving commit first, then add the feature.
- Leave touched code slightly cleaner. Do not hide a large unrelated refactor inside a feature change.
- Understand before you change. That strange condition is probably somebody's outage: read the history and the reason. The evidence for removing a fence is that you found why it is there and it no longer applies.
- You are the first reviewer. Read your whole diff before asking anyone else to. The description says what changed, why, how you verified it, what could break, and how to roll it back.
- In an incident, restore service first: roll back, flip the flag, fail over. Understand second. Afterwards, a blameless postmortem with action items that have owners.
- You own code you didn't write. Merged is owned, whether it came from a contractor, a forum, or an agent. Review generated code more adversarially than human code: plausible-looking wrongness, APIs that don't exist, handlers that swallow errors, tests that assert the implementation back to you. Do not merge what you cannot explain. Check framework APIs with `source-check`.

## Contested trade-offs

Judgment calls with real costs on both sides. Applying either side by reflex is the failure. When the change actually makes one of these calls, name the side in the description.

- **Duplication vs abstraction.** Do not deduplicate because code looks similar. Deduplicate shared knowledge. The question is: when this rule changes, must all copies change together? If yes, factor it out. If the extraction needs a boolean that selects behavior, you extracted the wrong thing. Sharing inside a module is cheap to undo. Sharing across teams or services is close to permanent. Be liberal locally, conservative across boundaries. Two instances rarely show which parts vary; the third usually does.
- **Performance.** Correctness and clarity first. Do not tune before profiling, and document an intentional trade-off. Complexity class and round-trip count are design decisions: an N+1 baked into a relationship, an unbounded list, a schema whose main query scans the table, a chatty synchronous call between services. Get those right by inspection. Set a budget (p99 latency, bundle size, queries per request) and enforce it in CI. Without a number, "fast enough" is decided by the slowest customer.
- **What you take on.** Every dependency carries security, maintenance, compatibility, and size costs. So does your own code, usually more, where being wrong is subtle and silent: crypto, TLS, date arithmetic, text encoding, parsers, auth, money. For a person: write it yourself if you could reproduce the full spec on a whiteboard and it is under about 100 lines; otherwise take the boring, widely-used one and keep it updated. For an agent writing the code: do not hand-roll crypto, TLS, auth, money arithmetic, date math, encoding, or parsers. Take the maintained library. The failure mode is code that looks right. The dangerous dependency is rarely the famous one; it is the small package with a single maintainer. At the stack level, spend the small budget of novel technology on the actual differentiator. Pin with a lockfile and read the changelog when you bump.
- **Consistency vs improvement.** Two patterns are worse than one mediocre pattern, because every reader learns both and guesses which is current. Either convert the whole codebase in its own change, with a lint rule so it stays converted, or follow the existing convention and write the proposal down. A genuinely new area with no convention is where you set the new pattern, and you say so.
- **Where the service boundary goes.** Service boundaries are ownership and deployment boundaries first. Splitting code that one team deploys together buys partial failures, versioned contracts, tracing, and the network inside every call, for a boundary a folder and a lint rule would have given you. Extract a service when a team needs its own deploy cadence, when a component has a different scaling or failure profile, or when a hard security boundary is required.
- **Prototype vs production.** A prototype may break these rules on one condition: it cannot be deployed. The moment it has a user, it is production and owes the debt. Decide which mode you are in out loud, before the first line. An agent does not choose prototype mode. If the user did not say the work cannot be deployed, it is production.

## Not this skill

- Blast radius, scope, and no extra work → `agent-ops-bar`
- Finding and running the check → `verify-loop`
- Where a recurring miss should live → `agent-trust-stack`
- Framework API shape → `source-check`
- Playwright suite design → `dvstack-testing`
- Contracts, tool gates, and recover loops → `harness-engineering`

## Verification

Walk this before claiming a code change is done. State any item the change cannot touch.

- [ ] Names state intent; the module hides behavior rather than forwarding calls; the call site was considered first
- [ ] Comments explain why, or are absent; dead code, unused imports, and finished flags are gone
- [ ] Invalid states are hard to represent at the boundary; external input is validated there; required config fails at startup; sizes, retries, and concurrency are bounded
- [ ] The object is authorized, not only the route; queries are parameterized; secrets are not logged or committed; untrusted input is not executed or loosely deserialized
- [ ] Schema and payload changes are additive and the migration is deployable alone; time, money, text, and identity follow this skill; stored personal data has a delete path; a backup change has a timed restore
- [ ] Effects sit at the edge; no check-then-act across a process; no lock or transaction held across I/O or another service; acquired resources are released on every path; multi-step writes are atomic or compensated
- [ ] Each catch handles or rethrows with context; programmer errors are not retried; outbound timeouts sit inside the caller's budget; write retries are bounded, jittered, and idempotent
- [ ] Tests assert observable behavior, fake only real edges, control time and ordering, and have been seen to fail once; no flake is hidden with a retry
- [ ] The change is small and reversible; you read the whole diff; the description says what, why, how verified, what can break, and how to roll back
- [ ] Any contested trade-off the change made is named, including why that side
- [ ] A rule that can be a type, lint, or CI check was promoted, not left only in prose
