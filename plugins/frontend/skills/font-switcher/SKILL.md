---
name: font-switcher
description: Add a runtime font switcher to a web app or browser game. Presets pair a heading font with a body font, fonts load only when needed, each option previews in its own face, and the choice persists with no flash on reload. Use when someone wants users to choose between fonts, a typography picker, or font themes.
---

# Font switcher

## Files

- `src/font-presets.ts` — framework-agnostic core: preset registry, lazy font loading, CSS variable writer, storage, and `prepaintScript()`.
- `src/react.tsx` — `FontProvider`, `useFont()`, and the `FontSwitcher` dropdown. Depends only on React and the core.
- `examples/vanilla.html` — the same feature with no build step and no framework. Open it in a browser to see it working.

## How it works

1. Each preset is a **pair**: a heading stack (`--font-display`) and a body stack (`--font-sans`). The page styles itself only through those two variables, so any preset works everywhere.
2. **Lazy loading.** On page load only the active preset's stylesheet is fetched. The rest are fetched when the picker opens, so the previews render in their real faces. Links are deduped by `href`.
3. **No flash.** A small inline script in `<head>` reads the stored choice and writes the variables before first paint.
4. The choice is stored in `localStorage` (default key `font-preset`) and validated against the registry on read.

## Integrate into a project

This skill folder is the source. Copy files from here into the target project. Do not reimplement the switcher from the description.

1. **Pick the variant.**
   - React (Vite, Next.js, Remix…): copy both files from this skill's `src/` into the project, e.g. `lib/font-switcher/`. The React file starts with `"use client"` so it is safe to import from a Next.js App Router client boundary.
   - Anything else (plain HTML, Vue, Svelte, a canvas game): use this skill's `src/font-presets.ts` on its own, or copy the three marked blocks from `examples/vanilla.html` if there is no build step.
2. **Style through the variables.** Headings use `font-family: var(--font-display)`, body uses `var(--font-sans)`. Add fallbacks in the root stylesheet so the page is correct before any script runs:
   ```css
   :root {
     --font-display: "Instrument Serif", "Times New Roman", serif;
     --font-sans: "Inter", system-ui, sans-serif;
   }
   ```
3. **Add the pre-paint script** to `<head>`, before the app bundle.
   - Next.js App Router: in the root layout, `<script dangerouslySetInnerHTML={{ __html: prepaintScript() }} />` inside `<head>`, and add `suppressHydrationWarning` to `<html>` because the script sets its `style` attribute before React hydrates.
   - Vite or static `index.html`: HTML can't import TypeScript, so copy the first `<script>` block from `examples/vanilla.html`. Its presets must match the ones passed to `FontProvider` — if they drift, the reload shows one font and then switches to another.
4. **Mount it (React).** Wrap the app in `<FontProvider>` (pass `presets`, `defaultPreset`, or `storageKey` to customise) and put `<FontSwitcher />` in the nav or settings. Use `useFont()` to read or set the font from anywhere else.
5. **Theme the dropdown** with `--fs-bg`, `--fs-fg`, `--fs-accent`, `--fs-border`. Defaults are a dark theme.
6. **Canvas and games.** DOM text follows the variables automatically; canvas text doesn't. Read the font when drawing, and wait for it to load first:
   ```ts
   const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display");
   await document.fonts.load(`32px ${family}`);
   ctx.font = `32px ${family}`;
   ```
   Redraw after the user switches font.

## Custom presets

```ts
const presets = {
  Brand: { display: '"Sora",sans-serif', sans: '"Sora",sans-serif', href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap" },
  System: { display: "system-ui,sans-serif", sans: "system-ui,sans-serif" }, // no href: nothing to download
} satisfies FontPresets;
```

Every stack needs a generic fallback (`serif`, `sans-serif`, `monospace`). A preset's `href` must load **both** of its faces.

## Verify

- Pick each preset: headings and body change together, and the preview matches the result.
- Reload after picking a non-default preset: the page paints in that font straight away, with no flash of the default.
- Network tab on a fresh load shows only the active preset's stylesheet. The others appear only after the picker opens.
- The picker closes on outside click and on Escape.

## Rules

- Don't load every font up front. Lazy loading is the point of this design.
- Keep one list of presets per project. If the pre-paint script can't import it (static HTML), say in a comment which file it has to match.
