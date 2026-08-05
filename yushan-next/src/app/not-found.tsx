import Link from "next/link";
import { productsById, pigmentsById } from "@/lib/data";
import { RelatedProductCard, PigmentCard } from "@/components/ProductCard";

const POPULAR_PRODUCT_IDS = ["the-eighteen", "dot-card", "landscape-six"];

export default function NotFound() {
  const featuredPigment = pigmentsById["ultramarine-blue"];

  return (
    <main id="main">
      <div className="state-page">
        <div className="eyebrow">404</div>
        <h1 style={{ margin: "var(--sp-3) 0" }}>That page doesn&apos;t exist</h1>
        <p style={{ color: "var(--ink-2)" }}>The link may be old, or the address was typed wrong. Here&apos;s where painters usually start instead.</p>
        <Link className="btn btn-outline" href="/" style={{ marginTop: "var(--sp-4)" }}>
          Back to the homepage
        </Link>
      </div>

      <section className="section">
        <div className="section__head section__head--center">
          <h2>Popular starting points</h2>
        </div>
        <div className="related-grid">
          {POPULAR_PRODUCT_IDS.map((id) => {
            const product = productsById[id];
            return product ? <RelatedProductCard product={product} key={id} /> : null;
          })}
          {featuredPigment && <PigmentCard pigment={featuredPigment} />}
        </div>
      </section>
    </main>
  );
}
