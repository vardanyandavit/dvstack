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

## Repository layout

Content will be organized by topic as it's added, roughly along these lines:

- `skills/` — reusable skills and suggested approaches for different kinds of projects
- `design/` — design approaches and standards
- `automation/` — automation notes and files
- `local-dev/` — local development experience and notes
- `llm/` — files and notes connected with LLM models
- `testing/` — testing and automation notes
- `examples/` — real files and working examples referenced from the notes above

This layout will evolve as content gets added — folders above may not exist yet.

## Using skills

Each folder under `skills/` is one agent skill: a `SKILL.md` plus any files the agent should copy into a project. The same install works for every skill, now and later.

**Cursor / Claude Code.** Copy the folder once, then a normal request is enough — no GitHub link:

| Install here | Who sees it |
|---|---|
| `~/.cursor/skills/<name>/` | Cursor, all your projects |
| `~/.claude/skills/<name>/` | Claude Code, all your projects |
| `.cursor/skills/<name>/` or `.claude/skills/<name>/` in a repo | That project only |

Example for the font switcher:

```bash
cp -R skills/font-switcher ~/.cursor/skills/font-switcher
cp -R skills/font-switcher ~/.claude/skills/font-switcher
```

Then ask: “add a font switcher”. The agent reads `SKILL.md` and copies the files sitting next to it.

**Any other AI.** Send the folder URL, for example `https://github.com/vardanyandavit/dvstack/tree/main/skills/font-switcher`, and ask it to implement that skill.

When you add a new skill, keep this shape so the install above keeps working:

- Folder: `skills/<name>/` with a `SKILL.md` whose `name` matches the folder
- `description` in the frontmatter says **what** it does and **when** to use it (the trigger phrase)
- Files the agent should copy live in that folder, and `SKILL.md` tells it to copy from there rather than rewrite from scratch

## What's here now

- [skills/font-switcher](skills/font-switcher/) — a drop-in font picker for React or plain HTML/JS projects: heading and body font pairs, fonts downloaded only when needed, live previews, and the choice remembered across visits.

## Status

Early. The repository is public and will grow as content is added.

## License

[MIT](LICENSE). Free to use, copy, change, and share — including in commercial projects. Keep the copyright notice. No warranty.

The typefaces the font switcher loads from Google Fonts are not in this repo. They stay under their own [SIL Open Font License](https://openfontlicense.org/) terms.

## Author

Created and maintained by **Davit Vardanyan** ([@vardanyandavit](https://github.com/vardanyandavit)).
