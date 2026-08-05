const Cart = (() => {
  const FREE_SHIP_THRESHOLD = 80;
  const state = { items: [], products: [], open: false };

  function money(n) {
    return `$${n.toFixed(2)}`;
  }

  function findProduct(id) {
    return state.products.find((p) => p.id === id);
  }

  function subtotal() {
    return state.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  }

  function add(item) {
    const key = `${item.productId}:${item.variantId || ""}`;
    const existing = state.items.find((i) => i.key === key);
    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      state.items.push({ key, qty: 1, ...item });
    }
    state.open = true;
    render();
  }

  function remove(key) {
    state.items = state.items.filter((i) => i.key !== key);
    render();
  }

  function setQty(key, qty) {
    const item = state.items.find((i) => i.key === key);
    if (!item) return;
    if (qty < 1) { remove(key); return; }
    item.qty = qty;
    render();
  }

  function pickUpsell() {
    const hasTrial = state.items.some((i) => i.productId === "dot-card");
    const id = state.items.length === 0 || !hasTrial ? "dot-card" : "puli-block";
    return findProduct(id);
  }

  function renderFreeShipBar() {
    const sub = subtotal();
    const remaining = Math.max(0, FREE_SHIP_THRESHOLD - sub);
    const pct = Math.min(100, (sub / FREE_SHIP_THRESHOLD) * 100);
    const label = remaining > 0
      ? `Add ${money(remaining)} more for free shipping`
      : "Free shipping unlocked";
    return `
      <div class="free-ship-bar">
        <div class="free-ship-bar__label">${label}</div>
        <div class="free-ship-bar__track"><div class="free-ship-bar__fill" style="width:${pct}%"></div></div>
      </div>`;
  }

  function renderItems() {
    if (state.items.length === 0) {
      return `<div class="cart-empty">Your cart is empty. The Dot Card is $14 and the fastest way to see the range.</div>`;
    }
    return state.items.map((i) => `
      <div class="cart-line" data-key="${i.key}">
        <div class="cart-line__img" aria-hidden="true"></div>
        <div>
          <div class="cart-line__name">${i.name}</div>
          <div class="cart-line__meta">${i.variantLabel || ""}</div>
          <div class="qty-input" style="margin-top:6px;">
            <button type="button" data-qty-down aria-label="Decrease quantity">&minus;</button>
            <input type="text" inputmode="numeric" value="${i.qty}" data-qty-input aria-label="Quantity">
            <button type="button" data-qty-up aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="cart-line__remove" data-remove>Remove</button>
        </div>
        <div class="cart-line__price">${money(i.unitPrice * i.qty)}</div>
      </div>`).join("");
  }

  function renderUpsell() {
    const p = pickUpsell();
    if (!p || state.items.some((i) => i.productId === p.id)) return "";
    return `
      <div class="cart-upsell" data-upsell="${p.id}">
        <div class="cart-upsell__img" aria-hidden="true"></div>
        <div class="cart-upsell__body">
          <strong>${p.name}</strong>
          ${p.shortDescription}
        </div>
        <button type="button" class="btn btn-outline" style="padding:8px 14px;font-size:13px;" data-add-upsell="${p.id}">Add ${money(p.price)}</button>
      </div>`;
  }

  function render() {
    const scrim = document.getElementById("cart-scrim");
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;

    scrim.dataset.open = String(state.open);
    drawer.dataset.open = String(state.open);
    drawer.setAttribute("aria-hidden", String(!state.open));

    const totalQty = state.items.reduce((n, i) => n + i.qty, 0);
    document.querySelectorAll(".cart-count").forEach((el) => { el.textContent = totalQty; });
    document.getElementById("cart-free-ship").innerHTML = renderFreeShipBar();
    document.getElementById("cart-items").innerHTML = renderItems();
    document.getElementById("cart-upsell-slot").innerHTML = renderUpsell();
    document.getElementById("cart-subtotal").textContent = money(subtotal());
  }

  function bindUI() {
    document.getElementById("cart-scrim").addEventListener("click", close);
    document.getElementById("cart-drawer-close").addEventListener("click", close);
    document.querySelectorAll("[data-cart-open]").forEach((btn) => btn.addEventListener("click", openDrawer));

    document.getElementById("cart-items").addEventListener("click", (e) => {
      const line = e.target.closest(".cart-line");
      if (!line) return;
      const key = line.dataset.key;
      const item = state.items.find((i) => i.key === key);
      if (e.target.matches("[data-remove]")) remove(key);
      if (e.target.matches("[data-qty-up]")) setQty(key, item.qty + 1);
      if (e.target.matches("[data-qty-down]")) setQty(key, item.qty - 1);
    });
    document.getElementById("cart-items").addEventListener("change", (e) => {
      if (!e.target.matches("[data-qty-input]")) return;
      const line = e.target.closest(".cart-line");
      const n = parseInt(e.target.value, 10);
      setQty(line.dataset.key, Number.isFinite(n) ? n : 1);
    });

    document.getElementById("cart-upsell-slot").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add-upsell]");
      if (!btn) return;
      const p = findProduct(btn.dataset.addUpsell);
      add({ productId: p.id, variantId: null, name: p.name, unitPrice: p.price, variantLabel: p.format });
    });

    const checkoutBtn = document.getElementById("cart-checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", async () => {
        const note = document.getElementById("cart-checkout-note");
        if (state.items.length === 0) {
          note.textContent = "Your cart is empty.";
          return;
        }
        const emailInput = document.getElementById("cart-email");
        const email = emailInput.value.trim();
        if (!emailInput.checkValidity() || !email) {
          note.textContent = "Enter a valid email for your order confirmation.";
          emailInput.focus();
          return;
        }

        const order = "YSH-" + Math.floor(100000 + Math.random() * 900000);
        const count = state.items.reduce((n, i) => n + i.qty, 0);
        const lines = state.items.map((i) => `${i.qty}x ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""}: ${money(i.unitPrice * i.qty)}`).join("\n");

        checkoutBtn.disabled = true;
        note.textContent = "Confirming order…";
        let confirmed = false;
        try {
          const result = await Web3Forms.submit({
            subject: `Yushan: Order ${order}`,
            from_name: "Yushan checkout",
            email,
            order,
            message: `Order ${order}\n\n${lines}\n\nSubtotal: ${money(subtotal())}`,
          });
          confirmed = !!result.success;
        } catch {
          confirmed = false;
        }

        const params = new URLSearchParams({
          order,
          items: String(count),
          subtotal: subtotal().toFixed(2),
          email,
          confirmed: String(confirmed),
        });
        location.href = `thank-you?${params.toString()}`;
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.open) close();
    });
  }

  function openDrawer() { state.open = true; render(); }
  function close() { state.open = false; render(); }

  function init(products) {
    state.products = products;
    bindUI();
    render();
  }

  return { init, add, remove, setQty, open: openDrawer, close, subtotal };
})();
