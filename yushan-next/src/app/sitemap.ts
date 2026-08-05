import type { MetadataRoute } from "next";
import { pigments, products } from "@/lib/data";

const BASE = "https://yushancolour.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/collections/all",
    "/collections/single-pans",
    "/collections/sets",
    "/pages/chart",
    "/pages/paper",
    "/pages/faq",
    "/pages/shipping",
    "/pages/wholesale",
    "/pages/stockists",
    "/policies/privacy-policy",
    "/policies/terms-of-service",
    "/blogs/journal",
    "/blogs/journal/blue-wool",
    "/blogs/journal/beitou-sulphur",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date(0) }));

  const productRoutes = products
    .filter((p) => p.id !== "single-pan")
    .map((p) => ({ url: `${BASE}/products/${p.id}`, lastModified: new Date(0) }));

  const variantRoutes = pigments.map((p) => ({
    url: `${BASE}/products/single-pan?variant=${p.id}`,
    lastModified: new Date(0),
  }));

  return [...staticRoutes, ...productRoutes, ...variantRoutes];
}
