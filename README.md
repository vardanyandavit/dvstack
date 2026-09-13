# DVstack

DVstack is an open source project I created to share knowledge and files I've collected from my own experience.

The focus is mostly automation: skills I reach for across projects, design approaches and standards, local development notes, files related to LLM models, and notes on testing.

This is a knowledge collection, not a product. Material will land here as I write it up.

## What's in scope

- Preferred skills and suggested approaches for different kinds of projects
- Design approaches and standards
- Automation notes and files
- Local development experience
- Files and notes connected with LLM models
- Testing and automation notes
- Global agent-ops habits for any coding tool

## How it's organized

DVstack is a **plugin marketplace**. A skill is one unit of knowledge — a `SKILL.md` plus the real files that go with it. A plugin is a group of related skills with a manifest, so a whole topic installs in one command and updates with the repository.

```
dvstack/
├── AGENTS.md                         # thin pointers to agent-ops-bar, agent-rigor, and agent-session
├── CLAUDE.md                         # same pointers for Claude Code
├── .claude-plugin/marketplace.json   # marketplace manifest (Claude Code)
├── .cursor-plugin/marketplace.json   # marketplace manifest (Cursor)
└── plugins/
    ├── agents/                       # dvstack-agents
    │   ├── .claude-plugin/plugin.json
    │   ├── .cursor-plugin/plugin.json
    │   └── skills/
    │       ├── agent-ops-bar/        # SKILL.md
    │       ├── agent-rigor/          # SKILL.md
    │       └── agent-session/        # SKILL.md
    ├── frontend/                     # dvstack-frontend
    │   ├── .claude-plugin/plugin.json
    │   ├── .cursor-plugin/plugin.json
    │   └── skills/
    │       └── font-switcher/        # SKILL.md + src/ + examples/
    └── testing/                      # dvstack-testing
        ├── .claude-plugin/plugin.json
        ├── .cursor-plugin/plugin.json
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
| [agents](plugins/agents/) | Light-by-default agent-ops: spend where it changes the result and save where it doesn't, throwaway vs production bar, narrow verify loops, no unasked extra work, session token hygiene | 3 skills |
| [frontend](plugins/frontend/) | Front-end implementation skills that ship with working source files | 1 skill |
| [testing](plugins/testing/) | Playwright: architecture, strategy, step validation, fixtures, locators, API, mocking, hard interactions, a11y, visual, review, debugging, flaky tests, CI | 15 skills |

More plugins get added as the material grows — design standards, local development, and LLM notes each become their own plugin once they have skills to hold.

## Install

**Claude Code**

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-agents@dvstack
claude plugin install dvstack-frontend@dvstack
claude plugin install dvstack-testing@dvstack
```

**Cursor** — add this repository as a plugin marketplace, then install `dvstack-agents`, `dvstack-frontend`, or `dvstack-testing`.

Once installed, a normal request is enough: ask "add a font switcher" and the agent picks the skill up on its own. No link, no copy step.

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

## Adding a skill

Keep this shape so both the plugin install and the manual copy keep working:

- Folder: `plugins/<plugin>/skills/<name>/` with a `SKILL.md` whose `name` matches the folder
- `description` in the frontmatter says **what** it does and **when** to use it — that sentence is the trigger, and it's the only part the agent reads until the skill fires
- One narrow subject per skill. Five focused skills beat one that tries to cover a whole tool
- Files the agent should copy live next to `SKILL.md`, and `SKILL.md` tells it to copy them rather than rewrite from scratch
- List the skill in the plugin's README, and bump `version` in both `plugin.json` files

## What's here now

**[dvstack-agents](plugins/agents/)**

- [agent-ops-bar](plugins/agents/skills/agent-ops-bar/) — global habits for coding with agents: spend where it changes the result and save where it does not, throwaway vs production bar, outcome-first steering, narrow verify loops, no unasked extra work, and encoding misses into skills.
- [agent-rigor](plugins/agents/skills/agent-rigor/) — the cheapest proof that would still catch a real failure: proof up front, agent-friendly harness, live verification, design exploration, and parallel isolation.
- [agent-session](plugins/agents/skills/agent-session/) — portable session and token hygiene: context budget, model choice, quiet logs, clear between tasks, and side agents that return conclusions. Root `AGENTS.md` and `CLAUDE.md` point at all three; install the plugin for other projects.

**[dvstack-frontend](plugins/frontend/)**

- [font-switcher](plugins/frontend/skills/font-switcher/) — a drop-in font picker for React or plain HTML/JS projects: heading and body font pairs, fonts downloaded only when needed, live previews, and the choice remembered across visits.

**[dvstack-testing](plugins/testing/)** — fifteen Playwright skills: naming conventions, suite architecture, test strategy, step validation and waiting, fixtures, locators, API-driven setup, network mocking, hard interactions (iframes, dialogs, downloads, drag and drop), accessibility, visual testing, code review, debugging, flaky-test triage, and CI. Page objects injected through fixtures, everything else in `constants/`, `data/`, and `helpers/`, and every `test.step` closing with a validation that proves the app moved on — never a hard-coded timeout. See the [plugin README](plugins/testing/) for the full table.

## Status

Early. The repository is public and will grow as content is added.

## License

[MIT](LICENSE). Free to use, copy, change, and share — including in commercial projects. Keep the copyright notice. No warranty.

The typefaces the font switcher loads from Google Fonts are not in this repo. They stay under their own [SIL Open Font License](https://openfontlicense.org/) terms.

## Author

Created and maintained by **Davit Vardanyan** ([@vardanyandavit](https://github.com/vardanyandavit)).
