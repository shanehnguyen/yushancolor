import type { Metadata } from "next";
import Link from "next/link";
import { pigmentsById } from "@/lib/data";
import { Swatch } from "@/components/Swatch";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on pigment, lightfastness testing, and the two Taiwanese mineral deposits behind Yushan's house colours.",
};

const POSTS = [
  {
    href: "/blogs/journal/beitou-sulphur",
    pigmentId: "beitou-sulphur",
    date: "2026-03-04",
    title: "Why Beitou Sulphur has no synthetic equivalent",
    excerpt: "What actually happens in a geothermal valley to produce a pigment, and why no lab has reproduced it.",
  },
  {
    href: "/blogs/journal/blue-wool",
    pigmentId: "hansa-yellow-light",
    date: "2026-01-18",
    title: "How we read a Blue Wool test",
    excerpt: "The scale behind every BW number on the site, and why a 6 is published instead of quietly dropped.",
  },
];

export default function JournalPage() {
  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Journal</span>
      </div>

      <div className="container" style={{ paddingTop: "var(--sp-6)", paddingBottom: "var(--sp-3)" }}>
        <div className="section__head section__head--center">
          <h1>Journal</h1>
          <p>
            Notes on pigment, testing, and the two deposits behind the house minerals. Not a marketing blog: if a post doesn&apos;t teach
            you something you could check yourself, it doesn&apos;t get written.
          </p>
        </div>
      </div>

      <div className="journal-list">
        {POSTS.map((post) => {
          const pigment = pigmentsById[post.pigmentId];
          return (
            <Link className="journal-card" href={post.href} key={post.href}>
              <div className="journal-card__img" style={{ position: "relative" }}>
                {pigment && <Swatch pigment={pigment} fill />}
              </div>
              <div className="journal-card__body">
                <span className="eyebrow">{post.date}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
