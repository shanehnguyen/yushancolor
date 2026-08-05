"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { pigments, products, money, productUrl } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { Swatch } from "@/components/Swatch";
import { TinGrid } from "@/components/TinGrid";
import { pigmentsById } from "@/lib/data";

const GROUP_ORDER = ["Blues", "Greens", "Yellows & earths", "Reds & violets", "Neutrals"] as const;

function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s };
}

function navHueGroup(hex: string): (typeof GROUP_ORDER)[number] {
  const { h, s } = hexToHsl(hex);
  if (s < 0.12) return "Neutrals";
  if (h < 45 || h >= 340) {
    if (h >= 340 || h < 12) return "Reds & violets";
    return "Yellows & earths";
  }
  if (h < 70) return "Yellows & earths";
  if (h < 170) return "Greens";
  if (h < 255) return "Blues";
  return "Reds & violets";
}

const JOURNAL = [
  { title: "How we read a Blue Wool test", url: "/blogs/journal/blue-wool" },
  { title: "Why Beitou Sulphur has no synthetic equivalent", url: "/blogs/journal/beitou-sulphur" },
];

const UTILITY_LINKS = (
  <>
    <Link href="/pages/shipping">Shipping</Link>
    <Link href="/pages/wholesale">Wholesale</Link>
    <Link href="/pages/stockists">Stockists</Link>
  </>
);

export function Header() {
  const cart = useCart();
  const [navOpen, setNavOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"single-pans" | "sets" | null>(null);
  const [mobileOpenPanel, setMobileOpenPanel] = useState<"single-pans" | "sets" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setNavOpen(false);
        setSearchOpen(false);
        setActiveMenu(null);
      }
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, []);

  const groups: Record<string, typeof pigments> = {};
  GROUP_ORDER.forEach((g) => (groups[g] = []));
  pigments.forEach((p) => {
    const g = navHueGroup(p.hex);
    (groups[g] || groups.Neutrals).push(p);
  });

  const sets = products.filter((p) => p.id !== "single-pan" && !p.isPaper);

  const q = query.trim().toLowerCase();
  const matchColours = q ? pigments.filter((p) => p.name.toLowerCase().includes(q) || p.ci.toLowerCase().includes(q)).slice(0, 8) : [];
  const matchSets = q ? products.filter((p) => p.id !== "single-pan" && p.name.toLowerCase().includes(q)).slice(0, 6) : [];
  const matchPosts = q ? JOURNAL.filter((j) => j.title.toLowerCase().includes(q)) : [];
  const hasResults = matchColours.length || matchSets.length || matchPosts.length;

  function openMenu(menu: "single-pans" | "sets") {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(menu);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }

  return (
    <>
      <div className="announcement-bar">Free shipping over $80. Ships from Taipei within 24 hours. Duties prepaid.</div>
      <header className="site-header">
        <div className="header-utility">
          <div className="header-utility__group">{UTILITY_LINKS}</div>
          <div className="header-utility__group">
            <button
              type="button"
              className="header-search-toggle"
              aria-expanded={searchOpen}
              aria-controls="search-panel"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" />
                <path d="M11 11L15 15" stroke="currentColor" strokeLinecap="round" />
              </svg>
              Search
            </button>
            <Link href="/account/login">Account</Link>
            <Link href="/pages/faq">FAQ</Link>
            <button type="button" className="cart-link" aria-haspopup="dialog" onClick={cart.openDrawer}>
              Cart (<span className="cart-count">{cart.totalQty}</span>)
            </button>
          </div>
        </div>
        <div className="header-logo-row">
          <button type="button" className="nav-toggle" aria-label="Open menu" aria-expanded={navOpen} onClick={() => setNavOpen(true)}>
            &#9776;
          </button>
          <Link href="/" className="wordmark-main">
            玉山 Yushan Colour Co.
          </Link>
          <button type="button" className="cart-link cart-link--mobile" aria-haspopup="dialog" onClick={cart.openDrawer}>
            Cart (<span className="cart-count">{cart.totalQty}</span>)
          </button>
        </div>
        <nav className="header-nav-row" data-open={String(navOpen)} aria-label="Main">
          <button type="button" className="nav-close" aria-label="Close menu" onClick={() => setNavOpen(false)}>
            ×
          </button>
          <Link href="/collections/all" onClick={() => setNavOpen(false)}>
            Shop all
          </Link>

          <div className="nav-item" data-menu="single-pans" onMouseEnter={() => openMenu("single-pans")} onMouseLeave={scheduleClose}>
            <div className="nav-item__row">
              <Link href="/collections/single-pans" className="nav-item__link" aria-haspopup="true" aria-expanded={activeMenu === "single-pans"} onClick={() => setNavOpen(false)}>
                Single pans
              </Link>
              <button
                type="button"
                className="nav-item__caret"
                aria-expanded={mobileOpenPanel === "single-pans"}
                aria-label="Show single pans menu"
                onClick={() => setMobileOpenPanel((v) => (v === "single-pans" ? null : "single-pans"))}
              />
            </div>
            <div className="nav-panel" data-active={String(activeMenu === "single-pans")} data-mobile-open={String(mobileOpenPanel === "single-pans")}>
              <div className="nav-panel__inner">
                <div className="nav-hue-groups">
                  {GROUP_ORDER.filter((g) => groups[g].length).map((g) => (
                    <div className="nav-hue-group" key={g}>
                      <h4>{g}</h4>
                      <ul>
                        {groups[g].map((p) => (
                          <li key={p.id}>
                            <Link href={productUrl("single-pan", p.id)} className="nav-swatch-link" onClick={() => setNavOpen(false)}>
                              <Swatch pigment={p} />
                              <span>{p.name}</span>
                              <span className="ci mono">{p.ci}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="nav-item" data-menu="sets" onMouseEnter={() => openMenu("sets")} onMouseLeave={scheduleClose}>
            <div className="nav-item__row">
              <Link href="/collections/sets" className="nav-item__link" aria-haspopup="true" aria-expanded={activeMenu === "sets"} onClick={() => setNavOpen(false)}>
                Sets &amp; kits
              </Link>
              <button
                type="button"
                className="nav-item__caret"
                aria-expanded={mobileOpenPanel === "sets"}
                aria-label="Show sets and kits menu"
                onClick={() => setMobileOpenPanel((v) => (v === "sets" ? null : "sets"))}
              />
            </div>
            <div className="nav-panel" data-active={String(activeMenu === "sets")} data-mobile-open={String(mobileOpenPanel === "sets")}>
              <div className="nav-panel__inner">
                <div className="nav-set-grid">
                  {sets.map((p) => (
                    <Link href={productUrl(p.id)} className="nav-set-card" key={p.id} onClick={() => setNavOpen(false)}>
                      <div className="nav-set-card__img">
                        <TinGrid pigmentIds={p.includesPigments || []} pigmentsById={pigmentsById} max={8} />
                      </div>
                      <strong>{p.name}</strong>
                      <span>{money(p.price)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link href="/pages/paper" onClick={() => setNavOpen(false)}>
            Paper
          </Link>
          <Link href="/pages/chart" onClick={() => setNavOpen(false)}>
            The Chart
          </Link>
          <Link href="/blogs/journal" onClick={() => setNavOpen(false)}>
            Journal
          </Link>
          <div className="header-nav-utility">
            {UTILITY_LINKS}
            <Link href="/account/login">Account</Link>
            <Link href="/pages/faq">FAQ</Link>
          </div>
        </nav>
        {searchOpen && (
          <div className="search-panel" id="search-panel">
            <div className="search-panel__inner">
              <label className="visually-hidden" htmlFor="search-input">
                Search colours, sets and journal
              </label>
              <input
                type="search"
                id="search-input"
                className="search-input"
                placeholder="Search colours, sets, journal…"
                autoComplete="off"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="search-results">
                {q && !hasResults && <p className="search-empty">No matches for &quot;{query}&quot;.</p>}
                {matchColours.length > 0 && (
                  <div className="search-results__group">
                    <h4>Colours</h4>
                    <ul>
                      {matchColours.map((p) => (
                        <li key={p.id}>
                          <Link href={productUrl("single-pan", p.id)} onClick={() => setSearchOpen(false)}>
                            <span>{p.name}</span>
                            <span className="ci mono">{p.ci}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {matchSets.length > 0 && (
                  <div className="search-results__group">
                    <h4>Sets</h4>
                    <ul>
                      {matchSets.map((p) => (
                        <li key={p.id}>
                          <Link href={productUrl(p.id)} onClick={() => setSearchOpen(false)}>
                            <span>{p.name}</span>
                            <span>{money(p.price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {matchPosts.length > 0 && (
                  <div className="search-results__group">
                    <h4>Journal</h4>
                    <ul>
                      {matchPosts.map((j) => (
                        <li key={j.url}>
                          <Link href={j.url} onClick={() => setSearchOpen(false)}>
                            <span>{j.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
