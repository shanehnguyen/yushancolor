(async function () {
  const [pigments, catalog] = await Promise.all([
    fetch("data/pigments.json").then((r) => r.json()),
    fetch("data/products.json").then((r) => r.json()),
  ]);
  const products = catalog.products;

  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return { h, s, l };
  }

  function hueFamily(hex) {
    const { h, s } = hexToHsl(hex);
    if (s < 0.12) return "Neutral";
    if (h < 12 || h >= 340) return "Red";
    if (h < 45) return "Earth";
    if (h < 70) return "Yellow";
    if (h < 170) return "Green";
    if (h < 255) return "Blue";
    if (h < 310) return "Violet";
    return "Pink";
  }

  pigments.forEach((p) => { p.hueFamily = hueFamily(p.hex); });

  const HUES = [...new Set(pigments.map((p) => p.hueFamily))].sort();
  const GRANULATIONS = ["None", "Light", "Medium", "Heavy", "Very heavy"];
  const TRANSPARENCIES = [...new Set(pigments.map((p) => p.transparency))];
  const BLUEWOOLS = [6, 7, 8];

  function buildFilterGroup(containerId, name, values) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = values.map((v) => `
      <label class="filter-option">
        <input type="checkbox" name="${name}" value="${v}">
        <span>${v}</span>
      </label>`).join("");
  }
  buildFilterGroup("filter-hue", "hue", HUES);
  buildFilterGroup("filter-granulation", "granulation", GRANULATIONS);
  buildFilterGroup("filter-transparency", "transparency", TRANSPARENCIES);
  buildFilterGroup("filter-bluewool", "bluewool", BLUEWOOLS);

  function money(n) { return `$${n.toFixed(2)}`; }

  function descriptorFor(p) {
    if (p.granulation === "None" && p.staining === "High") return "Staining, no granulation";
    const gran = p.granulation === "None" ? "No granulation" : `${p.granulation} granulation`;
    return `${gran}, ${p.transparency.toLowerCase()}`;
  }

  const scope = document.body.dataset.scope || "all";
  const initialTab = scope !== "all" ? scope
    : (new URLSearchParams(location.search).get("tab") === "sets" ? "sets" : "colours");
  let activeTab = initialTab;
  if (initialTab === "sets") {
    document.querySelectorAll(".collection-tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === "sets")));
  }

  function getChecked(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);
  }

  function pigmentCard(p) {
    const sw = renderSwatch(p);
    const wrap = document.createElement("div");
    wrap.className = "product-card collection-card";
    wrap.innerHTML = `
      <a class="collection-card__link" href="product.html?id=single-pan&variant=${p.id}">
        <div class="collection-card__img collection-card__img--swatch">
          <span class="collection-card__tag">${p.granulation}</span>
          <div class="layer main"></div>
          <div class="layer alt">Swatched on cold-press paper</div>
        </div>
        <div class="product-card__rung">${p.ci}${p.house ? ' <span class="house-tag">· House mineral</span>' : ""}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__desc">${descriptorFor(p)}</div>
        <div class="product-card__price">$11.00</div>
      </a>
      <button type="button" class="btn btn-outline btn-block" data-quick-add="single-pan" data-variant="${p.id}">Add to cart</button>`;
    wrap.querySelector(".layer.main").appendChild(sw);
    sw.style.width = "100%";
    return wrap;
  }

  function setCard(p) {
    const wrap = document.createElement("div");
    wrap.className = "product-card collection-card";
    wrap.innerHTML = `
      <a class="collection-card__link" href="product.html?id=${p.id}">
        <div class="collection-card__img"><div class="tin-grid"></div></div>
        <div class="product-card__rung">${p.rung}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__desc">${p.shortDescription || ""}</div>
        <div class="product-card__price">${money(p.price)}</div>
      </a>
      <button type="button" class="btn btn-outline btn-block" data-quick-add="${p.id}">Add to cart</button>`;
    const pigmentsById = Object.fromEntries(pigments.map((pp) => [pp.id, pp]));
    renderTinGrid(wrap.querySelector(".tin-grid"), p.includesPigments || [], pigmentsById);
    return wrap;
  }

  const HUE_SORT_ORDER = ["Blue", "Green", "Yellow", "Earth", "Red", "Pink", "Violet", "Neutral"];
  function applySort(list, key, getPrice, getBW, getName) {
    const arr = [...list];
    if (key === "price-asc") arr.sort((a, b) => getPrice(a) - getPrice(b));
    if (key === "price-desc") arr.sort((a, b) => getPrice(b) - getPrice(a));
    if (key === "bw-desc") arr.sort((a, b) => getBW(b) - getBW(a));
    if (key === "name-asc") arr.sort((a, b) => getName(a).localeCompare(getName(b)));
    if (key === "hue-asc") {
      arr.sort((a, b) => {
        const d = HUE_SORT_ORDER.indexOf(a.hueFamily) - HUE_SORT_ORDER.indexOf(b.hueFamily);
        return d !== 0 ? d : getName(a).localeCompare(getName(b));
      });
    }
    return arr;
  }

  function renderChips() {
    const chips = document.getElementById("active-chips");
    if (!chips) return;
    const checked = [...document.querySelectorAll("#filter-panel input[type=checkbox]:checked")];
    chips.innerHTML = checked.map((c) =>
      `<span class="chip">${c.value}<button type="button" data-uncheck="${c.name}::${c.value}" aria-label="Remove ${c.value} filter">×</button></span>`
    ).join("");
  }

  function render() {
    const grid = document.getElementById("collection-grid");
    const sortEl = document.getElementById("sort-select");
    const sort = sortEl ? sortEl.value : "featured";
    const filterBand = document.getElementById("filter-band");
    if (filterBand) filterBand.style.display = (activeTab === "colours" && scope !== "sets") ? "" : "none";

    if (activeTab === "colours") {
      renderChips();
      const hues = getChecked("hue");
      const grans = getChecked("granulation");
      const trans = getChecked("transparency");
      const bws = getChecked("bluewool").map(Number);

      let list = pigments.filter((p) =>
        (!hues.length || hues.includes(p.hueFamily)) &&
        (!grans.length || grans.includes(p.granulation)) &&
        (!trans.length || trans.includes(p.transparency)) &&
        (!bws.length || bws.includes(p.blueWool))
      );
      list = applySort(list, sort, () => 11, (p) => p.blueWool, (p) => p.name);

      const resultEl1 = document.getElementById("result-count");
      if (resultEl1) resultEl1.textContent = `${list.length} colour${list.length === 1 ? "" : "s"}`;
      grid.innerHTML = "";
      if (!list.length) {
        grid.innerHTML = `<p class="no-results">No colours match those filters. <button type="button" class="btn-link" onclick="document.getElementById('clear-filters').click()">Clear filters</button></p>`;
      } else {
        list.forEach((p) => grid.appendChild(pigmentCard(p)));
      }
    } else {
      let list = products.filter((p) => p.id !== "single-pan" && (scope !== "sets" || !p.isPaper));
      list = applySort(list, sort, (p) => p.price, () => 0, (p) => p.name);
      const resultEl2 = document.getElementById("result-count");
      if (resultEl2) resultEl2.textContent = `${list.length} sets and kits`;
      grid.innerHTML = "";
      list.forEach((p) => grid.appendChild(setCard(p)));
    }
  }

  document.querySelectorAll(".collection-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".collection-tabs button").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      activeTab = btn.dataset.tab;
      render();
    });
  });
  const filterPanel = document.getElementById("filter-panel");
  const filterToggle = document.getElementById("filter-toggle");
  const sortEl = document.getElementById("sort-select");
  const clearBtn = document.getElementById("clear-filters");
  const chipsEl = document.getElementById("active-chips");

  if (filterPanel) filterPanel.addEventListener("change", render);
  if (sortEl) sortEl.addEventListener("change", render);
  if (clearBtn) clearBtn.addEventListener("click", () => {
    document.querySelectorAll("#filter-panel input[type=checkbox]").forEach((c) => { c.checked = false; });
    render();
  });
  if (filterToggle && filterPanel) {
    filterToggle.addEventListener("click", () => {
      const open = filterPanel.hidden;
      filterPanel.hidden = !open;
      filterToggle.setAttribute("aria-expanded", String(open));
    });
  }
  if (chipsEl) {
    chipsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-uncheck]");
      if (!btn) return;
      const [name, value] = btn.dataset.uncheck.split("::");
      const input = document.querySelector(`#filter-panel input[name="${name}"][value="${value}"]`);
      if (input) input.checked = false;
      render();
    });
  }

  document.getElementById("collection-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quick-add]");
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.quickAdd;
    if (id === "single-pan") {
      const p = pigments.find((pig) => pig.id === btn.dataset.variant);
      Cart.add({ productId: "single-pan", variantId: p.id, name: `${p.name}, Single Pan`, unitPrice: 11, variantLabel: p.ci, qty: 1 });
    } else {
      const p = products.find((pr) => pr.id === id);
      Cart.add({ productId: p.id, variantId: null, name: p.name, unitPrice: p.price, variantLabel: p.format, qty: 1 });
    }
  });

  Cart.init(products);
  render();
})();
