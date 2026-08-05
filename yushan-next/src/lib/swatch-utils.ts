import type { Pigment } from "@/lib/types";

export const GRANULATION_OPACITY: Record<string, number> = {
  None: 0.02,
  Light: 0.12,
  Medium: 0.22,
  Heavy: 0.4,
  "Very heavy": 0.58,
};

export function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function adjustHex(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const mix = (c: number) => (amount >= 0 ? c * (1 - amount) : c + (255 - c) * -amount);
  const r = clamp(mix((n >> 16) & 255));
  const g = clamp(mix((n >> 8) & 255));
  const b = clamp(mix(n & 255));
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function seedsFor(pigmentId: string) {
  return {
    ragged: (hashStr(pigmentId + ":ragged") % 900) + 1,
    grain: (hashStr(pigmentId + ":grain") % 900) + 1,
  };
}

export function swatchPaint(pigment: Pigment, opts: { dilution?: boolean; wet?: boolean } = {}) {
  const baseOpacity = GRANULATION_OPACITY[pigment.granulation] ?? GRANULATION_OPACITY.None;
  let hex = pigment.hex;
  let dark = adjustHex(pigment.hex, 0.22);
  let darker = adjustHex(pigment.hex, 0.4);
  let opacity = baseOpacity;
  if (opts.dilution) {
    hex = adjustHex(pigment.hex, -0.55);
    dark = adjustHex(pigment.hex, -0.3);
    darker = adjustHex(pigment.hex, -0.1);
    opacity = baseOpacity * 0.4;
  } else if (opts.wet) {
    opacity = Math.min(0.75, baseOpacity * 1.6 + 0.08);
  }
  return { hex, dark, darker, opacity };
}
