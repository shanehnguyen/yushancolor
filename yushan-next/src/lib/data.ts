import pigmentsRaw from "@/data/pigments.json";
import catalogRaw from "@/data/products.json";
import type { Catalog, Pigment, Product } from "@/lib/types";

export const pigments: Pigment[] = pigmentsRaw as Pigment[];
export const catalog: Catalog = catalogRaw as Catalog;
export const products: Product[] = catalog.products;

export const pigmentsById: Record<string, Pigment> = Object.fromEntries(
  pigments.map((p) => [p.id, p])
);

export const productsById: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.id, p])
);

/** Mirrors the original site's productUrl() helper (js/swatch.js), adapted to
 * Shopify-shaped routes: /products/single-pan?variant=id for colour variants,
 * /products/handle for standalone products. */
export function productUrl(productId: string, variantId?: string | null) {
  if (productId === "single-pan" && variantId) {
    return `/products/single-pan?variant=${variantId}`;
  }
  return `/products/${productId}`;
}

export function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s, l };
}

export function hueFamily(hex: string): string {
  const { h, s } = hexToHsl(hex);
  if (s < 0.12) return "Neutral";
  if (h < 12 || h >= 340) return "Red";
  if (h < 45) return "Earth";
  if (h < 70) return "Yellow";
  if (h < 170) return "Green";
  if (h < 255) return "Blue";
  if (h < 310) return "Violet";
  return "Pink";
}

export const HUE_SORT_ORDER = ["Blue", "Green", "Yellow", "Earth", "Red", "Pink", "Violet", "Neutral"];

export function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function descriptorFor(p: Pigment) {
  if (p.granulation === "None" && p.staining === "High") return "Staining, no granulation";
  const gran = p.granulation === "None" ? "No granulation" : `${p.granulation} granulation`;
  return `${gran}, ${p.transparency.toLowerCase()}`;
}
