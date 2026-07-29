(async function () {
  const [pigments, catalog] = await Promise.all([
    fetch("data/pigments.json").then((r) => r.json()),
    fetch("data/products.json").then((r) => r.json()),
  ]);
  const products = catalog.products;
  const grid = document.getElementById("chart-grid");
  const readout = document.getElementById("chart-readout");

  function select(p, btn) {
    grid.querySelectorAll(".chart-swatch-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    readout.innerHTML = `
      <div class="chart-readout__swatch"></div>
      <div class="chart-readout__body">
        <div class="eyebrow">${p.house ? "House mineral" : "Colour Index"}</div>
        <h3 style="margin-bottom:var(--sp-3);">${p.name}</h3>
        <dl class="spec-table">
          <div class="spec-table__row"><dt>CI code</dt><dd class="mono">${p.ci}</dd></div>
          <div class="spec-table__row"><dt>Lightfastness</dt><dd>${blueWoolText(p.blueWool)}</dd></div>
          <div class="spec-table__row"><dt>Transparency</dt><dd>${p.transparency}</dd></div>
          <div class="spec-table__row"><dt>Granulation</dt><dd>${p.granulation}</dd></div>
          <div class="spec-table__row"><dt>Staining</dt><dd>${p.staining}</dd></div>
        </dl>
        <p style="font-size:13px;color:var(--ink-2);margin:var(--sp-4) 0;">${p.note}</p>
        <a class="btn btn-primary" href="${productUrl("single-pan", p.id)}">Shop ${p.name}, $11</a>
      </div>`;
    const sw = document.createElement("div");
    sw.className = "swatch";
    paintSwatchEl(sw, p);
    sw.style.width = "100%";
    sw.style.height = "100%";
    readout.querySelector(".chart-readout__swatch").appendChild(sw);
  }

  let defaultBtn = null;
  pigments.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chart-swatch-btn";
    btn.role = "option";
    btn.setAttribute("aria-pressed", "false");
    btn.dataset.index = i;
    const sw = renderSwatch(p);
    btn.appendChild(sw);
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = p.name;
    const ci = document.createElement("span");
    ci.className = "ci";
    ci.textContent = p.ci;
    btn.append(name, ci);
    btn.addEventListener("click", () => select(p, btn));
    btn.addEventListener("focus", () => select(p, btn));
    grid.appendChild(btn);
    if (p.id === "ultramarine-blue") defaultBtn = { p, btn };
  });

  const initial = defaultBtn || { p: pigments[0], btn: grid.querySelector(".chart-swatch-btn") };
  select(initial.p, initial.btn);

  grid.addEventListener("keydown", (e) => {
    const buttons = [...grid.querySelectorAll(".chart-swatch-btn")];
    const current = document.activeElement;
    const idx = buttons.indexOf(current);
    if (idx === -1) return;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    let next = null;
    if (e.key === "ArrowRight") next = buttons[idx + 1];
    if (e.key === "ArrowLeft") next = buttons[idx - 1];
    if (e.key === "ArrowDown") next = buttons[idx + cols];
    if (e.key === "ArrowUp") next = buttons[idx - cols];
    if (next) { e.preventDefault(); next.focus(); }
  });

  document.getElementById("data-table-body").innerHTML = pigments.map((p) => `
    <tr>
      <td>${p.name}${p.house ? " (house mineral)" : ""}</td>
      <td class="mono">${p.ci}</td>
      <td class="mono">${p.blueWool}/8</td>
      <td>${p.transparency}</td>
      <td>${p.granulation}</td>
      <td>${p.staining}</td>
    </tr>`).join("");

  document.getElementById("print-chart").addEventListener("click", () => window.print());

  Cart.init(products);
})();
