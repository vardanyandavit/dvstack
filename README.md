# DVstack

Open-source plugins for Cursor and Claude Code: Playwright tests, testable UI, two agent habits, and the system around a coding agent.

Install the plugins once. For each job, type **one** command, then the task. That command loads the skills in its row.

## Install

Install the plugins that match the work. `dvstack-testing` is Playwright. `dvstack-agents` is orient-and-prove. `dvstack-frontend` is markup and the font switcher. `dvstack-harness` is the system around an agent.

### Claude Code

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-testing@dvstack
claude plugin install dvstack-agents@dvstack
claude plugin install dvstack-frontend@dvstack
claude plugin install dvstack-harness@dvstack
```

### Cursor

1. **Cursor Settings → Plugins**, add marketplace `vardanyandavit/dvstack`.
2. Install the same four plugins (or the subset you need).
3. Restart Cursor.

## Update

### Claude Code

```bash
claude plugin marketplace update dvstack
```

Then in the chat run `/reload-plugins`. If one plugin is still the old copy, uninstall it and run its `claude plugin install` line again.

### Cursor

**Cursor Settings → Plugins → Refresh** on this marketplace, then restart Cursor. If a skill is still the old copy: uninstall that plugin, delete `~/.cursor/plugins/cache/`, install the plugin again, and restart Cursor.

## Which command

Start the message with the command. Put the task on the next line. Cursor commands are `/name`. Claude Code commands are `/plugin:name`.

### New Playwright suite

This is the command for “set up e2e” when the repo has no suite yet. It loads `playwright-test-architecture` and `playwright-step-validation`, then checks the diff against the blockers in `playwright-code-review`.

Cursor:

```text
/new-suite
Create the Playwright suite for this app. First flow: home page.
```

Claude Code:

```text
/dvstack-testing:new-suite
Create the Playwright suite for this app. First flow: home page.
```

When the repo already has a suite, use `add-tests` the same way (`/add-tests` in Cursor, `/dvstack-testing:add-tests` in Claude Code). Same skills.

### All cases

| Case | Cursor | Claude Code | Skills the command loads |
|---|---|---|---|
| No Playwright suite yet | `/new-suite` | `/dvstack-testing:new-suite` | `playwright-test-architecture`, `playwright-step-validation`, then blockers in `playwright-code-review` |
| Add tests to a suite that exists | `/add-tests` | `/dvstack-testing:add-tests` | `playwright-test-architecture`, `playwright-step-validation`, then blockers in `playwright-code-review` |
| Rewrite a suite, or move Cypress/Selenium | `/rewrite-suite` | `/dvstack-testing:rewrite-suite` | `playwright-test-architecture`, `playwright-step-validation`, `playwright-code-review` |
| Review Playwright tests | `/review-tests` | `/dvstack-testing:review-tests` | `playwright-code-review`. Also `playwright-agents` when an agent wrote or healed the diff |
| A test fails sometimes, or only in CI | `/fix-flaky` | `/dvstack-testing:fix-flaky` | `playwright-step-validation` |
| Build a feature | `/build` | `/dvstack-agents:build` | `repo-recon`, `verify-loop`. UI also loads `testable-ui`. New e2e follows `add-tests`. A new agent follows `design-agent` |
| Fix a product bug | `/fix` | `/dvstack-agents:fix` | `repo-recon`, `verify-loop`. A flaky Playwright test follows `fix-flaky` |
| Refactor or migrate app code | `/rewrite` | `/dvstack-agents:rewrite` | `repo-recon`, `verify-loop`. A Playwright suite follows `rewrite-suite` |
| Review a diff or PR | `/review` | `/dvstack-agents:review` | `verify-loop`. Tests also load `playwright-code-review`. UI also loads `testable-ui`. Agent tools also load `safeguard-parity` and `agent-tool-design` |
| Build UI a test must click | `/build-ui` | `/dvstack-frontend:build-ui` | `testable-ui`. With testing installed, one role-based test via `add-tests` |
| Audit UI a test cannot find by role | `/review-ui` | `/dvstack-frontend:review-ui` | `testable-ui` |
| Add the font switcher | `/font-switcher` | `/dvstack-frontend:font-switcher` | `font-switcher` |
| Design a new tool-using agent | `/design-agent` | `/dvstack-harness:design-agent` | `agent-execution-surfaces`, `agent-tool-design`, `harness-engineering`, `safeguard-parity`, `agent-boundary-tests`. A long loop also loads `token-efficient-coding-loops` |
| Audit an agent that already exists | `/audit-agent` | `/dvstack-harness:audit-agent` | `agent-execution-surfaces`, `safeguard-parity`, `agent-tool-design`, `agent-risk-chains`, `agent-boundary-tests` |

`font-switcher` is a skill. Every other row is a scenario command: it chains those skills and says what to deliver.

To force one skill on its own, use the skill name. Cursor: `/repo-recon`. Claude Code: `/dvstack-agents:repo-recon`. In Cursor, `@repo-recon` is the same force.

## Plugins

| Plugin | What it is for |
|---|---|
| [dvstack-testing](plugins/testing/) | Playwright layout, waits, review, agent-written tests |
| [dvstack-frontend](plugins/frontend/) | Markup a suite can drive, and the font switcher |
| [dvstack-agents](plugins/agents/) | Read the repo before editing, then run the real check |
| [dvstack-harness](plugins/harness/) | Tools, gates, and tests for a tool-using agent |

A skill ships only what a current model would not do unprompted. See [evals](docs/evals.md).

### Without the plugin

Copy one skill folder to `~/.claude/skills/<name>/`, `~/.cursor/skills/<name>/`, or a repo's `.claude/skills/` / `.cursor/skills/`:

```bash
cp -R plugins/frontend/skills/font-switcher ~/.claude/skills/font-switcher
```

To add a skill, see [CONTRIBUTING.md](CONTRIBUTING.md). Limits: [CONSTRAINTS.md](CONSTRAINTS.md).

## License

[MIT](LICENSE). The typefaces the font switcher loads from Google Fonts are not in this repo; they stay under their own [SIL Open Font License](https://openfontlicense.org/) terms.

## Author

Created and maintained by **Davit Vardanyan** ([@vardanyandavit](https://github.com/vardanyandavit)).
