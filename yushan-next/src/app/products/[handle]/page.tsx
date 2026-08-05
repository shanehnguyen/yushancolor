import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, pigmentsById, products } from "@/lib/data";
import { ProductView } from "@/components/ProductView";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.id }));
}

function getProduct(handle: string) {
  return products.find((p) => p.id === handle);
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<{ variant?: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return {};
  const isVariantProduct = product.variantOf === "pigments";
  let title = product.name;
  let description = product.shortDescription;
  if (isVariantProduct) {
    const { variant } = await searchParams;
    const pig = pigmentsById[variant || "ultramarine-blue"];
    if (pig) {
      title = `${pig.name}, Single Pan`;
      description = pig.note;
    }
  }
  return {
    title,
    description,
    openGraph: { type: "website", title, description, images: ["/images/palette-mixing-hero.jpg"] },
    twitter: { card: "summary_large_image", title, description },
  };
}

function computeBatchInfo() {
  const MS_PER_BATCH = 14 * 24 * 60 * 60 * 1000;
  const EPOCH = new Date("2019-03-04T00:00:00Z").getTime();
  const now = Date.now();
  const batchNumber = Math.floor((now - EPOCH) / MS_PER_BATCH) + 1;
  const batchStart = EPOCH + (batchNumber - 1) * MS_PER_BATCH;
  const nextBatch = new Date(batchStart + MS_PER_BATCH);
  const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return { batchNumber, detail: `${catalog.sharedPanSpec.batchSize} pans per batch · next batch mills ${dateFmt.format(nextBatch)}` };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const isVariantProduct = product.variantOf === "pigments";
  const { variant } = await searchParams;
  const initialVariantId = isVariantProduct ? variant || "ultramarine-blue" : undefined;

  const pig = isVariantProduct ? pigmentsById[initialVariantId!] : null;
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: pig ? `${pig.name}, Single Pan` : product.name,
    description: pig ? pig.note : product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Yushan Colour Co." },
    offers: { "@type": "Offer", priceCurrency: "USD", price: product.price, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} initialVariantId={initialVariantId} batchInfo={product.isPaper ? null : computeBatchInfo()} />
    </>
  );
}
