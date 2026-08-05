"use client";

import { useMemo, useState } from "react";
import { HUE_SORT_ORDER, hueFamily, pigments, products } from "@/lib/data";
import { PigmentCard, SetCard } from "@/components/ProductCard";

type Scope = "all" | "colours" | "sets";
type Tab = "colours" | "sets";

const pigmentsWithHue = pigments.map((p) => ({ ...p, hueFamily: hueFamily(p.hex) }));
const HUES = [...new Set(pigmentsWithHue.map((p) => p.hueFamily))].sort();
const GRANULATIONS = ["None", "Light", "Medium", "Heavy", "Very heavy"];
const TRANSPARENCIES = [...new Set(pigments.map((p) => p.transparency))];
const BLUEWOOLS = [6, 7, 8];

type SortKey = "featured" | "price-asc" | "price-desc" | "bw-desc" | "name-asc";

export function CollectionView({ scope, title, description }: { scope: Scope; title: string; description: string }) {
  const [tab, setTab] = useState<Tab>(scope === "sets" ? "sets" : "colours");
  const [hues, setHues] = useState<string[]>([]);
  const [grans, setGrans] = useState<string[]>([]);
  const [trans, setTrans] = useState<string[]>([]);
  const [bws, setBws] = useState<number[]>([]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  const showTabs = scope === "all";
  const effectiveTab: Tab = scope === "all" ? tab : (scope as Tab);

  const filteredPigments = useMemo(() => {
    let list = pigmentsWithHue.filter(
      (p) =>
        (!hues.length || hues.includes(p.hueFamily)) &&
        (!grans.length || grans.includes(p.granulation)) &&
        (!trans.length || trans.includes(p.transparency)) &&
        (!bws.length || bws.includes(p.blueWool))
    );
    if (sort === "price-asc" || sort === "price-desc") {
      // all single pans are $11, order unaffected
    } else if (sort === "bw-desc") {
      list = [...list].sort((a, b) => b.blueWool - a.blueWool);
    } else if (sort === "name-asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => {
        const d = HUE_SORT_ORDER.indexOf(a.hueFamily) - HUE_SORT_ORDER.indexOf(b.hueFamily);
        return d !== 0 ? d : a.name.localeCompare(b.name);
      });
    }
    return list;
  }, [hues, grans, trans, bws, sort]);

  const setList = useMemo(() => {
    let list = products.filter((p) => p.id !== "single-pan" && (scope !== "sets" || !p.isPaper));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [scope, sort]);

  const activeChips: { name: string; value: string }[] = [
    ...hues.map((v) => ({ name: "hue", value: v })),
    ...grans.map((v) => ({ name: "granulation", value: v })),
    ...trans.map((v) => ({ name: "transparency", value: v })),
    ...bws.map((v) => ({ name: "bluewool", value: String(v) })),
  ];

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function toggleBw(v: number) {
    setBws((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  function removeChip(name: string, value: string) {
    if (name === "hue") setHues((v) => v.filter((x) => x !== value));
    if (name === "granulation") setGrans((v) => v.filter((x) => x !== value));
    if (name === "transparency") setTrans((v) => v.filter((x) => x !== value));
    if (name === "bluewool") setBws((v) => v.filter((x) => x !== Number(value)));
  }

  function clearFilters() {
    setHues([]);
    setGrans([]);
    setTrans([]);
    setBws([]);
  }

  const resultCount = effectiveTab === "colours" ? `${filteredPigments.length} colour${filteredPigments.length === 1 ? "" : "s"}` : `${setList.length} sets and kits`;

  return (
    <>
      <main id="main">
        <div className="container" style={{ paddingTop: "var(--sp-5)" }}>
          <div className="section__head section__head--center">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {showTabs && (
            <div className="collection-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === "colours"} onClick={() => setTab("colours")}>
                All colours
              </button>
              <button type="button" role="tab" aria-selected={tab === "sets"} onClick={() => setTab("sets")}>
                Sets &amp; kits
              </button>
            </div>
          )}
        </div>

        {effectiveTab === "colours" && (
          <div className="filter-band">
            <div className="filter-band__row">
              <div className="filter-band__left">
                <button type="button" className="filter-toggle" aria-expanded={filterOpen} onClick={() => setFilterOpen((v) => !v)}>
                  All filters ⚙
                </button>
                <div className="active-chips">
                  {activeChips.map((c) => (
                    <span className="chip" key={`${c.name}::${c.value}`}>
                      {c.value}
                      <button type="button" aria-label={`Remove ${c.value} filter`} onClick={() => removeChip(c.name, c.value)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="filter-band__right">
                <span>{resultCount}</span>
                <select className="select-plain" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="featured">Sort: Best selling</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                  <option value="bw-desc">Blue Wool, high to low</option>
                  <option value="name-asc">Name, A to Z</option>
                </select>
              </div>
            </div>
            {filterOpen && (
              <div className="filter-panel">
                <div className="filter-panel__groups">
                  <div className="filter-group">
                    <h4>Hue</h4>
                    <div>
                      {HUES.map((v) => (
                        <label className="filter-option" key={v}>
                          <input type="checkbox" checked={hues.includes(v)} onChange={() => toggle(hues, setHues, v)} />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <h4>Granulation</h4>
                    <div>
                      {GRANULATIONS.map((v) => (
                        <label className="filter-option" key={v}>
                          <input type="checkbox" checked={grans.includes(v)} onChange={() => toggle(grans, setGrans, v)} />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <h4>Transparency</h4>
                    <div>
                      {TRANSPARENCIES.map((v) => (
                        <label className="filter-option" key={v}>
                          <input type="checkbox" checked={trans.includes(v)} onChange={() => toggle(trans, setTrans, v)} />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <h4>Lightfastness, Blue Wool</h4>
                    <div>
                      {BLUEWOOLS.map((v) => (
                        <label className="filter-option" key={v}>
                          <input type="checkbox" checked={bws.includes(v)} onChange={() => toggleBw(v)} />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="filter-panel__foot">
                  <button type="button" className="btn-link" onClick={clearFilters}>
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="collection-grid">
          {effectiveTab === "colours"
            ? filteredPigments.length
              ? filteredPigments.map((p) => <PigmentCard pigment={p} key={p.id} />)
              : (
                  <p className="no-results">
                    No colours match those filters.{" "}
                    <button type="button" className="btn-link" onClick={clearFilters}>
                      Clear filters
                    </button>
                  </p>
                )
            : setList.map((p) => <SetCard product={p} key={p.id} />)}
        </div>
      </main>
    </>
  );
}
