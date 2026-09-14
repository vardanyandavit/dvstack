# DVstack Front-end

Front-end skills that ship with the real source files. Each skill tells the agent to copy working code from the skill folder rather than write it again from memory.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [font-switcher](skills/font-switcher/) | Runtime font picker: heading/body font pairs, lazy loading, live previews, remembered choice, no flash on reload | "add a font switcher" |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-frontend@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-frontend`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).

## Commands

Claude Code: `/dvstack-frontend:font-switcher` force-loads the skill. Cursor: invoke the skill name, or ask "add a font switcher". See [using commands](../../docs/using-commands.md).
