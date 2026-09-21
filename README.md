# DVstack

DVstack is an open source plugin marketplace I created to share skills and working files from my own projects.

This is a knowledge collection, not a product. The README only covers plugins that are in the tree.

What's here now: twenty Playwright testing skills, two front-end skills (markup a suite can drive, plus a font switcher), nine light agent-ops habits (including a marketplace router, repo recon, a verify loop, and short self-checks), and six harness skills for the system around the agent (contracts plus execution-surface, tool-design, safeguard-parity, boundary-test, and risk-chain QA).

**Ladder:** recon (orient) → ops-bar (quality bar) → verify-loop (prove it) → session (token hygiene) → rigor (when to deepen) → harness (system around the agent). Harness owns contracts, tools, verify, recover, and bound-action QA; agents stay light habits.

## How it's organized

A skill is one unit of knowledge — a `SKILL.md` plus the real files that go with it. A plugin is a group of related skills with a manifest, so a whole topic installs in one command and updates with the repository. Each plugin also ships Claude Code `commands/` that force-load a skill or the whole testing pack.

```
dvstack/
├── AGENTS.md                         # thin pointers, including using-dvstack
├── CONTRIBUTING.md                   # how to add a plugin, skill, or command
├── CONSTRAINTS.md                    # what this marketplace is allowed to ship
├── docs/using-commands.md            # Claude vs Cursor vs Grok: how to force a skill
├── scripts/check-marketplace.mjs     # marketplace, skill, and command-frontmatter checks
├── .github/workflows/marketplace.yml
├── .claude-plugin/marketplace.json   # marketplace manifest (Claude Code)
├── .cursor-plugin/marketplace.json   # marketplace manifest (Cursor)
└── plugins/
    ├── agents/                       # dvstack-agents
    │   ├── .claude-plugin/plugin.json
    │   ├── .cursor-plugin/plugin.json
    │   ├── commands/                 # repo-recon, ops-bar, verify-loop, session, …
    │   └── skills/
    │       ├── using-dvstack/
    │       ├── repo-recon/
    │       ├── agent-ops-bar/
    │       ├── verify-loop/
    │       ├── agent-session/
    │       ├── agent-rigor/
    │       ├── anti-rationalization/
    │       ├── doubt-check/
    │       └── source-check/
    ├── frontend/                     # dvstack-frontend
    │   ├── .claude-plugin/plugin.json
    │   ├── .cursor-plugin/plugin.json
    │   ├── commands/                 # testable-ui, font-switcher
    │   └── skills/
    │       ├── testable-ui/
    │       └── font-switcher/        # SKILL.md + src/ + examples/
    ├── harness/                      # dvstack-harness
    │   ├── .claude-plugin/plugin.json
    │   ├── .cursor-plugin/plugin.json
    │   ├── commands/                 # harness, execution-surfaces, tool-design, safeguard-parity, boundary-tests, risk-chains
    │   └── skills/
    │       ├── harness-engineering/
    │       ├── agent-execution-surfaces/
    │       ├── agent-tool-design/
    │       ├── safeguard-parity/
    │       ├── agent-boundary-tests/
    │       └── agent-risk-chains/
    └── testing/                      # dvstack-testing
        ├── .claude-plugin/plugin.json
        ├── .cursor-plugin/plugin.json
        ├── commands/          # playwright (whole pack) + one file per skill
        └── skills/            # 20 Playwright skills
            ├── playwright-naming-conventions/
            ├── playwright-test-architecture/   # SKILL.md + files/ to copy
            ├── playwright-test-strategy/
            ├── playwright-step-validation/
            ├── playwright-fixtures/
            ├── playwright-locators/
            ├── playwright-auth-and-roles/
            ├── playwright-test-data/
            ├── playwright-api-testing/
            ├── playwright-network-mocking/
            ├── playwright-hard-interactions/
            ├── playwright-mobile-web/
            ├── playwright-accessibility-testing/
            ├── playwright-visual-testing/
            ├── playwright-code-review/
            ├── playwright-debugging/
            ├── playwright-flaky-tests/
            ├── playwright-ci/
            ├── playwright-agents/
            └── playwright-migration/
```

| Plugin | Covers | Status |
|---|---|---|
| [agents](plugins/agents/) | Light-by-default agent habits: marketplace router, repo recon, quality bar, verify loop, session hygiene, when to deepen, anti-rationalization, doubt-check, source-check | 9 skills |
| [frontend](plugins/frontend/) | Front-end skills: markup an automated suite and an agent can drive, plus working source files to copy | 2 skills |
| [harness](plugins/harness/) | The system around the model: task contracts, tool gates, verify/recover, durable state, feature maps, hard CI, plus execution-surface / tool-design / safeguard-parity / boundary-test / risk-chain QA | 6 skills |
| [testing](plugins/testing/) | Playwright: architecture, strategy, step validation, fixtures, locators, auth and roles, test data, API, mocking, hard interactions, mobile, a11y, visual, review, debugging, flaky tests, CI, Playwright agents and MCP, migration | 20 skills |

## Install

**Claude Code**

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
claude plugin install dvstack-frontend@dvstack
claude plugin install dvstack-harness@dvstack
claude plugin install dvstack-testing@dvstack
```

**Cursor** — add this repository as a plugin marketplace, then install `dvstack-agents`, `dvstack-frontend`, `dvstack-harness`, or `dvstack-testing`.

Once installed, a normal request is enough: ask "add a font switcher" and the agent picks the skill up on its own. No link, no copy step.

## Commands

To **force** a skill (or the whole Playwright pack) instead of hoping auto-discovery fires:

- **Claude Code:** `/dvstack-testing:playwright` or `/dvstack-testing:locators` (namespaced in `/help`).
- **Cursor:** `/` or `@` plus the skill name, or ask "use dvstack-testing".
- **Grok Bot / other SKILL.md readers:** `/` or `@` if the skill is in that tool's library; otherwise copy the folder or paste the GitHub URL.

See [docs/using-commands.md](docs/using-commands.md). Commands load skills; they do not invent a second rulebook.

### Using a single skill without the plugin

Every skill folder is self-contained, so it also works on its own in any tool that reads `SKILL.md`:

| Copy the skill folder to | Who sees it |
|---|---|
| `~/.claude/skills/<name>/` | Claude Code, all your projects |
| `~/.cursor/skills/<name>/` | Cursor, all your projects |
| `.claude/skills/<name>/` or `.cursor/skills/<name>/` in a repo | That project only |

```bash
cp -R plugins/frontend/skills/font-switcher ~/.claude/skills/font-switcher
```

**Any other AI.** Send the folder URL, for example `https://github.com/vardanyandavit/dvstack/tree/main/plugins/frontend/skills/font-switcher`, and ask it to implement that skill.

To add a plugin, skill, or command, see [CONTRIBUTING.md](CONTRIBUTING.md). Marketplace limits: [CONSTRAINTS.md](CONSTRAINTS.md).

## What's here now

**[dvstack-agents](plugins/agents/)** — light habits. Not the harness.

- [using-dvstack](plugins/agents/skills/using-dvstack/) — which DVstack plugin or skill applies; prefer the narrowest; slash command = force-load.
- [repo-recon](plugins/agents/skills/repo-recon/) — bounded orientation before the first edit in an unfamiliar repo: stack and package manager from the lockfile, verify commands, enforced conventions, files in scope, blast radius, then a short recon note.
- [agent-ops-bar](plugins/agents/skills/agent-ops-bar/) — quality bar scaled to blast radius: outcome and constraints first, one honest verify command in project rules, encode misses, no extra work.
- [verify-loop](plugins/agents/skills/verify-loop/) — find the project's real check from lockfile, scripts, and CI; scope it to the change; widen before the PR; report the actual output; what to do when no check exists.
- [agent-session](plugins/agents/skills/agent-session/) — session and token hygiene: context budget, model choice, quiet logs, clear between tasks, side agents that return conclusions.
- [agent-rigor](plugins/agents/skills/agent-rigor/) — when to deepen only: restate, demand evidence, escalate model or effort, time-boxed exploration when ambiguity or risk is high.
- [anti-rationalization](plugins/agents/skills/anti-rationalization/) — excuse vs reality: skipping verify, "looks right", expanding scope, inventing APIs from memory.
- [doubt-check](plugins/agents/skills/doubt-check/) — one self-adversarial pass on a non-trivial decision; not a multi-model bakeoff.
- [source-check](plugins/agents/skills/source-check/) — installed version + official docs for framework code; cite URLs; flag UNVERIFIED.

**[dvstack-frontend](plugins/frontend/)**

- [testable-ui](plugins/frontend/skills/testable-ui/) — the component side of the testing plugin: an accessible name on every control, native elements instead of `div` click handlers, when a `data-testid` is the right answer and how to name it, list rows a test can scope into, and loading, empty, and error states that exist in the DOM. The same markup is what an agent reading the accessibility tree needs.
- [font-switcher](plugins/frontend/skills/font-switcher/) — a drop-in font picker for React or plain HTML/JS projects: heading and body font pairs, fonts downloaded only when needed, live previews, and the choice remembered across visits.

**[dvstack-harness](plugins/harness/)** — the heavy system around the agent. Quality bar and session hygiene stay in `dvstack-agents`. Force a skill after install with e.g. `/dvstack-harness:boundary-tests`.

- [harness-engineering](plugins/harness/skills/harness-engineering/) — task contracts, compiled context, tool gateway, permissions, durable state, feature maps, hard CI, verify-to-reject, recover, and change receipts. Skip for short low-risk tasks.
- [agent-execution-surfaces](plugins/harness/skills/agent-execution-surfaces/) — inventory every invoke/action channel and which reach shell, files, network, secrets, browser, MCP, or subagents; overlapping routes; short surface map.
- [agent-tool-design](plugins/harness/skills/agent-tool-design/) — the gateway's shape: one authority per tool, narrow typed parameters instead of passthrough strings, structured errors that teach recovery, idempotency keys, dry-run before destructive, explicit bounds.
- [safeguard-parity](plugins/harness/skills/safeguard-parity/) — same control class on every equivalent route to the same protected action (CLI vs API vs headless vs MCP vs hooks).
- [agent-boundary-tests](plugins/harness/skills/agent-boundary-tests/) — failure-oriented bounds tests: remove the control → must fail; untrusted-context and multi-step tool paths. Component tests alone are not enough.
- [agent-risk-chains](plugins/harness/skills/agent-risk-chains/) — eight chain templates into QA tickets: trigger → asset → required control → regression.

**[dvstack-testing](plugins/testing/)** — twenty Playwright skills: naming conventions, suite architecture, test strategy, step validation and waiting, fixtures, locators, auth and roles, test data, API-driven setup, network mocking, hard interactions (iframes, dialogs, downloads, drag and drop), mobile and responsive, accessibility, visual testing, code review, debugging, flaky-test triage, CI, Playwright's own planner/generator/healer agents plus the MCP browser, and migrating off Cypress or Selenium. Page objects injected through fixtures, everything else in `constants/`, `data/`, and `helpers/`, and every `test.step` closing with a validation that proves the app moved on — never a hard-coded timeout. Force the pack with `/dvstack-testing:playwright` after install. See the [plugin README](plugins/testing/) for the full table.

## Status

Early. Public.

## License

[MIT](LICENSE). Free to use, copy, change, and share — including in commercial projects. Keep the copyright notice. No warranty.

The typefaces the font switcher loads from Google Fonts are not in this repo. They stay under their own [SIL Open Font License](https://openfontlicense.org/) terms.

## Author

Created and maintained by **Davit Vardanyan** ([@vardanyandavit](https://github.com/vardanyandavit)).
