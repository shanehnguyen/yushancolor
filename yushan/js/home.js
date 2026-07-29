(async function () {
  const [pigments, catalog] = await Promise.all([
    fetch("data/pigments.json").then((r) => r.json()),
    fetch("data/products.json").then((r) => r.json()),
  ]);

  const preview = document.getElementById("chart-preview");
  pigments.forEach((p) => {
    const sw = renderSwatch(p);
    preview.appendChild(sw);
  });

  const pigmentsById = Object.fromEntries(pigments.map((p) => [p.id, p]));
  renderLightfastGrid("home-lightfast-grid", pigmentsById);

  const productsById = Object.fromEntries(catalog.products.map((p) => [p.id, p]));
  renderTinGrid(document.getElementById("moat-mini-tin"), productsById["landscape-six"].includesPigments, pigmentsById);
  renderTinGrid(document.getElementById("weak-mini-tin"), productsById["dot-card"].includesPigments, pigmentsById, 8);
  renderTinGrid(document.getElementById("ladder-tin-dotcard"), productsById["dot-card"].includesPigments, pigmentsById);
  renderTinGrid(document.getElementById("ladder-tin-landscape"), productsById["landscape-six"].includesPigments, pigmentsById);
  renderTinGrid(document.getElementById("ladder-tin-eighteen"), productsById["the-eighteen"].includesPigments, pigmentsById);

  const weakSwatchWrap = document.getElementById("weak-swatch");
  if (weakSwatchWrap) {
    const sw = renderSwatch(pigmentsById["hansa-yellow-light"]);
    sw.style.width = "100%"; sw.style.height = "100%"; sw.style.position = "absolute"; sw.style.inset = "0";
    weakSwatchWrap.style.position = "relative";
    weakSwatchWrap.appendChild(sw);
  }

  Cart.init(catalog.products);

  const FEATURED_IDS = ["ultramarine-blue", "beitou-sulphur", "hansa-yellow-light", "yushan-slate"];
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    FEATURED_IDS.forEach((id) => {
      const p = pigments.find((pig) => pig.id === id);
      const card = document.createElement("a");
      card.className = "product-card";
      card.href = `${productUrl("single-pan", p.id)}`;
      const sw = renderSwatch(p);
      sw.style.width = "100%";
      sw.style.marginBottom = "var(--sp-3)";
      card.appendChild(sw);
      card.insertAdjacentHTML("beforeend", `
        <div class="product-card__rung">${p.ci}${p.house ? " · House mineral" : ""}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__price">$11.00</div>`);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-outline btn-block";
      btn.textContent = "Add to cart";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        Cart.add({ productId: "single-pan", variantId: p.id, name: `${p.name}, Single Pan`, unitPrice: 11, variantLabel: p.ci, qty: 1 });
      });
      card.appendChild(btn);
      featuredGrid.appendChild(card);
    });
  }

  document.getElementById("email-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const note = document.getElementById("email-note");
    const email = document.getElementById("email-input").value;
    note.textContent = "Sending…";
    try {
      const result = await Web3Forms.submit({
        subject: "Yushan — pigment index request",
        from_name: "Yushan site — homepage signup",
        email,
      });
      note.textContent = result.success ? "You're on the list. Check your inbox to confirm." : "Something went wrong — try again, or email hello@yushancolour.com.";
      if (result.success) e.target.reset();
    } catch {
      note.textContent = "Something went wrong — try again, or email hello@yushancolour.com.";
    }
  });
})();
