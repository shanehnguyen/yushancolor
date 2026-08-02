(async function () {
  const params = new URLSearchParams(location.search);

  const [pigments, catalog] = await Promise.all([
    fetch("data/pigments.json").then((r) => r.json()),
    fetch("data/products.json").then((r) => r.json()),
  ]);

  const pigmentsById = Object.fromEntries(pigments.map((p) => [p.id, p]));
  const products = catalog.products;
  const productId = params.get("id") || document.body.dataset.productId || document.body.dataset.defaultProduct || "the-eighteen";
  const product = products.find((p) => p.id === productId) || products.find((p) => p.isFlagship);

  const isVariantProduct = product.variantOf === "pigments";
  let variantId = isVariantProduct ? (params.get("variant") || document.body.dataset.variantId || "ultramarine-blue") : null;

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

  // A studio lifestyle photo, reused sitewide (never a stand-in for the product itself,
  // only for scale/context) — keeps to the "only three photographs sitewide" rule.
  const LIFESTYLE_PHOTO = {
    url: "assets/images/workshop-mixing.jpg",
    alt: "Close-up of a painter mixing colour on a palette in the workshop, for scale",
  };
  function lifestyleSlide() {
    const img = document.createElement("img");
    img.src = LIFESTYLE_PHOTO.url;
    img.alt = LIFESTYLE_PHOTO.alt;
    img.loading = "lazy";
    return img;
  }
  function swatchStripSlide(ids) {
    const strip = document.createElement("div");
    strip.className = "swatch-strip";
    ids.forEach((id) => {
      const p = pigmentsById[id];
      if (!p) return;
      const cell = renderSwatch(p, { label: true });
      strip.appendChild(cell);
    });
    return strip;
  }
  function paperSpecSlide() {
    const ps = product.paperSpec;
    const card = document.createElement("div");
    card.className = "spec-slide";
    card.innerHTML = `<strong>${ps.gsm}, ${ps.cotton} cotton</strong><span>${ps.surface}, ${ps.deckle}</span><span>${ps.sheets}, ${ps.sheetSize}</span>`;
    return card;
  }

  function renderGallery() {
    const main = document.getElementById("gallery-main");
    const thumbs = document.getElementById("gallery-thumbs");
    main.className = "gallery__main";

    let slides;
    if (isVariantProduct) {
      const pig = currentPigment();
      slides = [
        { alt: `${pig.name} at masstone`, build: () => gallerySwatch(pig, "masstone") },
        { alt: `${pig.name} diluted`, build: () => gallerySwatch(pig, "dilution") },
        { alt: `${pig.name} wet-in-wet, showing granulation`, build: () => gallerySwatch(pig, "wet") },
        { alt: LIFESTYLE_PHOTO.alt, build: lifestyleSlide },
      ];
    } else if (product.isPaper) {
      slides = [
        { alt: `${product.name} texture`, build: () => { const el = document.createElement("div"); el.className = "pattern-tile"; el.style.width = "100%"; el.style.height = "100%"; el.style.opacity = "0.7"; return el; } },
        { alt: `${product.name} specifications`, build: paperSpecSlide },
        { alt: LIFESTYLE_PHOTO.alt, build: lifestyleSlide },
      ];
    } else {
      const ids = product.includesPigments || [];
      slides = [
        { alt: `${product.name}, pans in the tin`, build: () => { const tin = document.createElement("div"); renderTinGrid(tin, ids, pigmentsById); return tin; } },
        { alt: `${product.name}, every colour swatched on paper`, build: () => swatchStripSlide(ids) },
        { alt: LIFESTYLE_PHOTO.alt, build: lifestyleSlide },
      ];
    }

    function setMain(i) {
      main.innerHTML = "";
      main.appendChild(slides[i].build());
      [...thumbs.children].forEach((el, idx) => el.setAttribute("aria-current", String(idx === i)));
    }
    thumbs.innerHTML = slides.map((s, i) => `<button type="button" class="gallery__thumb" aria-current="${i === 0}" aria-label="${s.alt}"></button>`).join("");
    [...thumbs.children].forEach((btn, i) => {
      btn.appendChild(slides[i].build());
      btn.addEventListener("click", () => setMain(i));
    });
    setMain(0);
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
        <dl class="spec-table" style="max-width:420px;">
          <div class="spec-table__row"><dt>Colour</dt><dd>${p.name}${p.house ? " (house mineral)" : ""}</dd></div>
          <div class="spec-table__row"><dt>Colour Index</dt><dd class="mono">${p.ci}</dd></div>
          <div class="spec-table__row"><dt>Lightfastness</dt><dd>${blueWoolText(p.blueWool)}</dd></div>
          <div class="spec-table__row"><dt>Transparency</dt><dd>${p.transparency}</dd></div>
          <div class="spec-table__row"><dt>Granulation</dt><dd>${p.granulation}</dd></div>
          <div class="spec-table__row"><dt>Staining</dt><dd>${p.staining}</dd></div>
          <div class="spec-table__row"><dt>Note</dt><dd>${p.note}</dd></div>
        </dl>
        <a class="btn btn-outline" href="${productUrl("single-pan", p.id)}">Shop ${p.name}, $11</a>`;
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

  // ---------- Related — exactly one relevant cross-sell, never a generic grid ----------
  function pickRelated() {
    if (isVariantProduct) {
      const pig = currentPigment();
      const homeSet = products.find((p) =>
        (p.id === "landscape-six" || p.id === "botanical-eight") &&
        p.includesPigments && p.includesPigments.includes(pig.id)
      );
      return homeSet || products.find((p) => p.id === "dot-card");
    }
    if (product.id === "dot-card") return products.find((p) => p.id === "the-eighteen");
    if (product.id === "puli-block") return products.find((p) => p.id === "dot-card");
    return products.find((p) => p.id === "dot-card");
  }

  function renderRelated() {
    const section = document.getElementById("related-section");
    const heading = document.getElementById("related-heading");
    const grid = document.getElementById("related-grid");
    const p = pickRelated();
    if (!p || p.id === product.id) { if (section) section.style.display = "none"; return; }
    if (section) section.style.display = "";

    if (isVariantProduct) {
      heading.textContent = `${p.name} includes this colour`;
    } else if (product.id === "dot-card") {
      heading.textContent = "Ready to commit to a set?";
    } else {
      heading.textContent = "Still deciding?";
    }

    grid.innerHTML = "";
    const a = document.createElement("a");
    a.className = "product-card related-card";
    a.href = `${productUrl(p.id)}`;
    const imgWrap = document.createElement("div");
    imgWrap.className = "product-card__img";
    if (p.includesPigments && p.includesPigments.length) {
      const tin = document.createElement("div");
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
      <div class="product-card__desc">${p.shortDescription || ""}</div>
      <div class="product-card__price">${money(p.price)}</div>`);
    grid.appendChild(a);
  }

  // ---------- Breadcrumb / title / ATC ----------
  function renderHeadAndATC() {
    document.getElementById("pdp-title").textContent = isVariantProduct
      ? `${pigmentsById[variantId].name}, Single Pan` : product.name;
    document.getElementById("pdp-breadcrumb-name").textContent = product.name;
    document.getElementById("pdp-rung").textContent = product.rung;
    document.title = `${document.getElementById("pdp-title").textContent} | Yushan Colour Co.`;

    document.getElementById("pdp-atc").textContent = `Add to cart, ${money(product.price)}`;
    document.getElementById("pdp-atc-sticky").textContent = "Add to cart";
    const stickyName = document.getElementById("sticky-atc-name");
    const stickyPrice = document.getElementById("sticky-atc-price");
    if (stickyName) stickyName.textContent = document.getElementById("pdp-title").textContent;
    if (stickyPrice) stickyPrice.textContent = money(product.price);
  }

  // ---------- Batch scarcity — a real computed batch number and next-mill date,
  // not a static "handmade in batches" line. Batches mill every 14 days. ----------
  function renderBatchInfo() {
    const el = document.getElementById("pdp-batch-info");
    if (!el) return;
    if (product.isPaper) { el.style.display = "none"; return; }
    el.style.display = "";
    const spec = catalog.sharedPanSpec;
    const MS_PER_BATCH = 14 * 24 * 60 * 60 * 1000;
    const EPOCH = new Date("2019-03-04T00:00:00Z").getTime();
    const now = Date.now();
    const batchNumber = Math.floor((now - EPOCH) / MS_PER_BATCH) + 1;
    const batchStart = EPOCH + (batchNumber - 1) * MS_PER_BATCH;
    const nextBatch = new Date(batchStart + MS_PER_BATCH);
    const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
    el.innerHTML = `
      <span class="batch-info__num">Batch No. ${batchNumber}</span>
      <span class="batch-info__detail">${spec.batchSize} pans per batch &middot; next batch mills ${dateFmt.format(nextBatch)}</span>`;
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
    renderBatchInfo();
  }

  renderAll();
  renderShip();
  renderDotCardCrossSell();
  renderLightfastGrid("lightfast-grid", pigmentsById);
  renderRelated();

  // ---------- Sticky mobile ATC — appears only once the main Add-to-cart button
  // has scrolled out of view, so it doesn't double up with the primary CTA. ----------
  (function wireStickyATC() {
    const bar = document.getElementById("sticky-atc-bar");
    const anchor = document.getElementById("pdp-atc");
    if (!bar || !anchor || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => { bar.dataset.visible = String(!entry.isIntersecting && entry.boundingClientRect.top < 0); },
      { threshold: 0 }
    );
    io.observe(anchor);
  })();

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
