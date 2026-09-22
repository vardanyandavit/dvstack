# DVstack

DVstack is an open source plugin marketplace I created to share skills and working files from my own projects.

This is a knowledge collection, not a product. The README only covers plugins that are in the tree.

**Design rule: a skill ships only what a modern model would not do unprompted.** House conventions, copyable templates, and APIs newer than the model's training stay. General good practice the model already follows is left out — it costs context on every turn and measurably adds nothing (see [evals](docs/evals.md)).

## Plugins

| Plugin | Skills |
|---|---|
| [dvstack-testing](plugins/testing/) | `playwright-test-architecture`, `playwright-step-validation`, `playwright-code-review`, `playwright-agents` |
| [dvstack-frontend](plugins/frontend/) | `testable-ui`, `font-switcher` |
| [dvstack-harness](plugins/harness/) | `harness-engineering`, `agent-execution-surfaces`, `agent-tool-design`, `safeguard-parity`, `agent-boundary-tests`, `agent-risk-chains`, `token-efficient-coding-loops` |
| [dvstack-agents](plugins/agents/) | `repo-recon`, `verify-loop` |

- **testing** — Playwright house conventions: folder layout, naming, locator tiers, page objects through fixtures, templates to copy; zero hard-coded waits and a validation per step; a house-rules review checklist with an ESLint config; reviewing agent-written and healed tests.
- **frontend** — markup an automated suite and an agent can drive; a drop-in font switcher with source.
- **harness** — the system around a coding agent: contracts, tool gates, surfaces, parity, boundary tests, risk chains, loop cost.
- **agents** — two portable habits: bounded repo recon, and an honest verify loop.

## Install

### Claude Code

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-testing@dvstack     # and/or -frontend, -harness, -agents
```

Update: `claude plugin marketplace update dvstack`, then `/reload-plugins`. If a plugin still looks stale, uninstall and reinstall it.

### Cursor

1. **Cursor Settings → Plugins**, add `vardanyandavit/dvstack` as a marketplace.
2. Install the plugins you want.
3. Update: **Refresh** the marketplace, then restart Cursor. If a skill still looks old, uninstall, clear `~/.cursor/plugins/cache/`, and reinstall.

## Using a skill

Ask normally ("set up a Playwright suite", "review these tests") and the matching skill loads from its description. To force one:

- **Claude Code:** `/dvstack-testing:playwright-code-review` — every plugin skill is a slash command as `/plugin-name:skill-name`.
- **Cursor:** `/playwright-code-review` or `@playwright-code-review`.

Load one skill per task unless the work genuinely spans two.

## Commands by scenario

A command runs a whole job: it loads the right skills in order, then says what to deliver and how to prove it. Claude Code: `/dvstack-testing:review-tests`. Cursor: `/review-tests`. Add your ask after the command, for example `/dvstack-testing:add-tests checkout with a discount code`. Commands cost no context until you run one.

| Scenario | Playwright tests (`dvstack-testing`) | App code (`dvstack-agents`) | UI (`dvstack-frontend`) | Agent systems (`dvstack-harness`) |
|---|---|---|---|---|
| Create new | `new-suite` | `build` | `build-ui` | `design-agent` |
| Add to existing | `add-tests` | `build` | `build-ui` | — |
| Rewrite / migrate | `rewrite-suite` | `rewrite` | — | — |
| Review | `review-tests` | `review` | `review-ui` | `audit-agent` |
| Fix | `fix-flaky` | `fix` | — | — |

The agents commands route to the others when those plugins are installed: `build` uses `testable-ui` for components, `review` hands test files to `playwright-code-review`, and `rewrite` hands a Playwright suite to `rewrite-suite`.

### Without the plugin

Every skill folder is self-contained. Copy it to `~/.claude/skills/<name>/`, `~/.cursor/skills/<name>/`, or a repo's `.claude/skills/` / `.cursor/skills/`:

```bash
cp -R plugins/frontend/skills/font-switcher ~/.claude/skills/font-switcher
```

To add a skill, see [CONTRIBUTING.md](CONTRIBUTING.md). Limits: [CONSTRAINTS.md](CONSTRAINTS.md).

## License

[MIT](LICENSE). The typefaces the font switcher loads from Google Fonts are not in this repo; they stay under their own [SIL Open Font License](https://openfontlicense.org/) terms.

## Author

Created and maintained by **Davit Vardanyan** ([@vardanyandavit](https://github.com/vardanyandavit)).
