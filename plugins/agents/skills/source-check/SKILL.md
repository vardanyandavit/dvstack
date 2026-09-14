---
name: source-check
description: Use when writing framework code (especially Playwright or TypeScript) and you need the installed version's docs, not memory. Detect versions from package.json, fetch official docs, cite URLs, flag UNVERIFIED. Not for pure logic or renames.
---

# Source check

Framework APIs drift. Memory is not a source.

## When

Playwright, TypeScript, or other library code where the installed version matters.

## When not

Pure logic, renames, formatting, or repo-local conventions already covered by a DVstack skill.

## Process

1. **Version.** Read `package.json` (and lockfile if needed) for the library you are using.
2. **Docs.** Fetch official docs for that version's pattern. Prefer the project's installed major.
3. **Cite.** Put the URL next to the claim (comment, PR note, or reply). If you could not fetch it, mark **UNVERIFIED**.
4. **Conflict.** If official docs disagree with existing project code, surface that to the user — do not silently "fix" or silently follow the old pattern.

Installed DVstack skills (for example Playwright locators) still win for *this marketplace's* conventions; docs win for API shape and flags.

## Red flags

- Using an API you last saw on a different major
- Copying a snippet with no version
- Treating a blog post as canonical

## Not this skill

Playwright conventions: `dvstack-testing`. Agent quality bar: `agent-ops-bar`.

## Verification

- [ ] Installed version identified (or UNVERIFIED)
- [ ] Official docs URL cited, or UNVERIFIED flagged
- [ ] Conflicts with existing code were surfaced, not hidden
- [ ] Did not apply this skill to a rename/format-only change
