# DVstack Front-end

Front-end skills from real projects. `testable-ui` is the component side of `dvstack-testing` — the markup rules that make a role-based locator possible in the first place. `font-switcher` ships the real source files, so the agent copies working code from the skill folder rather than writing it again from memory.

## Skills

| Skill | What it does | Ask for it with |
|---|---|---|
| [testable-ui](skills/testable-ui/) | Markup an automated suite and an AI agent can drive: accessible names on every control, native elements over `div` handlers, when a `data-testid` is right and how to name it, scopeable list rows, loading/empty/error states in the DOM | "a test can only find this by CSS class" / "make this app testable" |
| [font-switcher](skills/font-switcher/) | Runtime font picker: heading/body font pairs, lazy loading, live previews, remembered choice, no flash on reload | "add a font switcher" |

## Install

```bash
claude plugin marketplace add vardanyandavit/dvstack
claude plugin install dvstack-frontend@dvstack
```

In Cursor, add the same repository as a plugin marketplace and install `dvstack-frontend`.

Or copy a single skill folder by hand — see the [repository README](../../README.md#using-a-single-skill-without-the-plugin).

## Commands

Claude Code: `/dvstack-frontend:testable-ui` and `/dvstack-frontend:font-switcher` force-load a skill. Cursor: invoke the skill name, or ask "add a font switcher". See [using commands](../../docs/using-commands.md).
