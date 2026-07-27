(async function () {
  const params = new URLSearchParams(location.search);

  const [pigments, catalog] = await Promise.all([
    fetch("data/pigments.json").then((r) => r.json()),
    fetch("data/products.json").then((r) => r.json()),
  ]);

  const pigmentsById = Object.fromEntries(pigments.map((p) => [p.id, p]));
  const products = catalog.products;
  const productId = params.get("id") || document.body.dataset.defaultProduct || "the-eighteen";
  const product = products.find((p) => p.id === productId) || products.find((p) => p.isFlagship);

  const isVariantProduct = product.variantOf === "pigments";
  let variantId = isVariantProduct ? (params.get("variant") || "ultramarine-blue") : null;

  function money(n) { return `$${n.toFixed(2)}`; }

  function currentPigment() {
    return isVariantProduct ? pigmentsById[variantId] : null;
  }

  // ---------- Gallery — generated swatches only, never stock photography ----------
  function gallerySwatch(pig, mode) {
    const sw = document.createElement("div");
    sw.className = "swatch";
    paintSwatchEl(sw, pig);
    if (mode === "dilution") {
      sw.style.setProperty("--wash-hex", adjustHex(pig.hex, -0.55));
      sw.style.setProperty("--wash-dark", adjustHex(pig.hex, -0.3));
      sw.style.setProperty("--wash-darker", adjustHex(pig.hex, -0.1));
      sw.style.setProperty("--grain-opacity", String(Number(sw.style.getPropertyValue("--grain-opacity") || 0.1) * 0.4));
    } else if (mode === "wet") {
      const current = parseFloat(sw.style.getPropertyValue("--grain-opacity")) || 0.1;
      sw.style.setProperty("--grain-opacity", String(Math.min(0.75, current * 1.6 + 0.08)));
    }
    sw.style.width = "100%";
    sw.style.height = "100%";
    return sw;
  }

  function renderGallery() {
    const main = document.getElementById("gallery-main");
    const thumbs = document.getElementById("gallery-thumbs");

    if (isVariantProduct) {
      const pig = currentPigment();
      const slides = [
        { mode: "masstone", alt: `${pig.name} at masstone` },
        { mode: "dilution", alt: `${pig.name} diluted` },
        { mode: "wet", alt: `${pig.name} wet-in-wet, showing granulation` },
      ];
      function setMain(i) {
        main.innerHTML = "";
        main.appendChild(gallerySwatch(pig, slides[i].mode));
        [...thumbs.children].forEach((el, idx) => el.setAttribute("aria-current", String(idx === i)));
      }
      thumbs.innerHTML = slides.map((s, i) => `<button type="button" class="gallery__thumb" aria-current="${i === 0}" aria-label="${s.alt}"></button>`).join("");
      [...thumbs.children].forEach((btn, i) => {
        btn.appendChild(gallerySwatch(pig, slides[i].mode));
        btn.addEventListener("click", () => setMain(i));
      });
      setMain(0);
      return;
    }

    // Multi-pan sets: a grid of the set's own swatches, arranged as pans in a tin.
    const ids = product.includesPigments || [];
    main.innerHTML = "";
    if (ids.length) {
      const tin = document.createElement("div");
      main.appendChild(tin);
      renderTinGrid(tin, ids, pigmentsById);
    } else {
      // No pigments to show (e.g. paper): a plain woven texture, never an empty gallery.
      main.classList.add("pattern-tile");
      main.style.opacity = "0.7";
    }
    thumbs.innerHTML = "";
  }

  // ---------- Descriptor ----------
  function renderDescriptor() {
    const pig = currentPigment();
    document.getElementById("pdp-descriptor").textContent = pig ? pig.note : product.shortDescription;
  }

  // ---------- Price ----------
  function renderPrice() {
    const el = document.getElementById("pdp-price-row");
    let unitNote = "";
    if (product.id === "the-eighteen") unitNote = `<span class="unit-note">${money(product.price / 18)} per pan</span>`;
    else if (product.id === "botanical-eight") unitNote = `<span class="unit-note">${money(product.price / 8)} per pan</span>`;
    else if (product.id === "landscape-six") unitNote = `<span class="unit-note">${money(product.price / 6)} per pan</span>`;
    else if (product.id === "puli-block") unitNote = `<span class="unit-note">${money(product.price / 20)} per sheet</span>`;
    el.innerHTML = `<span>${money(product.price)}</span>${unitNote}`;
  }

  // ---------- Variant picker ----------
  function renderVariantPicker() {
    const el = document.getElementById("pdp-variant-picker");
    if (!isVariantProduct) { el.innerHTML = ""; return; }
    el.innerHTML = `
      <div class="variant-picker">
        <span class="variant-picker__label">Colour: <strong>${pigmentsById[variantId].name}</strong>, ${pigmentsById[variantId].ci}</span>
        <div class="variant-picker__grid" id="variant-grid"></div>
      </div>`;
    const grid = document.getElementById("variant-grid");
    pigments.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "variant-swatch";
      btn.setAttribute("aria-pressed", String(p.id === variantId));
      btn.setAttribute("aria-label", p.name);
      btn.title = p.name;
      const sw = document.createElement("div");
      sw.className = "swatch";
      paintSwatchEl(sw, p);
      sw.style.position = "absolute";
      sw.style.inset = "0";
      btn.appendChild(sw);
      btn.addEventListener("click", () => {
        variantId = p.id;
        const url = new URL(location);
        url.searchParams.set("variant", variantId);
        history.replaceState(null, "", url);
        renderAll();
      });
      grid.appendChild(btn);
    });
  }

  // ---------- Benefits ----------
  function renderBenefits() {
    document.getElementById("pdp-benefits").innerHTML =
      (product.benefits || []).map((b) => `<li>${b}</li>`).join("");
  }

  // ---------- Spec table ----------
  function renderSpec() {
    const spec = catalog.sharedPanSpec;
    const rows = [];
    const pig = currentPigment();

    if (pig) {
      rows.push(["Colour Index", `<span class="mono">${pig.ci}</span>`]);
      rows.push(["Lightfastness", blueWoolText(pig.blueWool)]);
      rows.push(["Transparency", pig.transparency]);
      rows.push(["Granulation", pig.granulation]);
      rows.push(["Staining", pig.staining]);
    }

    if (product.isPaper) {
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
    } else {
      rows.push(["Format", product.id === "single-pan" ? spec.format : product.format]);
      rows.push(["Binder", spec.binder]);
      rows.push(["Fillers", spec.fillers]);
      if (!pig) rows.push(["Lightfastness range", spec.lightfastnessRange]);
      rows.push(["Certification", spec.certification]);
      rows.push(["Made in", spec.madeIn]);
      rows.push(["Batch size", `${spec.batchSize} pans`]);
    }

    document.getElementById("pdp-spec").innerHTML = rows.map(([k, v]) =>
      `<div class="spec-table__row"><dt>${k}</dt><dd>${v}</dd></div>`
    ).join("");
  }

  // ---------- Ship box ----------
  function renderShip() {
    const s = catalog.shipping;
    document.getElementById("ship-origin").textContent = s.origin;
    document.getElementById("ship-transit").textContent = s.transit;
    document.getElementById("ship-cost").textContent = s.cost;
    document.getElementById("ship-duty").textContent = s.duty;
    document.getElementById("ship-returns").textContent = s.returns;
  }

  // ---------- Dot Card cross-sell ----------
  function renderDotCardCrossSell() {
    const el = document.getElementById("dot-card-crosssell");
    if (product.id === "dot-card") { el.hidden = true; return; }
    el.hidden = false;
    const imgWrap = document.getElementById("dot-card-crosssell-img");
    imgWrap.innerHTML = "";
    const sw = document.createElement("div");
    sw.className = "swatch";
    paintSwatchEl(sw, pigments[0]);
    sw.style.position = "absolute"; sw.style.inset = "0";
    imgWrap.appendChild(sw);
    document.getElementById("dot-card-crosssell-add").addEventListener("click", () => {
      Cart.add({ productId: "dot-card", variantId: null, name: "The Dot Card", unitPrice: 14, variantLabel: "Painted card, no reusable paint", qty: 1 });
    }, { once: true });
  }

  // ---------- Set chart ----------
  function renderSetChart() {
    const section = document.getElementById("set-chart-section");
    if (isVariantProduct || product.isPaper) { section.style.display = "none"; return; }

    if (!product.includesPigments || !product.includesPigments.length) {
      section.style.display = "none";
      return;
    }

    section.style.display = "";
    const grid = document.getElementById("set-chart-grid");
    grid.innerHTML = "";
    const readout = document.getElementById("set-chart-readout");
    function showPigment(p) {
      readout.innerHTML = `
        <div class="spec-table" style="max-width:420px;">
          <div class="spec-table__row"><dt>Colour</dt><dd>${p.name}${p.house ? " (house mineral)" : ""}</dd></div>
          <div class="spec-table__row"><dt>Colour Index</dt><dd class="mono">${p.ci}</dd></div>
          <div class="spec-table__row"><dt>Lightfastness</dt><dd>${blueWoolText(p.blueWool)}</dd></div>
          <div class="spec-table__row"><dt>Transparency</dt><dd>${p.transparency}</dd></div>
          <div class="spec-table__row"><dt>Granulation</dt><dd>${p.granulation}</dd></div>
          <div class="spec-table__row"><dt>Staining</dt><dd>${p.staining}</dd></div>
          <div class="spec-table__row"><dt>Note</dt><dd>${p.note}</dd></div>
        </div>
        <a class="btn btn-outline" href="product.html?id=single-pan&variant=${p.id}">Shop ${p.name}, $11</a>`;
    }
    product.includesPigments.forEach((id) => {
      const p = pigmentsById[id];
      const item = renderSwatch(p, { label: true });
      item.querySelector(".swatch").style.cursor = "pointer";
      item.querySelector(".swatch").addEventListener("click", () => showPigment(p));
      grid.appendChild(item);
    });
    showPigment(pigmentsById[product.includesPigments[0]]);
  }

  // ---------- Related — generated swatches, never repeated stock photography ----------
  function renderRelated() {
    const others = products.filter((p) => p.id !== product.id && p.id !== "single-pan").slice(0, 4);
    const grid = document.getElementById("related-grid");
    grid.innerHTML = "";
    others.forEach((p) => {
      const a = document.createElement("a");
      a.className = "product-card";
      a.href = `product.html?id=${p.id}`;
      const imgWrap = document.createElement("div");
      imgWrap.className = "product-card__img";
      if (p.includesPigments && p.includesPigments.length) {
        const tin = document.createElement("div");
        tin.className = "tin-grid--small";
        imgWrap.appendChild(tin);
        renderTinGrid(tin, p.includesPigments, pigmentsById, 8);
      } else {
        imgWrap.classList.add("pattern-tile");
        imgWrap.style.opacity = "0.7";
      }
      a.appendChild(imgWrap);
      a.insertAdjacentHTML("beforeend", `
        <div class="product-card__rung">${p.rung}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__price">${money(p.price)}</div>`);
      grid.appendChild(a);
    });
  }

  // ---------- Breadcrumb / title / ATC ----------
  function renderHeadAndATC() {
    document.getElementById("pdp-title").textContent = isVariantProduct
      ? `${pigmentsById[variantId].name}, Single Pan` : product.name;
    document.getElementById("pdp-breadcrumb-name").textContent = product.name;
    document.getElementById("pdp-rung").textContent = product.rung;
    document.title = `${document.getElementById("pdp-title").textContent} — Yushan Colour Co.`;

    const label = `Add to cart, ${money(product.price)}`;
    document.getElementById("pdp-atc").textContent = label;
    document.getElementById("pdp-atc-sticky").textContent = label;
  }

  // ---------- JSON-LD ----------
  function renderJSONLD() {
    const name = isVariantProduct ? `${pigmentsById[variantId].name}, Single Pan` : product.name;
    const data = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": name,
      "description": product.shortDescription,
      "sku": product.sku,
      "brand": { "@type": "Brand", "name": "Yushan Colour Co." },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": product.price,
        "availability": "https://schema.org/InStock"
      }
    };
    let script = document.getElementById("product-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "product-jsonld";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  function renderAll() {
    renderGallery();
    renderHeadAndATC();
    renderDescriptor();
    renderPrice();
    renderVariantPicker();
    renderBenefits();
    renderSpec();
    renderSetChart();
    renderJSONLD();
  }

  renderAll();
  renderShip();
  renderDotCardCrossSell();
  renderLightfastGrid("lightfast-grid", pigmentsById);
  renderRelated();

  // ---------- Cart wiring ----------
  Cart.init(products);

  function currentLineItem() {
    const qty = Math.max(1, parseInt(document.getElementById("qty-value").value, 10) || 1);
    if (isVariantProduct) {
      const p = pigmentsById[variantId];
      return { productId: product.id, variantId, name: `${p.name}, Single Pan`, unitPrice: product.price, variantLabel: p.ci, qty };
    }
    return { productId: product.id, variantId: null, name: product.name, unitPrice: product.price, variantLabel: product.format, qty };
  }

  document.getElementById("pdp-atc").addEventListener("click", () => Cart.add(currentLineItem()));
  document.getElementById("pdp-atc-sticky").addEventListener("click", () => Cart.add(currentLineItem()));

  document.getElementById("qty-up").addEventListener("click", () => {
    const el = document.getElementById("qty-value");
    el.value = Math.max(1, (parseInt(el.value, 10) || 1) + 1);
  });
  document.getElementById("qty-down").addEventListener("click", () => {
    const el = document.getElementById("qty-value");
    el.value = Math.max(1, (parseInt(el.value, 10) || 1) - 1);
  });
})();
