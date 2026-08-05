import type { Metadata } from "next";
import Link from "next/link";
import { pigmentsById } from "@/lib/data";
import { LightfastGrid } from "@/components/LightfastGrid";

export const metadata: Metadata = {
  title: "How We Read a Blue Wool Test | Journal",
  description: "The lightfastness scale behind every Blue Wool number on the site, and why a weak result gets published instead of quietly dropped.",
  openGraph: {
    type: "article",
    title: "How we read a Blue Wool test",
    description: "The scale behind every BW number on the site, and why a 6 is published instead of quietly dropped.",
    images: ["/images/palette-mixing-hero.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org/",
  "@type": "Article",
  headline: "How we read a Blue Wool test",
  description: "The scale behind every BW number on the site, and why a 6 is published instead of quietly dropped.",
  image: "https://yushancolour.com/images/palette-mixing-hero.jpg",
  datePublished: "2026-01-18",
  author: { "@type": "Organization", name: "Yushan Colour Co." },
  publisher: { "@type": "Organization", name: "Yushan Colour Co." },
};

export default function BlueWoolPostPage() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blogs/journal">Journal</Link> / <span>Blue Wool</span>
      </div>

      <article className="journal-post">
        <div className="journal-post__head">
          <span className="eyebrow">Lightfastness</span>
          <h1>How we read a Blue Wool test</h1>
          <div className="journal-post__meta">Published 2026-01-18 · Yushan Colour Co.</div>
        </div>
        <LightfastGrid pigmentsById={pigmentsById} className="journal-post__hero-grid" />

        <p>
          Every colour on this site carries a Blue Wool number from 1 to 8. It&apos;s on the Chart, on every product page, and on the pan
          itself. Most watercolour brands either don&apos;t publish it or bury it in a technical PDF nobody reads before buying. Here&apos;s
          what the number actually measures, and why we&apos;d rather show a 6 than hide it.
        </p>

        <h2>What the scale is</h2>
        <p>
          The Blue Wool scale is a lightfastness standard: eight strips of wool dyed to fade at known, doubling rates under controlled light
          exposure. A pigment is exposed alongside the strips, and whichever strip fades to match it sets the rating. Blue Wool 1 fades
          fastest, Blue Wool 8 barely fades at all inside a human lifetime of normal display. Each step up roughly doubles the light exposure
          required to produce visible fading, so the difference between a 6 and an 8 is not small.
        </p>
        <p>
          It&apos;s a comparative test, not a guess. Two labs running it correctly on the same pigment sample should land on the same
          number, which is part of why we trust it over marketing language like &quot;permanent&quot; that has no defined threshold behind
          it.
        </p>

        <h2>Where the range actually lands</h2>
        <p>
          Sixteen of eighteen colours in the range test at Blue Wool 7 or 8, which is the band generally considered safe for permanent
          display, framed and lit, without special glass. Two don&apos;t: Beitou Sulphur and Quinacridone Rose test at 7, still in the safe
          band but with less headroom. Hansa Yellow Light is the outlier at Blue Wool 6, meaning it will show visible fading over years in
          direct light faster than the rest of the range.
        </p>
        <p>
          We didn&apos;t reformulate Hansa Yellow Light to hide that, and we didn&apos;t drop it from the range. It&apos;s a genuinely useful
          clean yellow for work that isn&apos;t going to hang in a sunlit room for a decade, and the honest move is publishing the number and
          letting a painter decide, not making that decision for them by omission.
        </p>

        <h2>What this doesn&apos;t tell you</h2>
        <p>
          Blue Wool measures fade under exposure, not chemical stability, staining behaviour, or granulation, which is why the Chart lists
          it alongside those properties rather than instead of them. A colour can be Blue Wool 8 and still stain a mixing well permanently,
          or granulate unpredictably in a wet wash. It&apos;s one number in a fuller reading, and it&apos;s the one number we think is least
          defensible to leave off a label.
        </p>

        <div className="journal-post__byline">Written by the Yushan workshop.</div>
      </article>
    </main>
  );
}
