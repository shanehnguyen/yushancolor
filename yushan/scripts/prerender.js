#!/usr/bin/env node
/*
 * Build-time prerender step.
 *
 * This site has no server and no client framework — every page is static
 * HTML plus vanilla JS that fetches data/*.json and builds the DOM on load.
 * That means crawlers and slow/no-JS clients see an empty shell until
 * hydration finishes. This script bakes the crawl-critical content (title,
 * price, breadcrumb, descriptor, benefits, spec table, related pick, and
 * the collection grid) directly into the HTML at build time, so it's
 * present on first paint. The client JS still runs after and re-renders
 * the same data on top — harmless, since the computations here mirror
 * js/pdp.js and js/collection.js exactly.
 *
 * Runs via `npm run build` (see package.json), wired as the Vercel build
 * command for this project.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const pigments = JSON.parse(fs.readFileSync(path.join(ROOT, "data/pigments.json"), "utf8"));
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "data/products.json"), "utf8"));
const products = catalog.products;
const pigmentsById = Object.fromEntries(pigments.map((p) => [p.id, p]));

function money(n) { return `$${n.toFixed(2)}`; }
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- Replace the inner content of a uniquely-id'd element in a raw HTML string ----------
function setInner(html, id, inner) {
  const idIdx = html.indexOf(`id="${id}"`);
  if (idIdx === -1) throw new Error(`prerender: id not found in template: ${id}`);
  const tagStart = html.lastIndexOf("<", idIdx);
  const tagName = html.slice(tagStart + 1).match(/^[a-zA-Z0-9]+/)[0];
  const openTagEnd = html.indexOf(">", idIdx) + 1;
  const closeStr = `</${tagName}>`;
  let depth = 1, i = openTagEnd;
  while (depth > 0) {
    const nextOpen = html.indexOf(`<${tagName}`, i);
    const nextClose = html.indexOf(closeStr, i);
    if (nextClose === -1) throw new Error(`prerender: no closing tag for <${tagName}> #${id}`);
    if (nextOpen !== -1 && nextOpen < nextClose) { depth++; i = nextOpen + tagName.length + 1; }
    else {
      depth--;
      if (depth === 0) return html.slice(0, openTagEnd) + inner + html.slice(nextClose);
      i = nextClose + closeStr.length;
    }
  }
}

// ---------- Swatch / tin-grid HTML, mirroring js/swatch.js exactly (no DOM available here) ----------
const GRANULATION_OPACITY = { "None": 0.02, "Light": 0.12, "Medium": 0.22, "Heavy": 0.40, "Very heavy": 0.58 };
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function adjustHex(hex, amount) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const mix = (c) => (amount >= 0 ? c * (1 - amount) : c + (255 - c) * -amount);
  const r = clamp(mix((n >> 16) & 255)), g = clamp(mix((n >> 8) & 255)), b = clamp(mix(n & 255));
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
function blueWoolText(n) { return `<span class="mono">Blue Wool ${n} of 8</span>`; }
function swatchDefsSVG(pigment) {
  const raggedSeed = (hashStr(pigment.id + ":ragged") % 900) + 1;
  const grainSeed = (hashStr(pigment.id + ":grain") % 900) + 1;
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <filter id="ragged-${pigment.id}" x="-8%" y="-14%" width="116%" height="128%">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="3" seed="${raggedSeed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="grain-${pigment.id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="3" seed="${grainSeed}" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 -0.1"/>
    </filter></defs></svg>`;
}
// Mirrors js/swatch.js's ensureFiltersFor() cache — a pigment's filter <defs> must be
// emitted at most once per page, since the id is keyed only on pigment.id and the same
// pigment's swatch can appear more than once on one page (lightfast grid, cross-sell,
// related tin grid). Reset via resetSwatchDefsCache() at the start of each page render.
let emittedSwatchDefs = new Set();
function resetSwatchDefsCache() {
  emittedSwatchDefs = new Set();
}
function swatchDivHTML(pigment) {
  const opacity = GRANULATION_OPACITY[pigment.granulation] ?? GRANULATION_OPACITY.None;
  const dark = adjustHex(pigment.hex, 0.22), darker = adjustHex(pigment.hex, 0.4);
  const style = `--wash-hex:${pigment.hex};--wash-dark:${dark};--wash-darker:${darker};--grain-opacity:${opacity};filter:saturate(0.86) url(#ragged-${pigment.id});width:100%;height:100%;position:absolute;inset:0;`;
  let defs = "";
  if (!emittedSwatchDefs.has(pigment.id)) {
    emittedSwatchDefs.add(pigment.id);
    defs = swatchDefsSVG(pigment);
  }
  return `${defs}<div class="swatch" role="img" aria-label="${escapeHTML(pigment.name)}, ${pigment.ci}, Blue Wool ${pigment.blueWool}" style="${style}">
    <span class="swatch__base"></span><span class="swatch__pool"></span>
    <span class="swatch__grain" style="filter:url(#grain-${pigment.id})"></span></div>`;
}
function tinGridHTML(ids, max) {
  const list = max ? ids.slice(0, max) : ids;
  const cols = list.length <= 6 ? 3 : list.length <= 8 ? 4 : 6;
  const cells = list.map((id) => {
    const p = pigmentsById[id];
    if (!p) return "";
    return `<span class="tin-grid__pan" style="position:relative;">${swatchDivHTML(p)}</span>`;
  }).join("");
  return `<div class="tin-grid" style="grid-template-columns:repeat(${cols},1fr);">${cells}</div>`;
}

// ---------- Related pick, mirroring js/pdp.js pickRelated() ----------
function pickRelated(product, pigment) {
  if (pigment) {
    const homeSet = products.find((p) =>
      (p.id === "landscape-six" || p.id === "botanical-eight") &&
      p.includesPigments && p.includesPigments.includes(pigment.id));
    return homeSet || products.find((p) => p.id === "dot-card");
  }
  if (product.id === "dot-card") return products.find((p) => p.id === "the-eighteen");
  return products.find((p) => p.id === "dot-card");
}
function relatedHTML(product, pigment) {
  const rel = pickRelated(product, pigment);
  const heading = pigment
    ? `${escapeHTML(rel.name)} includes this colour`
    : product.id === "dot-card" ? "Ready to commit to a set?" : "Still deciding?";
  const img = rel.includesPigments && rel.includesPigments.length
    ? `<div class="product-card__img">${tinGridHTML(rel.includesPigments, 8)}</div>`
    : `<div class="product-card__img pattern-tile" style="opacity:0.7;"></div>`;
  const card = `<a class="product-card related-card" href="${productUrl(rel.id)}">${img}
    <div class="product-card__rung">${escapeHTML(rel.rung)}</div>
    <div class="product-card__name">${escapeHTML(rel.name)}</div>
    <div class="product-card__desc">${escapeHTML(rel.shortDescription || "")}</div>
    <div class="product-card__price">${money(rel.price)}</div></a>`;
  return { heading, card };
}

// ---------- Lightfast grid, static across every page ----------
const LIGHTFAST_IDS = ["ultramarine-blue", "burnt-sienna", "beitou-sulphur", "yushan-slate", "quinacridone-rose", "hansa-yellow-light"];
function lightfastGridHTML() {
  return LIGHTFAST_IDS.map((id) => {
    const p = pigmentsById[id];
    const fade = (8 - p.blueWool) * 0.12;
    return `<div class="lightfast-card">
      <div class="lightfast-card__img">${swatchDivHTML(p)}<div class="lightfast-card__fade" style="opacity:${fade};"></div><div class="lightfast-card__divider"></div></div>
      <div class="lightfast-card__label"><span>${escapeHTML(p.name)}</span><span class="mono">Blue Wool ${p.blueWool} of 8</span></div></div>`;
  }).join("");
}

// ---------- Canonical URL for a product / single-pan variant ----------
function productUrl(productId, variantId) {
  if (productId === "single-pan" && variantId) return `product-single-pan-${variantId}.html`;
  return `product-${productId}.html`;
}

// ---------- Spec rows, mirroring js/pdp.js renderSpec() ----------
function specRows(product, pigment) {
  const spec = catalog.sharedPanSpec;
  const rows = [];
  if (pigment) {
    rows.push(["Colour Index", `<span class="mono">${pigment.ci}</span>`]);
    rows.push(["Lightfastness", blueWoolText(pigment.blueWool)]);
    rows.push(["Transparency", pigment.transparency]);
    rows.push(["Granulation", pigment.granulation]);
    rows.push(["Staining", pigment.staining]);
  }
  if (product.isPaper) {
    const ps = product.paperSpec;
    rows.push(["Weight", ps.gsm], ["Cotton content", ps.cotton], ["Sizing", ps.sizing], ["Surface", ps.surface],
      ["Edges", ps.deckle], ["Sheet count", ps.sheets], ["Sheet size", ps.sheetSize], ["Origin", "Puli, Nantou"]);
  } else if (product.isTrial) {
    rows.push(["Format", product.format], ["Colours included", "18"], ["Certification", spec.certification], ["Made in", spec.madeIn]);
  } else {
    rows.push(["Format", product.id === "single-pan" ? spec.format : product.format], ["Binder", spec.binder], ["Fillers", spec.fillers]);
    if (!pigment) rows.push(["Lightfastness range", spec.lightfastnessRange]);
    rows.push(["Certification", spec.certification], ["Made in", spec.madeIn], ["Batch size", `${spec.batchSize} pans`]);
  }
  return rows.map(([k, v]) => `<div class="spec-table__row"><dt>${k}</dt><dd>${v}</dd></div>`).join("");
}

function priceRowHTML(product) {
  let unitNote = "";
  if (product.id === "the-eighteen") unitNote = `<span class="unit-note">${money(product.price / 18)} per pan</span>`;
  else if (product.id === "botanical-eight") unitNote = `<span class="unit-note">${money(product.price / 8)} per pan</span>`;
  else if (product.id === "landscape-six") unitNote = `<span class="unit-note">${money(product.price / 6)} per pan</span>`;
  else if (product.id === "puli-block") unitNote = `<span class="unit-note">${money(product.price / 20)} per sheet</span>`;
  return `<span>${money(product.price)}</span>${unitNote}`;
}

function benefitsHTML(product) {
  return (product.benefits || []).map((b) => `<li>${escapeHTML(b)}</li>`).join("");
}

function jsonLD(product, pigment) {
  const name = pigment ? `${pigment.name}, Single Pan` : product.name;
  return JSON.stringify({
    "@context": "https://schema.org/", "@type": "Product", "name": name,
    "description": product.shortDescription, "sku": product.sku,
    "brand": { "@type": "Brand", "name": "Yushan Colour Co." },
    "offers": { "@type": "Offer", "priceCurrency": "USD", "price": product.price, "availability": "https://schema.org/InStock" }
  });
}

// ---------- Render one product page from the shared product.html shell ----------
function renderProductPage(shell, product, pigment) {
  resetSwatchDefsCache();
  let html = shell;
  const title = pigment ? `${pigment.name}, Single Pan` : product.name;
  const desc = pigment ? pigment.note : product.shortDescription;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHTML(title)} | Yushan Colour Co.</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHTML(desc)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHTML(title)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHTML(desc)}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://yushancolour.com/${productUrl(product.id, pigment ? pigment.id : null)}">`);
  html = html.replace("</head>", `<script type="application/ld+json">${jsonLD(product, pigment)}</script>\n</head>`);
  html = html.replace("<body>", `<body data-product-id="${product.id}"${pigment ? ` data-variant-id="${pigment.id}"` : ""}>`);

  html = setInner(html, "pdp-breadcrumb-name", escapeHTML(product.name));
  html = setInner(html, "pdp-rung", escapeHTML(product.rung));
  html = setInner(html, "pdp-title", escapeHTML(title));
  html = setInner(html, "pdp-descriptor", escapeHTML(desc));
  html = setInner(html, "pdp-price-row", priceRowHTML(product));
  html = setInner(html, "pdp-benefits", benefitsHTML(product));
  html = setInner(html, "pdp-spec", specRows(product, pigment));
  html = setInner(html, "ship-origin", escapeHTML(catalog.shipping.origin));
  html = setInner(html, "ship-transit", escapeHTML(catalog.shipping.transit));
  html = setInner(html, "ship-cost", escapeHTML(catalog.shipping.cost));
  html = setInner(html, "ship-duty", escapeHTML(catalog.shipping.duty));
  html = setInner(html, "ship-returns", escapeHTML(catalog.shipping.returns));
  html = setInner(html, "pdp-atc", `Add to cart, ${money(product.price)}`);
  html = setInner(html, "pdp-atc-sticky", "Add to cart");
  html = setInner(html, "sticky-atc-name", escapeHTML(title));
  html = setInner(html, "sticky-atc-price", money(product.price));
  html = setInner(html, "lightfast-grid", lightfastGridHTML());

  const { heading, card } = relatedHTML(product, pigment);
  html = setInner(html, "related-heading", heading);
  html = setInner(html, "related-grid", card);

  if (product.id !== "dot-card") {
    html = setInner(html, "dot-card-crosssell-img", swatchDivHTML(pigments[0]));
    html = html.replace('class="cross-sell" id="dot-card-crosssell" hidden', 'class="cross-sell" id="dot-card-crosssell"');
  }

  return html;
}

// ---------- Collection grid, mirroring js/collection.js pigmentCard()/setCard() default state ----------
function descriptorFor(p) {
  if (p.granulation === "None" && p.staining === "High") return "Staining, no granulation";
  const gran = p.granulation === "None" ? "No granulation" : `${p.granulation} granulation`;
  return `${gran}, ${p.transparency.toLowerCase()}`;
}
function pigmentCardHTML(p) {
  return `<div class="product-card collection-card">
    <a class="collection-card__link" href="${productUrl("single-pan", p.id)}">
      <div class="collection-card__img collection-card__img--swatch">
        <span class="collection-card__tag">${p.granulation}</span>
        <div class="layer main">${swatchDivHTML(p)}</div>
        <div class="layer alt">Swatched on cold-press paper</div>
      </div>
      <div class="product-card__rung">${p.ci}${p.house ? ' <span class="house-tag">&middot; House mineral</span>' : ""}</div>
      <div class="product-card__name">${escapeHTML(p.name)}</div>
      <div class="product-card__desc">${descriptorFor(p)}</div>
      <div class="product-card__price">$11.00</div>
    </a>
    <button type="button" class="btn btn-outline btn-block" data-quick-add="single-pan" data-variant="${p.id}">Add to cart</button>
  </div>`;
}
function buildFilterGroupHTML(values, name) {
  return values.map((v) => `<label class="filter-option"><input type="checkbox" name="${name}" value="${v}"><span>${v}</span></label>`).join("");
}
function renderCollectionPage(shell) {
  resetSwatchDefsCache();
  let html = shell;
  const grid = pigments.map(pigmentCardHTML).join("");
  html = setInner(html, "collection-grid", grid);
  html = setInner(html, "result-count", `${pigments.length} colours`);
  const hues = [...new Set(pigments.map((p) => {
    // mirrors js/collection.js hueFamily()
    const n = parseInt(p.hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    }
    if (s < 0.12) return "Neutral";
    if (h < 12 || h >= 340) return "Red";
    if (h < 45) return "Earth";
    if (h < 70) return "Yellow";
    if (h < 170) return "Green";
    if (h < 255) return "Blue";
    if (h < 310) return "Violet";
    return "Pink";
  }))].sort();
  html = setInner(html, "filter-hue", buildFilterGroupHTML(hues, "hue"));
  html = setInner(html, "filter-granulation", buildFilterGroupHTML(["None", "Light", "Medium", "Heavy", "Very heavy"], "granulation"));
  html = setInner(html, "filter-transparency", buildFilterGroupHTML([...new Set(pigments.map((p) => p.transparency))], "transparency"));
  html = setInner(html, "filter-bluewool", buildFilterGroupHTML([6, 7, 8], "bluewool"));
  return html;
}

// ---------- Run ----------
function main() {
  const productShellPath = path.join(ROOT, "product.html");
  const productShell = fs.readFileSync(productShellPath, "utf8");

  const sets = products.filter((p) => p.id !== "single-pan");
  for (const p of sets) {
    const out = renderProductPage(productShell, p, null);
    fs.writeFileSync(path.join(ROOT, `product-${p.id}.html`), out);
    console.log(`prerendered product-${p.id}.html`);
  }
  const singlePan = products.find((p) => p.id === "single-pan");
  for (const pig of pigments) {
    const out = renderProductPage(productShell, singlePan, pig);
    fs.writeFileSync(path.join(ROOT, `product-single-pan-${pig.id}.html`), out);
    console.log(`prerendered product-single-pan-${pig.id}.html`);
  }

  const collectionPath = path.join(ROOT, "collection.html");
  const collectionShell = fs.readFileSync(collectionPath, "utf8");
  fs.writeFileSync(collectionPath, renderCollectionPage(collectionShell));
  console.log("prerendered collection.html");

  writeSitemap();
  console.log("wrote sitemap.xml");
}

// ---------- Sitemap — every static page, generated so it never drifts from what's actually built ----------
function writeSitemap() {
  const STATIC_PAGES = [
    ["index.html", "1.0"], ["collection.html", "0.9"], ["chart.html", "0.9"],
    ["single-pans.html", "0.7"], ["sets.html", "0.7"], ["paper.html", "0.6"],
    ["journal.html", "0.5"], ["journal-blue-wool.html", "0.4"], ["journal-beitou-sulphur.html", "0.4"],
    ["faq.html", "0.6"], ["shipping.html", "0.6"], ["stockists.html", "0.4"], ["wholesale.html", "0.4"],
    ["privacy.html", "0.2"], ["terms.html", "0.2"],
  ];
  const urls = STATIC_PAGES.map(([page, pr]) => `  <url><loc>https://yushancolour.com/${page}</loc><priority>${pr}</priority></url>`);
  for (const p of products.filter((p) => p.id !== "single-pan")) {
    urls.push(`  <url><loc>https://yushancolour.com/${productUrl(p.id)}</loc><priority>0.8</priority></url>`);
  }
  for (const pig of pigments) {
    urls.push(`  <url><loc>https://yushancolour.com/${productUrl("single-pan", pig.id)}</loc><priority>0.6</priority></url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
}

main();
