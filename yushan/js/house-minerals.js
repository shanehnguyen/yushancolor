(async function () {
  const [pigments, catalog] = await Promise.all([
    fetch("data/pigments.json").then((r) => r.json()),
    fetch("data/products.json").then((r) => r.json()),
  ]);
  Cart.init(catalog.products);

  function buildBuyBlock(mountId, pigment) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const wrap = document.createElement("div");
    wrap.className = "mineral-buy";

    const swWrap = document.createElement("div");
    swWrap.className = "mineral-buy__swatch";
    const sw = renderSwatch(pigment);
    sw.style.width = "100%"; sw.style.height = "100%"; sw.style.position = "absolute"; sw.style.inset = "0";
    swWrap.style.position = "relative";
    swWrap.appendChild(sw);

    const specs = document.createElement("dl");
    specs.className = "mineral-buy__specs";
    specs.innerHTML = `
      <div class="row"><dt>Colour Index</dt><dd class="mono">${pigment.ci}</dd></div>
      <div class="row"><dt>Lightfastness</dt><dd class="mono">Blue Wool ${pigment.blueWool} of 8</dd></div>
      <div class="row"><dt>Granulation</dt><dd>${pigment.granulation}</dd></div>
      <div class="row"><dt>Transparency</dt><dd>${pigment.transparency}</dd></div>`;

    const buyCol = document.createElement("div");
    buyCol.className = "mineral-buy__col";
    buyCol.innerHTML = `<div class="mineral-buy__price">$11.00</div>`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary";
    btn.textContent = "Add to cart";
    btn.addEventListener("click", () => {
      Cart.add({ productId: "single-pan", variantId: pigment.id, name: `${pigment.name}, Single Pan`, unitPrice: 11, variantLabel: pigment.ci, qty: 1 });
    });
    buyCol.appendChild(btn);

    wrap.append(swWrap, specs, buyCol);
    mount.appendChild(wrap);
  }

  const beitou = pigments.find((p) => p.id === "beitou-sulphur");
  const slate = pigments.find((p) => p.id === "yushan-slate");
  buildBuyBlock("beitou-buy", beitou);
  buildBuyBlock("slate-buy", slate);

  function buildHeroSwatch(mountId, pigment) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const sw = renderSwatch(pigment);
    sw.style.width = "100%"; sw.style.height = "100%"; sw.style.position = "absolute"; sw.style.inset = "0";
    mount.appendChild(sw);
  }
  buildHeroSwatch("beitou-hero-swatch", beitou);
  buildHeroSwatch("slate-hero-swatch", slate);

  const jsonld = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "name": "House minerals",
    "itemListElement": [beitou, slate].map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "name": `${p.name}, Single Pan`,
        "description": p.note,
        "sku": `YSH-SGL-${p.id}`,
        "brand": { "@type": "Brand", "name": "Yushan Colour Co." },
        "offers": { "@type": "Offer", "priceCurrency": "USD", "price": 11, "availability": "https://schema.org/InStock" }
      }
    }))
  };
  document.getElementById("minerals-jsonld").textContent = JSON.stringify(jsonld);
})();
