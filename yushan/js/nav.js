(function () {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  const close = document.getElementById("nav-close");

  function isMobile() { return window.matchMedia("(max-width: 900px)").matches; }
  function reducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  // ---------- Mobile hamburger ----------
  if (nav && toggle) {
    function openMenu() { nav.dataset.open = "true"; toggle.setAttribute("aria-expanded", "true"); }
    function shutMenu() {
      nav.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      document.querySelectorAll(".nav-panel[data-mobile-open='true']").forEach((p) => { p.dataset.mobileOpen = "false"; });
      document.querySelectorAll(".nav-item__caret[aria-expanded='true']").forEach((c) => c.setAttribute("aria-expanded", "false"));
    }
    toggle.addEventListener("click", () => { nav.dataset.open === "true" ? shutMenu() : openMenu(); });
    if (close) close.addEventListener("click", shutMenu);
    nav.querySelectorAll(":scope > a, .nav-item__link").forEach((a) => a.addEventListener("click", shutMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.dataset.open === "true") { shutMenu(); toggle.focus(); }
    });
  }

  // ---------- Shoppable dropdowns ----------
  const navItems = document.querySelectorAll(".nav-item[data-menu]");
  if (!navItems.length) return;

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
    return { h, s };
  }
  function navHueGroup(hex) {
    const { h, s } = hexToHsl(hex);
    if (s < 0.12) return "Neutrals";
    if (h < 45 || h >= 340) {
      // reds live with earths only when desaturated warm-brown; otherwise reds+violets group
      if (h >= 340 || h < 12) return "Reds & violets";
      return "Yellows & earths";
    }
    if (h < 70) return "Yellows & earths";
    if (h < 170) return "Greens";
    if (h < 255) return "Blues";
    return "Reds & violets";
  }
  const GROUP_ORDER = ["Blues", "Greens", "Yellows & earths", "Reds & violets", "Neutrals"];

  Promise.all([
    fetch("data/pigments.json").then((r) => r.json()),
    fetch("data/products.json").then((r) => r.json()),
  ]).then(([pigments, catalog]) => {
    const products = catalog.products;
    buildSinglePansPanel(pigments);
    buildSetsPanel(products, pigments);
    buildHouseMineralsPanel(pigments);
    wireSearch(pigments, products);
  });

  function buildSinglePansPanel(pigments) {
    const el = document.getElementById("panel-single-pans");
    if (!el) return;
    const groups = {};
    GROUP_ORDER.forEach((g) => { groups[g] = []; });
    pigments.forEach((p) => { (groups[navHueGroup(p.hex)] || groups.Neutrals).push(p); });
    const inner = document.createElement("div");
    inner.className = "nav-panel__inner";
    const grid = document.createElement("div");
    grid.className = "nav-hue-groups";
    GROUP_ORDER.forEach((g) => {
      if (!groups[g].length) return;
      const col = document.createElement("div");
      col.className = "nav-hue-group";
      col.innerHTML = `<h4>${g}</h4>`;
      const ul = document.createElement("ul");
      groups[g].forEach((p) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "nav-swatch-link";
        a.href = `${productUrl("single-pan", p.id)}`;
        const sw = renderSwatch(p);
        a.appendChild(sw);
        a.insertAdjacentHTML("beforeend", `<span>${p.name}</span><span class="ci mono">${p.ci}</span>`);
        li.appendChild(a);
        ul.appendChild(li);
      });
      col.appendChild(ul);
      grid.appendChild(col);
    });
    inner.appendChild(grid);
    el.appendChild(inner);
  }

  function buildSetsPanel(products, pigments) {
    const el = document.getElementById("panel-sets");
    if (!el) return;
    const sets = products.filter((p) => p.id !== "single-pan" && !p.isPaper);
    const pigmentsById = Object.fromEntries(pigments.map((p) => [p.id, p]));
    const inner = document.createElement("div");
    inner.className = "nav-panel__inner";
    const grid = document.createElement("div");
    grid.className = "nav-set-grid";
    sets.forEach((p) => {
      const a = document.createElement("a");
      a.className = "nav-set-card";
      a.href = `${productUrl(p.id)}`;
      const imgWrap = document.createElement("div");
      imgWrap.className = "nav-set-card__img";
      a.appendChild(imgWrap);
      a.insertAdjacentHTML("beforeend", `<strong>${p.name}</strong><span>$${p.price.toFixed(2)}</span>`);
      grid.appendChild(a);
      const tin = document.createElement("div");
      imgWrap.appendChild(tin);
      renderTinGrid(tin, p.includesPigments || [], pigmentsById, 8);
    });
    inner.appendChild(grid);
    el.appendChild(inner);
  }

  function buildHouseMineralsPanel(pigments) {
    const el = document.getElementById("panel-house-minerals");
    if (!el) return;
    const minerals = pigments.filter((p) => p.house);
    const inner = document.createElement("div");
    inner.className = "nav-panel__inner";
    const grid = document.createElement("div");
    grid.className = "nav-mineral-grid";
    minerals.forEach((p) => {
      const a = document.createElement("a");
      a.className = "nav-mineral-card";
      a.href = `${productUrl("single-pan", p.id)}`;
      const sw = renderSwatch(p);
      a.appendChild(sw);
      a.insertAdjacentHTML("beforeend", `<span><strong>${p.name}</strong><p>${p.note}</p></span>`);
      grid.appendChild(a);
    });
    inner.appendChild(grid);
    el.appendChild(inner);
  }

  // ---------- Desktop hover/focus open + keyboard ----------
  const OPEN_DELAY = 180, CLOSE_DELAY = 120;
  let openTimer = null, closeTimer = null, activeItem = null;

  function panelFor(item) { return document.getElementById(`panel-${item.dataset.menu}`); }
  function triggerFor(item) { return item.querySelector(".nav-item__link"); }
  function caretFor(item) { return item.querySelector(".nav-item__caret"); }

  function openPanel(item) {
    if (isMobile()) return;
    clearTimeout(closeTimer);
    if (activeItem && activeItem !== item) closePanel(activeItem, true);
    activeItem = item;
    const panel = panelFor(item);
    if (!panel) return;
    panel.dataset.active = "true";
    triggerFor(item).setAttribute("aria-expanded", "true");
    const caret = caretFor(item); if (caret) caret.setAttribute("aria-expanded", "true");
  }
  function closePanel(item, immediate) {
    const panel = panelFor(item);
    if (panel) panel.dataset.active = "false";
    triggerFor(item).setAttribute("aria-expanded", "false");
    const caret = caretFor(item); if (caret) caret.setAttribute("aria-expanded", "false");
    if (activeItem === item) activeItem = null;
  }

  navItems.forEach((item) => {
    const link = triggerFor(item);
    const caret = caretFor(item);
    const panel = panelFor(item);

    item.addEventListener("mouseenter", () => {
      if (isMobile()) return;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(() => openPanel(item), reducedMotion() ? 0 : OPEN_DELAY);
    });
    item.addEventListener("mouseleave", () => {
      if (isMobile()) return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => closePanel(item), reducedMotion() ? 0 : CLOSE_DELAY);
    });
    link.addEventListener("focus", () => { if (!isMobile()) openPanel(item); });
    link.addEventListener("keydown", (e) => {
      if (isMobile()) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openPanel(item);
        const first = panel && panel.querySelector("a, button");
        if (first) first.focus();
      }
    });
    if (panel) {
      panel.addEventListener("keydown", (e) => handlePanelKeydown(e, item, panel));
    }

    // Mobile caret accordion
    if (caret) {
      caret.addEventListener("click", () => {
        const open = panel.dataset.mobileOpen === "true";
        document.querySelectorAll(".nav-panel").forEach((p) => { p.dataset.mobileOpen = "false"; });
        document.querySelectorAll(".nav-item__caret").forEach((c) => c.setAttribute("aria-expanded", "false"));
        if (!open) { panel.dataset.mobileOpen = "true"; caret.setAttribute("aria-expanded", "true"); }
      });
    }
  });

  function handlePanelKeydown(e, item, panel) {
    const focusable = [...panel.querySelectorAll("a, button")];
    const idx = focusable.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel(item, true);
      triggerFor(item).focus();
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      if (idx > -1 && focusable[idx + 1]) focusable[idx + 1].focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      if (idx > 0) focusable[idx - 1].focus();
      else triggerFor(item).focus();
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeItem) { closePanel(activeItem, true); }
  });
  document.addEventListener("click", (e) => {
    if (activeItem && !activeItem.contains(e.target)) closePanel(activeItem, true);
  });

  // ---------- Search overlay ----------
  function wireSearch(pigments, products) {
    const toggleBtn = document.getElementById("search-toggle");
    const panel = document.getElementById("search-panel");
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");
    if (!toggleBtn || !panel || !input) return;

    const JOURNAL = [
      { title: "How we read a Blue Wool test", url: "journal-blue-wool.html" },
      { title: "Why Beitou Sulphur has no synthetic equivalent", url: "journal-beitou-sulphur.html" },
    ];

    function openSearch() {
      panel.hidden = false;
      toggleBtn.setAttribute("aria-expanded", "true");
      input.focus();
    }
    function shutSearch() {
      panel.hidden = true;
      toggleBtn.setAttribute("aria-expanded", "false");
    }
    toggleBtn.addEventListener("click", () => { panel.hidden ? openSearch() : shutSearch(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) { shutSearch(); toggleBtn.focus(); }
    });
    document.addEventListener("click", (e) => {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) shutSearch();
    });

    function render(query) {
      const q = query.trim().toLowerCase();
      if (!q) { results.innerHTML = ""; return; }
      const colours = pigments.filter((p) => p.name.toLowerCase().includes(q) || p.ci.toLowerCase().includes(q)).slice(0, 8);
      const sets = products.filter((p) => p.id !== "single-pan" && p.name.toLowerCase().includes(q)).slice(0, 6);
      const posts = JOURNAL.filter((j) => j.title.toLowerCase().includes(q));

      if (!colours.length && !sets.length && !posts.length) {
        results.innerHTML = `<p class="search-empty">No matches for "${query}".</p>`;
        return;
      }
      function group(label, items, renderItem) {
        if (!items.length) return "";
        return `<div class="search-results__group"><h4>${label}</h4><ul>${items.map(renderItem).join("")}</ul></div>`;
      }
      results.innerHTML =
        group("Colours", colours, (p) => `<li><a href="${productUrl("single-pan", p.id)}"><span>${p.name}</span><span class="ci mono">${p.ci}</span></a></li>`) +
        group("Sets", sets, (p) => `<li><a href="${productUrl(p.id)}"><span>${p.name}</span><span>$${p.price.toFixed(2)}</span></a></li>`) +
        group("Journal", posts, (j) => `<li><a href="${j.url}"><span>${j.title}</span></a></li>`);
    }
    input.addEventListener("input", () => render(input.value));
  }
})();
