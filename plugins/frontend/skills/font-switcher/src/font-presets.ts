export interface FontPreset {
  /** Font stack for headings, written to `--font-display`. */
  display: string;
  /** Font stack for body text, written to `--font-sans`. */
  sans: string;
  /** Stylesheet that loads the faces. Omit for fonts that are already available. */
  href?: string;
  /** Render the preview in italic. */
  italic?: boolean;
}

export type FontPresets = Record<string, FontPreset>;

export interface FontOptions {
  presets?: FontPresets;
  /** Defaults to the first preset. */
  defaultPreset?: string;
  storageKey?: string;
}

const gf = (families: string) => `https://fonts.googleapis.com/css2?${families}&display=swap`;
const INTER = "family=Inter:wght@300..700";
const INTER_STACK = '"Inter",system-ui,sans-serif';

export const DEFAULT_PRESETS = {
  "Instrument Serif": {
    display: '"Instrument Serif","Times New Roman",serif',
    sans: INTER_STACK,
    href: gf(`family=Instrument+Serif:ital@0;1&${INTER}`),
    italic: true,
  },
  Fraunces: {
    display: '"Fraunces","Times New Roman",serif',
    sans: INTER_STACK,
    href: gf(`family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&${INTER}`),
  },
  "Playfair Display": {
    display: '"Playfair Display","Times New Roman",serif',
    sans: INTER_STACK,
    href: gf(`family=Playfair+Display:wght@400..700&${INTER}`),
  },
  "DM Serif Display": {
    display: '"DM Serif Display","Times New Roman",serif',
    sans: INTER_STACK,
    href: gf(`family=DM+Serif+Display:ital@0;1&${INTER}`),
  },
  "Space Grotesk": {
    display: '"Space Grotesk",system-ui,sans-serif',
    sans: '"Space Grotesk",system-ui,sans-serif',
    href: gf("family=Space+Grotesk:wght@400;500;600"),
  },
} satisfies FontPresets;

export const DEFAULT_STORAGE_KEY = "font-preset";

export function resolveOptions(options: FontOptions = {}) {
  const presets: FontPresets = options.presets ?? DEFAULT_PRESETS;
  return {
    presets,
    defaultPreset: options.defaultPreset ?? Object.keys(presets)[0],
    storageKey: options.storageKey ?? DEFAULT_STORAGE_KEY,
  };
}

export function hasPreset(presets: FontPresets, name: unknown): name is string {
  return typeof name === "string" && Object.prototype.hasOwnProperty.call(presets, name);
}

export function loadFont(preset: FontPreset) {
  if (!preset.href || typeof document === "undefined") return;
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
  if (Array.from(links).some((l) => l.getAttribute("href") === preset.href)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = preset.href;
  document.head.appendChild(link);
}

/** Call when the picker opens so every preview renders in its real face. */
export function loadAllFonts(presets: FontPresets) {
  for (const preset of Object.values(presets)) loadFont(preset);
}

export function applyFont(preset: FontPreset, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--font-display", preset.display);
  root.style.setProperty("--font-sans", preset.sans);
}

export function readStoredFont(presets: FontPresets, fallback: string, storageKey = DEFAULT_STORAGE_KEY) {
  try {
    const name = localStorage.getItem(storageKey);
    if (hasPreset(presets, name)) return name;
  } catch {}
  return fallback;
}

export function storeFont(name: string, storageKey = DEFAULT_STORAGE_KEY) {
  try {
    localStorage.setItem(storageKey, name);
  } catch {}
}

/** Inline in <head> before the app bundle so a stored font is applied before first paint. */
export function prepaintScript(options: FontOptions = {}) {
  const { presets, defaultPreset, storageKey } = resolveOptions(options);
  const args = [presets, defaultPreset, storageKey]
    .map((v) => JSON.stringify(v).replace(/</g, "\\u003c"))
    .join(",");
  return `(function(P,D,K){try{var n=localStorage.getItem(K);var f=Object.prototype.hasOwnProperty.call(P,n)?P[n]:P[D];var r=document.documentElement.style;r.setProperty("--font-display",f.display);r.setProperty("--font-sans",f.sans);if(f.href){var l=document.createElement("link");l.rel="stylesheet";l.href=f.href;document.head.appendChild(l);}}catch(e){}})(${args});`;
}
