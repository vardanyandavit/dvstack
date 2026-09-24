# DVstack

Open-source plugins for Cursor and Claude Code. Three jobs, one call each. The agent picks the skills.

Install the plugins once. Start the message with the call, then the task.

## Install

### Claude Code

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-testing@dvstack
claude plugin install dvstack-frontend@dvstack
claude plugin install dvstack-agents@dvstack
```

### Cursor

1. **Cursor Settings → Plugins**, add marketplace `vardanyandavit/dvstack`.
2. Install the same three plugins (or the subset you need).
3. Restart Cursor.

## Update

### Claude Code

```bash
claude plugin marketplace update dvstack
```

Then in the chat run `/reload-plugins`. If one plugin is still the old copy, uninstall it and run its `claude plugin install` line again.

### Cursor

**Cursor Settings → Plugins → Refresh** on this marketplace, then restart Cursor. If a skill is still the old copy: uninstall that plugin, delete `~/.cursor/plugins/cache/`, install the plugin again, and restart Cursor.

## Which call

Cursor calls are `/name`. Claude Code calls are `/plugin:name`.

| Job | Cursor | Claude Code |
|---|---|---|
| Create, add, rewrite, or review Playwright tests | `/playwright` | `/dvstack-testing:playwright` |
| Add the font switcher | `/font-switcher` | `/dvstack-frontend:font-switcher` |
| Add global rules to the file `/init` already wrote | `/agent-rules` | `/dvstack-agents:agent-rules` |

`/playwright` reads the repo and the ask, then loads only the skills that job needs (new suite, more tests, a rewrite, a review, a flaky test, or agent-written tests). You do not pick the skill.

`/font-switcher` and `/agent-rules` are skills. Each is the whole job, so there is no second command in front of it.

`/agent-rules` runs after `/init`. It adds the global rules agents skip to the `AGENTS.md` or `CLAUDE.md` that is already there, and only the sections this project needs. Paste extra rules in the same message and it keeps the ones this repo uses. It does not create the file.

```text
/playwright
Add a test for the checkout flow. The suite is already in e2e/.
```

```text
/agent-rules
Here are my rules. Add only what this project needs:
- Use pnpm
- Never commit .env
```

## Plugins

| Plugin | What it is for |
|---|---|
| [dvstack-testing](plugins/testing/) | Playwright layout, waits, and review. One command. |
| [dvstack-frontend](plugins/frontend/) | The font switcher, copied from the skill |
| [dvstack-agents](plugins/agents/) | Global rules added to the instruction file `/init` already wrote |

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
