const GRANULATION_OPACITY = {
  "None": 0.02,
  "Light": 0.12,
  "Medium": 0.22,
  "Heavy": 0.40,
  "Very heavy": 0.58,
};

/* Fix 2 (v1.2, corrected v1.3) — swatches are a loaded brush dragged across
   paper, not a perforated stamp. Low x-frequency / higher y-frequency
   displacement keeps the left/right edges relatively clean and the top/bottom
   gently wavy; pigment pools only at the bottom edge, under gravity, not as
   an even rim on all four sides. Every pigment gets its own ragged-edge
   filter with a unique displacement seed, generated once on first use and
   cached so the same colour looks identical wherever it repeats on the site. */

let defsEl = null;
function ensureDefsRoot() {
  if (defsEl) return defsEl;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.setAttribute("aria-hidden", "true");
  defsEl = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defsEl);
  document.body.appendChild(svg);
  return defsEl;
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* Plain-text lightfastness reading, replacing the old segmented blue bar
   meter — mono is reserved for CI codes and this value, sitewide. */
function blueWoolText(n) {
  return `<span class="mono">Blue Wool ${n} of 8</span>`;
}

function adjustHex(hex, amount) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const mix = (c) => (amount >= 0 ? c * (1 - amount) : c + (255 - c) * -amount);
  const r = clamp(mix((n >> 16) & 255));
  const g = clamp(mix((n >> 8) & 255));
  const b = clamp(mix(n & 255));
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

const filtersBuilt = new Set();
function ensureFiltersFor(pigment) {
  if (filtersBuilt.has(pigment.id)) return;
  filtersBuilt.add(pigment.id);
  const defs = ensureDefsRoot();
  const raggedSeed = (hashStr(pigment.id + ":ragged") % 900) + 1;
  const grainSeed = (hashStr(pigment.id + ":grain") % 900) + 1;
  defs.insertAdjacentHTML("beforeend", `
    <filter id="ragged-${pigment.id}" x="-8%" y="-14%" width="116%" height="128%">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="3" seed="${raggedSeed}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="grain-${pigment.id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="3" seed="${grainSeed}" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 -0.1"/>
    </filter>`);
}

/**
 * Paints an existing element (with class "swatch") as a rectangular wash:
 * true hex base, pigment pooling at the bottom edge only, grain on top.
 */
function paintSwatchEl(el, pigment) {
  ensureFiltersFor(pigment);
  const opacity = GRANULATION_OPACITY[pigment.granulation] ?? GRANULATION_OPACITY["None"];
  const dark = adjustHex(pigment.hex, 0.22);
  const darker = adjustHex(pigment.hex, 0.4);
  el.style.setProperty("--wash-hex", pigment.hex);
  el.style.setProperty("--wash-dark", dark);
  el.style.setProperty("--wash-darker", darker);
  el.style.setProperty("--grain-opacity", String(opacity));
  el.style.filter = `saturate(0.86) url(#ragged-${pigment.id})`;
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", `${pigment.name}, ${pigment.ci}, Blue Wool ${pigment.blueWool}`);
  el.innerHTML = `
    <span class="swatch__base"></span>
    <span class="swatch__pool"></span>
    <span class="swatch__grain" style="filter:url(#grain-${pigment.id})"></span>`;
}

/** Legacy string form, still used where CSS custom properties alone are read. */
function paintStyle(pigment) {
  const opacity = GRANULATION_OPACITY[pigment.granulation] ?? GRANULATION_OPACITY["None"];
  const dark = adjustHex(pigment.hex, 0.22);
  const darker = adjustHex(pigment.hex, 0.4);
  return `--wash-hex:${pigment.hex};--wash-dark:${dark};--wash-darker:${darker};--grain-opacity:${opacity};`;
}

function renderSwatch(pigment, { label = false, size = null } = {}) {
  const sw = document.createElement("div");
  sw.className = "swatch";
  paintSwatchEl(sw, pigment);
  if (size) { sw.style.width = size; sw.style.height = size; }

  if (label) {
    const wrap = document.createElement("div");
    wrap.className = "set-chart__item";
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = pigment.name;
    wrap.append(sw, name);
    return wrap;
  }
  return sw;
}

/* Shared tin grid — a set's own swatches arranged as pans in a tin, used
   anywhere a multi-pan product needs an image and must never be a stock photo. */
function renderTinGrid(container, pigmentIds, pigmentsById, max) {
  if (!container) return;
  container.innerHTML = "";
  container.classList.add("tin-grid");
  const ids = max ? pigmentIds.slice(0, max) : pigmentIds;
  container.style.gridTemplateColumns = `repeat(${ids.length <= 6 ? 3 : ids.length <= 8 ? 4 : 6}, 1fr)`;
  ids.forEach((id) => {
    const p = pigmentsById[id];
    if (!p) return;
    const cell = document.createElement("span");
    cell.className = "tin-grid__pan";
    const sw = renderSwatch(p);
    sw.style.width = "100%"; sw.style.height = "100%"; sw.style.position = "absolute"; sw.style.inset = "0";
    cell.style.position = "relative";
    cell.appendChild(sw);
    container.appendChild(cell);
  });
}

/* Shared lightfast proof grid — a real per-pigment swatch, right half faded by
   its actual Blue Wool rating. Used on every PDP and on the homepage, so the
   claim "Blue Wool 6 shows movement, Blue Wool 8 does not" is demonstrated
   with the same real data everywhere rather than duplicated per page. */
const LIGHTFAST_IDS = ["ultramarine-blue", "burnt-sienna", "beitou-sulphur", "yushan-slate", "quinacridone-rose", "hansa-yellow-light"];
function renderLightfastGrid(containerId, pigmentsById) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = "";
  LIGHTFAST_IDS.forEach((id) => {
    const p = pigmentsById[id];
    if (!p) return;
    const card = document.createElement("div");
    card.className = "lightfast-card";
    const imgWrap = document.createElement("div");
    imgWrap.className = "lightfast-card__img";
    const sw = document.createElement("div");
    sw.className = "swatch";
    paintSwatchEl(sw, p);
    sw.style.position = "absolute"; sw.style.inset = "0";
    imgWrap.appendChild(sw);
    const fade = document.createElement("div");
    fade.className = "lightfast-card__fade";
    fade.style.opacity = String((8 - p.blueWool) * 0.12);
    imgWrap.appendChild(fade);
    const divider = document.createElement("div");
    divider.className = "lightfast-card__divider";
    imgWrap.appendChild(divider);
    card.appendChild(imgWrap);
    card.insertAdjacentHTML("beforeend", `<div class="lightfast-card__label"><span>${p.name}</span><span class="mono">Blue Wool ${p.blueWool} of 8</span></div>`);
    grid.appendChild(card);
  });
}
