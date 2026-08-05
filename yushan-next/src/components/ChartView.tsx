"use client";

import { useState } from "react";
import Link from "next/link";
import { pigments, productUrl } from "@/lib/data";
import { Swatch } from "@/components/Swatch";

export function ChartView() {
  const [selectedId, setSelectedId] = useState(pigments[0].id);
  const selected = pigments.find((p) => p.id === selectedId)!;

  return (
    <>
      <main id="main">
        <div className="container" style={{ paddingTop: "var(--sp-5)", paddingBottom: "var(--sp-6)" }}>
          <div className="section__head section__head--center">
            <h1>The Chart</h1>
            <p>
              Every colour Yushan mills, with its full Colour Index code, Blue Wool lightfastness rating, transparency, granulation and staining.
              Select a swatch, or tab to it and press Enter.
            </p>
          </div>

          <div className="chart-page-grid" role="listbox" aria-label="Pigment chart">
            {pigments.map((p) => (
              <button
                type="button"
                key={p.id}
                role="option"
                aria-selected={p.id === selectedId}
                onClick={() => setSelectedId(p.id)}
                style={{ position: "relative", border: 0, padding: 0, cursor: "pointer" }}
              >
                <Swatch pigment={p} fill />
              </button>
            ))}
          </div>

          <div className="chart-readout" aria-live="polite">
            <dl className="spec-table" style={{ maxWidth: 480 }}>
              <div className="spec-table__row">
                <dt>Colour</dt>
                <dd>
                  {selected.name}
                  {selected.house ? " (house mineral)" : ""}
                </dd>
              </div>
              <div className="spec-table__row">
                <dt>Colour Index</dt>
                <dd className="mono">{selected.ci}</dd>
              </div>
              <div className="spec-table__row">
                <dt>Lightfastness</dt>
                <dd className="mono">Blue Wool {selected.blueWool} of 8</dd>
              </div>
              <div className="spec-table__row">
                <dt>Transparency</dt>
                <dd>{selected.transparency}</dd>
              </div>
              <div className="spec-table__row">
                <dt>Granulation</dt>
                <dd>{selected.granulation}</dd>
              </div>
              <div className="spec-table__row">
                <dt>Staining</dt>
                <dd>{selected.staining}</dd>
              </div>
              <div className="spec-table__row">
                <dt>Note</dt>
                <dd>{selected.note}</dd>
              </div>
            </dl>
            <Link className="btn btn-outline" href={productUrl("single-pan", selected.id)}>
              Shop {selected.name}, $11
            </Link>
          </div>

          <div className="chart-actions">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              Print or save as PDF
            </button>
            <Link className="btn-link" href="/collections/single-pans">
              Shop these colours
            </Link>
          </div>
        </div>

        <section className="section">
          <div className="section__head section__head--center">
            <h2>Full data table</h2>
            <p>Every field, every colour, in one screenshot-able table.</p>
          </div>
          <div className="compare-table" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Colour</th>
                  <th>CI code</th>
                  <th>Blue Wool</th>
                  <th>Transparency</th>
                  <th>Granulation</th>
                  <th>Staining</th>
                </tr>
              </thead>
              <tbody>
                {pigments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.ci}</td>
                    <td>{p.blueWool}</td>
                    <td>{p.transparency}</td>
                    <td>{p.granulation}</td>
                    <td>{p.staining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
