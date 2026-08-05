import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";

const COLLECTIONS = {
  all: {
    title: "Shop all",
    description: "Eighteen colours, sixteen of them single-pigment, milled by hand in Datong District, Taipei.",
    scope: "all" as const,
  },
  "single-pans": {
    title: "Single pans",
    description: "Eighteen watercolour pigments milled in Taipei. Filter by hue, granulation, transparency and Blue Wool lightfastness rating.",
    scope: "colours" as const,
  },
  sets: {
    title: "Sets & kits",
    description: "Curated sets built around a purpose, from a $14 trial card to the complete eighteen-colour range.",
    scope: "sets" as const,
  },
};

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const collection = COLLECTIONS[handle as keyof typeof COLLECTIONS];
  if (!collection) return {};
  return { title: collection.title, description: collection.description };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = COLLECTIONS[handle as keyof typeof COLLECTIONS];
  if (!collection) notFound();
  return <CollectionView scope={collection.scope} title={collection.title} description={collection.description} />;
}
