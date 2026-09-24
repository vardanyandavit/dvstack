# DVstack Front-end

The font switcher. It ships the real source, so the agent copies working code from the skill folder instead of writing it again from memory.

| Skill | What it does |
|---|---|
| [font-switcher](skills/font-switcher/) | Runtime font picker: heading/body font pairs, lazy loading, live previews, remembered choice, no flash on reload |

## Call

| Cursor | Claude Code |
|---|---|
| `/font-switcher` | `/dvstack-frontend:font-switcher` |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-frontend@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-frontend`.

Or copy the skill folder by hand — see the [repository README](../../README.md#without-the-plugin).
