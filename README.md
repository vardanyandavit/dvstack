# DVstack

DVstack is an open source plugin marketplace I created to share skills and working files from my own projects.

This is a knowledge collection, not a product. The README only covers plugins that are in the tree.

What's here now: a font switcher, fifteen Playwright testing skills, light agent-ops habits (including a marketplace router and short self-checks), and one harness-engineering skill for the system around the agent.

**Ladder:** ops-bar (quality bar) → session (token hygiene) → rigor (when to deepen) → harness (system around the agent). Harness owns contracts, tools, verify, and recover; agents stay light habits.

## How it's organized

A skill is one unit of knowledge — a `SKILL.md` plus the real files that go with it. A plugin is a group of related skills with a manifest, so a whole topic installs in one command and updates with the repository. Each plugin also ships Claude Code `commands/` that force-load a skill or the whole testing pack.

```
dvstack/
├── AGENTS.md                         # thin pointers, including using-dvstack
├── CLAUDE.md                         # same pointers for Claude Code
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
    │   ├── commands/                 # ops-bar, session, rigor, using-dvstack, …
    │   └── skills/
    │       ├── using-dvstack/
    │       ├── agent-ops-bar/
    │       ├── agent-session/
    │       ├── agent-rigor/
    │       ├── anti-rationalization/
    │       ├── doubt-check/
    │       └── source-check/
    ├── frontend/                     # dvstack-frontend
    │   ├── .claude-plugin/plugin.json
    │   ├── .cursor-plugin/plugin.json
    │   ├── commands/                 # font-switcher
    │   └── skills/
    │       └── font-switcher/        # SKILL.md + src/ + examples/
    ├── harness/                      # dvstack-harness
    │   ├── .claude-plugin/plugin.json
    │   ├── .cursor-plugin/plugin.json
    │   ├── commands/                 # harness
    │   └── skills/
    │       └── harness-engineering/  # SKILL.md
    └── testing/                      # dvstack-testing
        ├── .claude-plugin/plugin.json
        ├── .cursor-plugin/plugin.json
        ├── commands/          # playwright (whole pack) + one file per skill
        └── skills/            # 15 Playwright skills
            ├── playwright-naming-conventions/
            ├── playwright-test-architecture/   # SKILL.md + files/ to copy
            ├── playwright-test-strategy/
            ├── playwright-step-validation/
            ├── playwright-fixtures/
            ├── playwright-locators/
            ├── playwright-api-testing/
            ├── playwright-network-mocking/
            ├── playwright-hard-interactions/
            ├── playwright-accessibility-testing/
            ├── playwright-visual-testing/
            ├── playwright-code-review/
            ├── playwright-debugging/
            ├── playwright-flaky-tests/
            └── playwright-ci/
```

| Plugin | Covers | Status |
|---|---|---|
| [agents](plugins/agents/) | Light-by-default agent habits: marketplace router, quality bar, session hygiene, when to deepen, anti-rationalization, doubt-check, source-check | 7 skills |
| [frontend](plugins/frontend/) | Front-end implementation skills that ship with working source files | 1 skill |
| [harness](plugins/harness/) | The system around the model: task contracts, tool gates, verify/recover, durable state, feature maps, hard CI | 1 skill |
| [testing](plugins/testing/) | Playwright: architecture, strategy, step validation, fixtures, locators, API, mocking, hard interactions, a11y, visual, review, debugging, flaky tests, CI | 15 skills |

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

- **Claude Code:** `/dvstack-testing:playwright` or `/dvstack-testing:playwright-locators` (namespaced in `/help`).
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
- [agent-ops-bar](plugins/agents/skills/agent-ops-bar/) — quality bar scaled to blast radius: outcome and constraints first, one honest verify command in project rules, encode misses, no extra work.
- [agent-session](plugins/agents/skills/agent-session/) — session and token hygiene: context budget, model choice, quiet logs, clear between tasks, side agents that return conclusions.
- [agent-rigor](plugins/agents/skills/agent-rigor/) — when to deepen only: restate, demand evidence, escalate model or effort, time-boxed exploration when ambiguity or risk is high.
- [anti-rationalization](plugins/agents/skills/anti-rationalization/) — excuse vs reality: skipping verify, "looks right", expanding scope, inventing APIs from memory.
- [doubt-check](plugins/agents/skills/doubt-check/) — one self-adversarial pass on a non-trivial decision; not a multi-model bakeoff.
- [source-check](plugins/agents/skills/source-check/) — installed version + official docs for framework code; cite URLs; flag UNVERIFIED.

**[dvstack-frontend](plugins/frontend/)**

- [font-switcher](plugins/frontend/skills/font-switcher/) — a drop-in font picker for React or plain HTML/JS projects: heading and body font pairs, fonts downloaded only when needed, live previews, and the choice remembered across visits.

**[dvstack-harness](plugins/harness/)** — the heavy system around the agent. Quality bar and session hygiene stay in `dvstack-agents`.

- [harness-engineering](plugins/harness/skills/harness-engineering/) — task contracts, compiled context, tool gateway, permissions, durable state, feature maps, hard CI, verify-to-reject, recover, and change receipts. Skip for short low-risk tasks.

**[dvstack-testing](plugins/testing/)** — fifteen Playwright skills: naming conventions, suite architecture, test strategy, step validation and waiting, fixtures, locators, API-driven setup, network mocking, hard interactions (iframes, dialogs, downloads, drag and drop), accessibility, visual testing, code review, debugging, flaky-test triage, and CI. Page objects injected through fixtures, everything else in `constants/`, `data/`, and `helpers/`, and every `test.step` closing with a validation that proves the app moved on — never a hard-coded timeout. Force the pack with `/dvstack-testing:playwright` after install. See the [plugin README](plugins/testing/) for the full table.

## Status

Early. Public.

## License

[MIT](LICENSE). Free to use, copy, change, and share — including in commercial projects. Keep the copyright notice. No warranty.

The typefaces the font switcher loads from Google Fonts are not in this repo. They stay under their own [SIL Open Font License](https://openfontlicense.org/) terms.

## Author

Created and maintained by **Davit Vardanyan** ([@vardanyandavit](https://github.com/vardanyandavit)).
