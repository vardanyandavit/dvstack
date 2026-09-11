"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  applyFont,
  hasPreset,
  loadAllFonts,
  loadFont,
  readStoredFont,
  resolveOptions,
  storeFont,
  type FontOptions,
  type FontPresets,
} from "./font-presets";

interface FontContextValue {
  font: string;
  presets: FontPresets;
  setFont: (name: string) => void;
}

const FontContext = createContext<FontContextValue | null>(null);

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error("useFont must be used inside <FontProvider>");
  return ctx;
}

export function FontProvider({ children, ...options }: FontOptions & { children: ReactNode }) {
  const { presets, defaultPreset, storageKey } = resolveOptions(options);
  const [font, setFontState] = useState(defaultPreset);

  // Read storage after mount so server and client render the same first pass.
  useEffect(() => {
    const name = readStoredFont(presets, defaultPreset, storageKey);
    loadFont(presets[name]);
    applyFont(presets[name]);
    setFontState(name);
  }, [presets, defaultPreset, storageKey]);

  const setFont = (name: string) => {
    if (!hasPreset(presets, name)) return;
    loadFont(presets[name]);
    applyFont(presets[name]);
    storeFont(name, storageKey);
    setFontState(name);
  };

  return <FontContext.Provider value={{ font, presets, setFont }}>{children}</FontContext.Provider>;
}

const fg = "var(--fs-fg, #f3efe7)";
const accent = "var(--fs-accent, #ff9a76)";
const border = "var(--fs-border, color-mix(in oklab, currentColor 22%, transparent))";

const styles = {
  trigger: {
    width: 28, height: 28, padding: 0, borderRadius: "50%",
    border: `1px solid ${border}`, background: "transparent", color: fg, cursor: "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, lineHeight: 1,
  },
  menu: {
    position: "absolute", top: "calc(100% + 10px)", minWidth: 240, padding: 6, zIndex: 300,
    display: "flex", flexDirection: "column", gap: 2, maxHeight: 320, overflowY: "auto",
    background: "var(--fs-bg, #1b1c23)", border: `1px solid ${border}`, borderRadius: 14,
    boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
  },
  label: {
    fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.18em",
    textTransform: "uppercase", color: fg, opacity: 0.6, padding: "8px 10px 6px",
  },
  item: {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
    border: "none", borderRadius: 8, color: fg, textAlign: "left", cursor: "pointer",
    fontFamily: "var(--font-sans)", fontSize: 13,
  },
  preview: { fontSize: 22, lineHeight: 1, width: 32, flex: "0 0 auto" },
} satisfies Record<string, CSSProperties>;

export function FontSwitcher({
  label = "Typography",
  previewText = "Aa",
  align = "right",
}: {
  label?: string;
  previewText?: string;
  align?: "left" | "right";
}) {
  const { font, presets, setFont } = useFont();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label="Switch font"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          loadAllFonts(presets);
          setOpen((o) => !o);
        }}
        style={styles.trigger}
      >
        {previewText}
      </button>

      {open && (
        <div role="menu" aria-label={label} style={{ ...styles.menu, ...(align === "right" ? { right: 0 } : { left: 0 }) }}>
          <div style={styles.label}>{label}</div>
          {Object.entries(presets).map(([name, preset]) => {
            const active = name === font;
            return (
              <button
                key={name}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setFont(name);
                  setOpen(false);
                }}
                style={{ ...styles.item, background: active ? `color-mix(in oklab, ${accent} 14%, transparent)` : "transparent" }}
              >
                <span style={{ ...styles.preview, fontFamily: preset.display, fontStyle: preset.italic ? "italic" : "normal" }}>
                  {previewText}
                </span>
                <span style={{ flex: 1 }}>{name}</span>
                {active && <span style={{ color: accent }}>●</span>}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}
