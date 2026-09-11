# Font switcher

A drop-in font picker for web apps and browser games. Visitors choose a typeface from a small menu, the whole page switches instantly, and the choice is remembered on their next visit.

I originally built it for my own website and extracted it here so it can be reused in any project.

## What makes it different

- **Font pairs, not single fonts.** Each preset sets a heading font and a body font together, through two CSS variables: `--font-display` and `--font-sans`.
- **Only downloads what's used.** A fresh visit loads only the active font. The others load when the picker opens.
- **Live previews.** Every option shows "Aa" in its own typeface.
- **No flash on reload.** A tiny script in `<head>` applies the saved font before the page paints.
- **No dependencies.** The core is plain TypeScript. The React version needs only React.

Five presets are included: Instrument Serif, Fraunces, Playfair Display, DM Serif Display, and Space Grotesk. You can replace them with your own.

## Files

| File | What it is |
|------|------------|
| [`src/font-presets.ts`](src/font-presets.ts) | Core logic, works with any framework or none |
| [`src/react.tsx`](src/react.tsx) | `FontProvider`, `useFont()`, and the `<FontSwitcher />` menu |
| [`examples/vanilla.html`](examples/vanilla.html) | Standalone demo with no build step. Open it in a browser. |
| [`SKILL.md`](SKILL.md) | Step-by-step integration guide, also usable as a Cursor / Claude Code skill |

## Quick start (React)

Copy `src/` into your project, then:

```tsx
import { FontProvider, FontSwitcher } from "./font-switcher/react";

export function App() {
  return (
    <FontProvider>
      <nav>
        <FontSwitcher />
      </nav>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Hello</h1>
      <p style={{ fontFamily: "var(--font-sans)" }}>Body text</p>
    </FontProvider>
  );
}
```

To avoid a flash on reload, add the pre-paint script to `<head>`. See step 3 in [SKILL.md](SKILL.md).

## Quick start (no framework)

Open [`examples/vanilla.html`](examples/vanilla.html). It contains three marked blocks (config and pre-paint, styles, and the switcher itself). Copy them into your page and add an element with `id="font-switcher"` where the button should appear.

## Using it as a Cursor or Claude Code skill

Copy this folder to `~/.cursor/skills/font-switcher/` (Cursor) or `~/.claude/skills/font-switcher/` (Claude Code). For one project only, use `.cursor/skills/font-switcher/` or `.claude/skills/font-switcher/`. Then “add a font switcher” is enough, with no link.
