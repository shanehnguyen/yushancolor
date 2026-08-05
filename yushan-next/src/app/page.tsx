import Image from "next/image";
import Link from "next/link";
import { pigments, pigmentsById, productUrl, productsById } from "@/lib/data";
import { Swatch } from "@/components/Swatch";
import { TinGrid } from "@/components/TinGrid";
import { LightfastGrid } from "@/components/LightfastGrid";
import { AddToCartButton } from "@/components/AddToCartButton";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";

const FEATURED_IDS = ["ultramarine-blue", "beitou-sulphur", "hansa-yellow-light", "yushan-slate"];

export default function Home() {
  const featured = FEATURED_IDS.map((id) => pigmentsById[id]).filter(Boolean);
  const landscapeSix = productsById["landscape-six"];
  const dotCard = productsById["dot-card"];
  const theEighteen = productsById["the-eighteen"];

  return (
    <main id="main">
      <section className="home-hero">
        <div className="media-block">
          <Image src="/images/palette-mixing-hero.jpg" alt="Close-up of an artist's hands mixing colour on a watercolour palette" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="home-hero__content">
          <div className="eyebrow">Hand-milled in Taipei, since 2019</div>
          <h1>Every pigment. Every code. No exceptions.</h1>
          <p>Sixteen of eighteen colours are single-pigment. Two are ground from Taiwanese mineral deposits nobody else sells. Every Blue Wool result is published, including the weak one.</p>
          <Link className="btn btn-primary btn-lg" href="/collections/all">
            Shop all colours
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section__head section__head--center">
          <h2>Try these first</h2>
          <p>Four colours that show the range at its extremes: heavy granulation, none at all, and the two nobody else sells.</p>
        </div>
        <div className="related-grid">
          {featured.map((p) => (
            <div className="product-card" key={p.id}>
              <Link href={productUrl("single-pan", p.id)}>
                <div style={{ marginBottom: "var(--sp-3)" }}>
                  <Swatch pigment={p} size="100%" />
                </div>
                <div className="product-card__rung">
                  {p.ci}
                  {p.house ? " · House mineral" : ""}
                </div>
                <div className="product-card__name">{p.name}</div>
                <div className="product-card__price">$11.00</div>
              </Link>
              <AddToCartButton
                item={{ productId: "single-pan", variantId: p.id, name: `${p.name}, Single Pan`, unitPrice: 11, variantLabel: p.ci }}
                label="Add to cart"
                className="btn btn-outline btn-block"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="section--full">
        <div className="editorial-split editorial-split--dark">
          <div className="media-block" style={{ position: "relative" }}>
            <Image src="/images/brush-palette-detail.jpg" alt="Close-up of an artist's hand holding a paintbrush and a palette of watercolours" fill sizes="50vw" style={{ objectFit: "cover" }} />
          </div>
          <div className="editorial-split__content">
            <div className="eyebrow">Not sold anywhere else</div>
            <h2>Two colours nobody else sells</h2>
            <p>
              Beitou Sulphur is ground from mineral deposits in the Beitou geothermal valley. Yushan Slate comes from slate collected in the
              Yushan range. Neither has a Colour Index equivalent anywhere else, and both granulate harder than anything in a commercial mineral
              range.
            </p>
            <div className="mini-product">
              <div className="mini-product__img">
                <TinGrid pigmentIds={landscapeSix.includesPigments || []} pigmentsById={pigmentsById} max={8} />
              </div>
              <div className="mini-product__body">
                <h3>The Landscape Six</h3>
                <div className="price">$58.00</div>
                <Link className="btn btn-primary" href={productUrl("landscape-six")}>
                  Shop the set
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--stat">
        <div className="data-strip">
          <div className="data-strip__stat">
            18<div className="data-strip__label">colours, milled in batches of 40 pans</div>
          </div>
          <div className="data-strip__stat">
            16/18<div className="data-strip__label">single-pigment, listed on every label</div>
          </div>
          <div className="data-strip__stat">
            2<div className="data-strip__label">house minerals sold nowhere else</div>
          </div>
          <div className="data-strip__stat">
            BW 6–8<div className="data-strip__label">lightfastness, published in full</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head section__head--center">
          <h2>The Chart</h2>
          <p>Every colour, its Colour Index code, and how it granulates. Tap any swatch for the full reading.</p>
        </div>
        <div className="chart-preview">
          {pigments.map((p) => (
            <Swatch pigment={p} key={p.id} />
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link className="btn btn-outline" href="/pages/chart">
            Explore the Chart
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section__head section__head--center">
          <h2>Choose a set</h2>
          <p>Start small or start with everything. You can always buy single colours later.</p>
        </div>
        <div className="price-ladder">
          <div className="price-ladder__card">
            <div className="product-card__img">
              <TinGrid pigmentIds={dotCard.includesPigments || []} pigmentsById={pigmentsById} />
            </div>
            <div className="rung">Trial</div>
            <h3>The Dot Card</h3>
            <p className="desc">All 18 colours, hand-painted and labelled on Puli cotton. Ships flat.</p>
            <div className="price">$14.00</div>
            <Link className="btn btn-outline btn-block" href={productUrl("dot-card")}>
              Shop the Dot Card
            </Link>
          </div>
          <div className="price-ladder__card">
            <div className="product-card__img">
              <TinGrid pigmentIds={landscapeSix.includesPigments || []} pigmentsById={pigmentsById} />
            </div>
            <div className="rung">Core</div>
            <h3>The Landscape Six</h3>
            <p className="desc">Two blues, two earths, both house minerals. Built for outdoor work.</p>
            <div className="price">$58.00</div>
            <Link className="btn btn-outline btn-block" href={productUrl("landscape-six")}>
              Shop the Landscape Six
            </Link>
          </div>
          <div className="price-ladder__card featured">
            <div className="product-card__img">
              <TinGrid pigmentIds={theEighteen.includesPigments || []} pigmentsById={pigmentsById} />
            </div>
            <div className="rung">Anchor</div>
            <h3>The Eighteen</h3>
            <p className="desc">The complete range in a Taiwan cypress box with a brass hinge.</p>
            <div className="price">$186.00</div>
            <Link className="btn btn-primary btn-block" href={productUrl("the-eighteen")}>
              Shop the Eighteen
            </Link>
          </div>
        </div>
      </section>

      <section className="section--full">
        <div className="editorial-split editorial-split--reverse">
          <div className="media-block media-block--swatch">
            <Swatch pigment={pigmentsById["hansa-yellow-light"]} fill />
          </div>
          <div className="editorial-split__content">
            <div className="eyebrow">No hiding the weak one</div>
            <h2>We publish the weak result too</h2>
            <p>
              Hansa Yellow Light is rated Blue Wool 6, the weakest lightfastness in the range, and it says so on the pan and on the Chart. A
              visible weak spot is worth more than a suspiciously perfect spec sheet.
            </p>
            <div className="mini-product">
              <div className="mini-product__img">
                <TinGrid pigmentIds={dotCard.includesPigments || []} pigmentsById={pigmentsById} max={8} />
              </div>
              <div className="mini-product__body">
                <h3>The Dot Card</h3>
                <div className="price">$14.00</div>
                <Link className="btn btn-primary" href={productUrl("dot-card")}>
                  See every colour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section--tint">
        <section className="section">
          <div className="proof-block">
            <div className="proof-block__item">
              <div className="num">24 hrs</div>
              <p>From order to shipment, Taipei</p>
            </div>
            <div className="proof-block__item">
              <div className="num">60 days</div>
              <p>Return window, used or unused</p>
            </div>
            <div className="proof-block__item">
              <a className="cert-badge" href="https://www.acmiart.org/" target="_blank" rel="noopener">
                <svg className="cert-badge__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="num">ACMI AP</div>
              </a>
              <p>Certified non-toxic, every pan</p>
            </div>
          </div>
        </section>
      </div>

      <section className="home-hero home-hero--short" id="story">
        <div className="media-block">
          <Image src="/images/workshop-mixing.jpg" alt="Close-up of a painter mixing colour on a palette in the workshop" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="home-hero__content">
          <div className="eyebrow">Datong District, Taipei</div>
          <h2>Two people, one workshop</h2>
          <p>
            Milled by hand in batches of forty pans. The founder spent eleven years as a materials chemist before starting the workshop in 2019,
            which is most of why the site reads like a spec sheet instead of an ad. No distributor, no importer, nothing between the workshop and
            your door.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section__head section__head--center">
          <h2>Twelve months on a window</h2>
          <p>Swatches taped to a south-facing window, unfiltered, checked at twelve months. Blue Wool 6 shows movement. Blue Wool 8 does not.</p>
        </div>
        <LightfastGrid pigmentsById={pigmentsById} className="lightfast-grid--home" />
      </section>

      <div className="brand-quote">
        <p>&quot;The greatest thing a human soul ever does in this world is to see something, and tell what it saw in a plain way.&quot;</p>
        <span>
          John Ruskin, <em>Modern Painters</em>, 1856
        </span>
      </div>

      <section className="section" style={{ borderTop: "none" }}>
        <EmailCaptureForm />
      </section>
    </main>
  );
}
