import type { Metadata } from "next";
import Link from "next/link";
import { productsById } from "@/lib/data";

export const metadata: Metadata = {
  title: "Puli Paper",
  description: "Handmade cotton paper from Puli, Nantou. Cold press, 300gsm, 100% cotton. The exact paper every colour in the range is tested on.",
};

export default function PaperPage() {
  const puliBlock = productsById["puli-block"];

  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Paper</span>
      </div>

      <div className="container" style={{ paddingTop: "var(--sp-5)" }}>
        <div className="section__head section__head--center">
          <h1>The paper behind every swatch</h1>
          <p>
            Every studio swatch on this site, including the ones on the Chart and every product page, is painted on the same stock: a
            handmade cotton block from Puli, Nantou. Here&apos;s what it is and why it matters.
          </p>
        </div>
      </div>

      <section className="section" style={{ borderTop: "none" }}>
        <div className="section__head section__head--center">
          <h2>Why this paper</h2>
          <p>How the Puli block compares to a typical student block.</p>
        </div>
        <div className="compare-table">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Puli Block</th>
                <th>Typical student block</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cotton content</td>
                <td>100%</td>
                <td>Often wood pulp, 0–25% cotton</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>300gsm</td>
                <td>Varies, frequently under 200gsm</td>
              </tr>
              <tr>
                <td>Sizing</td>
                <td>Internal, gelatin</td>
                <td>Surface-sized only, common cause of granulation problems</td>
              </tr>
              <tr>
                <td>Edges</td>
                <td>Deckle, all four sides</td>
                <td>Machine-cut</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" id="story">
        <div className="maker-story">
          <div
            className="maker-story__img maker-story__img--pattern pattern-tile"
            role="img"
            aria-label="Puli cotton paper texture, represented as a woven pattern"
          />
          <div className="maker-story__text">
            <h2>Puli, Nantou</h2>
            <p>
              Puli is a town in Nantou county, central Taiwan, where most of the island&apos;s traditional papermaking still runs through a
              handful of family workshops. This block comes from one of them: 100% cotton, cold press, hand-formed a sheet at a time rather
              than run off a machine roll.
            </p>
            <p>
              It&apos;s also the surface the whole Yushan range was formulated against. When a pigment note on this site says a colour
              &quot;granulates hard&quot; or &quot;lifts cleanly,&quot; that reading was taken on this paper, not a lab card. A different
              paper will change how every colour in the range behaves.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head section__head--center">
          <h2>Questions before you order</h2>
        </div>
        <div>
          <details className="faq-item" open>
            <summary>Is this the same paper the studio photos are painted on?</summary>
            <p>Yes. Every swatch photographed for this site, including the Chart and every single-pan product page, is painted on this exact block.</p>
          </details>
          <details className="faq-item">
            <summary>Will heavy granulating colours buckle it?</summary>
            <p>
              No, not at a normal wash weight. 300gsm cotton with internal sizing holds Beitou Sulphur and Yushan Slate, the two heaviest
              granulators in the range, without cockling under a single wet pass. Repeated heavy soaking will still need stretching, as with
              any block.
            </p>
          </details>
          <details className="faq-item">
            <summary>Is it gummed on all sides or just taped?</summary>
            <p>
              Gummed on all four sides. It stays flat under a wash without pins or tape, and you work through the block one sheet at a time
              by running a blunt knife around the edge.
            </p>
          </details>
          <details className="faq-item">
            <summary>How much is shipping from Taiwan, and will I get a customs bill?</summary>
            <p>$9 worldwide, free over $80, arriving in 6 to 9 business days. Duties and import tax are prepaid at checkout. Nothing is owed on delivery.</p>
          </details>
          <details className="faq-item">
            <summary>What if I don&apos;t like it?</summary>
            <p>60-day return, used or unused.</p>
          </details>
        </div>
      </section>

      {puliBlock && (
        <section className="section">
          <div className="section__head section__head--center">
            <h2>Shop the Puli Block</h2>
            <p>{puliBlock.shortDescription}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link className="btn btn-primary btn-lg" href={`/products/${puliBlock.id}`}>
              View the Puli Block, {`$${puliBlock.price.toFixed(2)}`}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
