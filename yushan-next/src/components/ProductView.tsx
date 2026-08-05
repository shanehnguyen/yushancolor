"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { catalog, descriptorFor, money, pigments, pigmentsById, productUrl, products } from "@/lib/data";
import { Swatch, SwatchWithLabel } from "@/components/Swatch";
import { TinGrid } from "@/components/TinGrid";
import { LightfastGrid } from "@/components/LightfastGrid";
import { ShipBox } from "@/components/ShipBox";
import { RelatedProductCard } from "@/components/ProductCard";
import { CompareTable } from "@/components/CompareTable";
import { MakerStory } from "@/components/MakerStory";
import { ProductFaq } from "@/components/ProductFaq";
import { useCart } from "@/lib/cart-context";

const LIFESTYLE_ALT = "Close-up of a painter mixing colour on a palette in the workshop, for scale";

function LifestyleSlide() {
  return <Image src="/images/workshop-mixing.jpg" alt={LIFESTYLE_ALT} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />;
}

export function ProductView({
  product,
  initialVariantId,
  batchInfo,
}: {
  product: Product;
  initialVariantId?: string;
  batchInfo: { batchNumber: number; detail: string } | null;
}) {
  const router = useRouter();
  const cart = useCart();
  const isVariantProduct = product.variantOf === "pigments";
  const [variantId, setVariantId] = useState(initialVariantId || "ultramarine-blue");
  const [slide, setSlide] = useState(0);
  const [qty, setQty] = useState(1);
  const [stickyVisible, setStickyVisible] = useState(false);
  const atcRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSlide(0);
  }, [variantId]);

  useEffect(() => {
    const anchor = atcRef.current;
    if (!anchor || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(anchor);
    return () => io.disconnect();
  }, []);

  const pig = isVariantProduct ? pigmentsById[variantId] : null;

  function selectVariant(id: string) {
    setVariantId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", id);
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  }

  const title = isVariantProduct && pig ? `${pig.name}, Single Pan` : product.name;
  const descriptor = pig ? pig.note : product.shortDescription;

  let unitNote: string | null = null;
  if (product.id === "the-eighteen") unitNote = `${money(product.price / 18)} per pan`;
  else if (product.id === "botanical-eight") unitNote = `${money(product.price / 8)} per pan`;
  else if (product.id === "landscape-six") unitNote = `${money(product.price / 6)} per pan`;
  else if (product.id === "puli-block") unitNote = `${money(product.price / 20)} per sheet`;

  // ---------- Gallery slides ----------
  type Slide = { alt: string; node: React.ReactNode };
  let slides: Slide[];
  if (isVariantProduct && pig) {
    slides = [
      { alt: `${pig.name} at masstone`, node: <Swatch pigment={pig} fill /> },
      { alt: `${pig.name} diluted`, node: <Swatch pigment={pig} mode="dilution" fill /> },
      { alt: `${pig.name} wet-in-wet, showing granulation`, node: <Swatch pigment={pig} mode="wet" fill /> },
      { alt: LIFESTYLE_ALT, node: <LifestyleSlide /> },
    ];
  } else if (product.isPaper) {
    slides = [
      { alt: `${product.name} texture`, node: <div className="pattern-tile" style={{ width: "100%", height: "100%", opacity: 0.7 }} /> },
      {
        alt: `${product.name} specifications`,
        node: product.paperSpec ? (
          <div className="spec-slide">
            <strong>
              {product.paperSpec.gsm}, {product.paperSpec.cotton} cotton
            </strong>
            <span>
              {product.paperSpec.surface}, {product.paperSpec.deckle}
            </span>
            <span>
              {product.paperSpec.sheets}, {product.paperSpec.sheetSize}
            </span>
          </div>
        ) : null,
      },
      { alt: LIFESTYLE_ALT, node: <LifestyleSlide /> },
    ];
  } else {
    const ids = product.includesPigments || [];
    slides = [
      { alt: `${product.name}, pans in the tin`, node: <TinGrid pigmentIds={ids} pigmentsById={pigmentsById} /> },
      {
        alt: `${product.name}, every colour swatched on paper`,
        node: (
          <div className="swatch-strip">
            {ids.map((id) => (pigmentsById[id] ? <SwatchWithLabel pigment={pigmentsById[id]} key={id} /> : null))}
          </div>
        ),
      },
      { alt: LIFESTYLE_ALT, node: <LifestyleSlide /> },
    ];
  }

  // ---------- Spec table ----------
  const spec = catalog.sharedPanSpec;
  const rows: [string, React.ReactNode][] = [];
  if (pig) {
    rows.push(["Colour Index", <span className="mono" key="ci">{pig.ci}</span>]);
    rows.push(["Lightfastness", <span className="mono" key="bw">Blue Wool {pig.blueWool} of 8</span>]);
    rows.push(["Transparency", pig.transparency]);
    rows.push(["Granulation", pig.granulation]);
    rows.push(["Staining", pig.staining]);
  }
  if (product.isPaper && product.paperSpec) {
    const ps = product.paperSpec;
    rows.push(["Weight", ps.gsm]);
    rows.push(["Cotton content", ps.cotton]);
    rows.push(["Sizing", ps.sizing]);
    rows.push(["Surface", ps.surface]);
    rows.push(["Edges", ps.deckle]);
    rows.push(["Sheet count", ps.sheets]);
    rows.push(["Sheet size", ps.sheetSize]);
    rows.push(["Origin", "Puli, Nantou"]);
  } else if (product.isTrial) {
    rows.push(["Format", product.format]);
    rows.push(["Colours included", "18"]);
    rows.push(["Certification", spec.certification]);
    rows.push(["Made in", spec.madeIn]);
  } else if (!product.isPaper) {
    rows.push(["Format", product.id === "single-pan" ? spec.format : product.format]);
    rows.push(["Binder", spec.binder]);
    rows.push(["Fillers", spec.fillers]);
    if (!pig) rows.push(["Lightfastness range", spec.lightfastnessRange]);
    rows.push(["Certification", spec.certification]);
    rows.push(["Made in", spec.madeIn]);
    rows.push(["Batch size", `${spec.batchSize} pans`]);
  }

  // ---------- Set chart ----------
  const [readoutId, setReadoutId] = useState(product.includesPigments?.[0]);
  const showSetChart = !isVariantProduct && !product.isPaper && product.includesPigments && product.includesPigments.length > 0;
  const readoutPigment = readoutId ? pigmentsById[readoutId] : null;

  // ---------- Related ----------
  function pickRelated(): Product | undefined {
    if (isVariantProduct && pig) {
      const homeSet = products.find(
        (p) => (p.id === "landscape-six" || p.id === "botanical-eight") && p.includesPigments && p.includesPigments.includes(pig.id)
      );
      return homeSet || products.find((p) => p.id === "dot-card");
    }
    if (product.id === "dot-card") return products.find((p) => p.id === "the-eighteen");
    if (product.id === "puli-block") return products.find((p) => p.id === "dot-card");
    return products.find((p) => p.id === "dot-card");
  }
  const related = pickRelated();
  const showRelated = related && related.id !== product.id;
  const relatedHeading = isVariantProduct
    ? `${related?.name} includes this colour`
    : product.id === "dot-card"
    ? "Ready to commit to a set?"
    : "Still deciding?";

  function lineItem() {
    if (isVariantProduct && pig) {
      return { productId: product.id, variantId: pig.id, name: `${pig.name}, Single Pan`, unitPrice: product.price, variantLabel: pig.ci, qty };
    }
    return { productId: product.id, variantId: null, name: product.name, unitPrice: product.price, variantLabel: product.format, qty };
  }

  return (
    <>
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/collections/all">Shop all</Link> / <span>{title}</span>
      </div>

      <main id="main">
        <section className="pdp">
          <div className="gallery">
            <div className="gallery__main" style={{ position: "relative" }}>
              {slides[slide]?.node}
            </div>
            <div className="gallery__thumbs">
              {slides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="gallery__thumb"
                  aria-current={i === slide}
                  aria-label={s.alt}
                  onClick={() => setSlide(i)}
                >
                  {s.node}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-info">
            <div className="pdp-info__rung">{product.rung}</div>
            <h1>{title}</h1>
            <p className="pdp-descriptor">{descriptor}</p>
            <div className="price-row">
              <span>{money(product.price)}</span>
              {unitNote && <span className="unit-note">{unitNote}</span>}
            </div>

            {batchInfo && !product.isPaper && (
              <div className="batch-info">
                <span className="batch-info__num">Batch No. {batchInfo.batchNumber}</span>
                <span className="batch-info__detail">{batchInfo.detail}</span>
              </div>
            )}

            {isVariantProduct && pig && (
              <div className="variant-picker">
                <span className="variant-picker__label">
                  Colour: <strong>{pig.name}</strong>, {pig.ci}
                </span>
                <div className="variant-picker__grid">
                  {pigments.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="variant-swatch"
                      aria-pressed={p.id === variantId}
                      aria-label={p.name}
                      title={p.name}
                      onClick={() => selectVariant(p.id)}
                    >
                      <Swatch pigment={p} fill />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ul className="benefit-list">
              {(product.benefits || []).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <dl className="spec-table">
              {rows.map(([k, v], i) => (
                <div className="spec-table__row" key={i}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <ShipBox />

            <div className="qty-atc-row">
              <div className="qty-input">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  &minus;
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={qty}
                  aria-label="Quantity"
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setQty(Number.isFinite(n) && n > 0 ? n : 1);
                  }}
                />
                <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
              <button type="button" className="btn btn-primary btn-lg btn-block" ref={atcRef} onClick={() => cart.add(lineItem())}>
                Add to cart, {money(product.price)}
              </button>
            </div>
            <p className="return-line">
              <strong>{catalog.shipping.returns}</strong>
            </p>

            {product.id !== "dot-card" && (
              <div className="cross-sell">
                <div className="cross-sell__img" style={{ position: "relative" }}>
                  <Swatch pigment={pigments[0]} fill />
                </div>
                <div className="cross-sell__body">
                  <strong>The Dot Card</strong>
                  <p>All 18 colours in your hands before you commit to a set.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    cart.add({ productId: "dot-card", variantId: null, name: "The Dot Card", unitPrice: 14, variantLabel: "Painted card, no reusable paint", qty: 1 })
                  }
                >
                  Add · $14
                </button>
              </div>
            )}
          </div>
        </section>

        {showSetChart && (
          <section className="section">
            <div className="section__head section__head--center">
              <h2>What&apos;s in this set</h2>
              <p>Tap a colour for its full reading: Colour Index code, Blue Wool rating, transparency, granulation and staining.</p>
            </div>
            <div className="set-chart">
              {product.includesPigments!.map((id) => {
                const p = pigmentsById[id];
                if (!p) return null;
                return (
                  <div key={id} onClick={() => setReadoutId(id)} style={{ cursor: "pointer" }}>
                    <SwatchWithLabel pigment={p} />
                  </div>
                );
              })}
            </div>
            {readoutPigment && (
              <div style={{ marginTop: "var(--sp-5)" }}>
                <dl className="spec-table" style={{ maxWidth: 420 }}>
                  <div className="spec-table__row">
                    <dt>Colour</dt>
                    <dd>
                      {readoutPigment.name}
                      {readoutPigment.house ? " (house mineral)" : ""}
                    </dd>
                  </div>
                  <div className="spec-table__row">
                    <dt>Colour Index</dt>
                    <dd className="mono">{readoutPigment.ci}</dd>
                  </div>
                  <div className="spec-table__row">
                    <dt>Lightfastness</dt>
                    <dd className="mono">Blue Wool {readoutPigment.blueWool} of 8</dd>
                  </div>
                  <div className="spec-table__row">
                    <dt>Transparency</dt>
                    <dd>{readoutPigment.transparency}</dd>
                  </div>
                  <div className="spec-table__row">
                    <dt>Granulation</dt>
                    <dd>{readoutPigment.granulation}</dd>
                  </div>
                  <div className="spec-table__row">
                    <dt>Staining</dt>
                    <dd>{readoutPigment.staining}</dd>
                  </div>
                  <div className="spec-table__row">
                    <dt>Note</dt>
                    <dd>{readoutPigment.note}</dd>
                  </div>
                </dl>
                <Link className="btn btn-outline" href={productUrl("single-pan", readoutPigment.id)}>
                  Shop {readoutPigment.name}, $11
                </Link>
              </div>
            )}
          </section>
        )}

        <section className="section">
          <div className="section__head section__head--center">
            <h2>Twelve months on a window</h2>
            <p>Swatches taped to a south-facing window, unfiltered, checked at twelve months. Blue Wool 6 shows movement. Blue Wool 8 does not.</p>
          </div>
          <LightfastGrid pigmentsById={pigmentsById} />
        </section>

        <CompareTable />
        <MakerStory />
        <ProductFaq />

        {showRelated && related && (
          <section className="section">
            <div className="section__head section__head--center">
              <h2>{relatedHeading}</h2>
            </div>
            <div className="related-grid related-grid--single">
              <RelatedProductCard product={related} />
            </div>
          </section>
        )}
      </main>

      <div className="sticky-atc" data-visible={String(stickyVisible)}>
        <div className="sticky-atc__info">
          <span className="sticky-atc__name">{title}</span>
          <span className="sticky-atc__price">{money(product.price)}</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => cart.add(lineItem())}>
          Add to cart
        </button>
      </div>
    </>
  );
}
