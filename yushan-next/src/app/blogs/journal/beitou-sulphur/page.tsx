import type { Metadata } from "next";
import Link from "next/link";
import { pigmentsById } from "@/lib/data";
import { Swatch } from "@/components/Swatch";

export const metadata: Metadata = {
  title: "Why Beitou Sulphur Has No Synthetic Equivalent | Journal",
  description: "What actually happens in Taipei's Beitou geothermal valley to produce a watercolour pigment, and why no lab has reproduced it synthetically.",
  openGraph: {
    type: "article",
    title: "Why Beitou Sulphur has no synthetic equivalent",
    description: "What actually happens in a geothermal valley to produce a pigment, and why no lab has reproduced it.",
    images: ["/images/palette-mixing-hero.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org/",
  "@type": "Article",
  headline: "Why Beitou Sulphur has no synthetic equivalent",
  description: "What actually happens in a geothermal valley to produce a pigment, and why no lab has reproduced it.",
  image: "https://yushancolour.com/images/palette-mixing-hero.jpg",
  datePublished: "2026-03-04",
  author: { "@type": "Organization", name: "Yushan Colour Co." },
  publisher: { "@type": "Organization", name: "Yushan Colour Co." },
};

export default function BeitouSulphurPostPage() {
  const beitou = pigmentsById["beitou-sulphur"];

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blogs/journal">Journal</Link> / <span>Beitou Sulphur</span>
      </div>

      <article className="journal-post">
        <div className="journal-post__head">
          <span className="eyebrow">Pigment notes</span>
          <h1>Why Beitou Sulphur has no synthetic equivalent</h1>
          <div className="journal-post__meta">Published 2026-03-04 · Yushan Colour Co.</div>
        </div>
        <div className="journal-post__hero journal-post__hero--swatch" style={{ position: "relative" }}>
          {beitou && <Swatch pigment={beitou} fill />}
        </div>

        <p>
          Every other colour in the Yushan range has a Colour Index code, which means it&apos;s a manufactured pigment with a known chemical
          structure that, in principle, any paintmaker could reproduce under a different name. Beitou Sulphur doesn&apos;t have one, and the
          reason isn&apos;t secrecy. It&apos;s that there&apos;s no formula to protect.
        </p>

        <h2>What&apos;s actually in the valley</h2>
        <p>
          Beitou sits at the northern edge of Taipei, built around a geothermal system that has been active for thousands of years.
          Mineral-rich steam rises through fractured rock and deposits sediment as it cools and meets air, a slow accretion that has been
          mined in the area, in various forms, for over a century. The sediment isn&apos;t sulphur alone. It&apos;s a mixed mineral deposit,
          sulphur among iron oxides and trace metals, and the exact ratio shifts slightly from one collection point to the next.
        </p>
        <p>
          That inconsistency is precisely what a synthetic pigment manufacturer would try to engineer out. A commercial pigment needs to be
          the same batch after batch, which means starting from a purified, characterized chemical rather than a variable natural sediment.
          Beitou Sulphur keeps the variability, because the variability is the granulation.
        </p>

        <h2>Why the granulation is what it is</h2>
        <p>
          Granulation in a watercolour happens when pigment particles are too large or too irregular to stay in even suspension, so they
          settle unevenly into the tooth of the paper as it dries. Manufactured pigments are ground to a controlled, fine particle size
          specifically to avoid this. Beitou Sulphur is ground much closer to its raw mineral state, so the particle size distribution is
          wide and the shapes are irregular, which is exactly the condition that produces heavy granulation.
        </p>
        <p>
          It&apos;s also why the colour is rated semi-opaque rather than transparent. The mineral particles are large enough to scatter
          light rather than let it pass through to the paper and back, which is a physical property, not a formulation choice.
        </p>

        <h2>What &quot;no synthetic equivalent&quot; actually means</h2>
        <p>
          It doesn&apos;t mean nobody has tried to make a gold-amber granulating pigment. Several exist. It means none of them are ground
          from this specific deposit, so none of them granulate quite the same way under a wet-into-wet wash, the same way no two mineral
          deposits anywhere produce identical results. That&apos;s the whole claim, and it&apos;s checkable: put it next to any commercial
          mineral gold and watch how it settles.
        </p>

        <div className="journal-post__byline">Written by the Yushan workshop.</div>
      </article>
    </main>
  );
}
