(async function () {
  const params = new URLSearchParams(location.search);
  const order = params.get("order");
  const items = params.get("items");
  const subtotal = params.get("subtotal");

  const summary = document.getElementById("order-summary");
  if (order && items && subtotal) {
    summary.innerHTML = `
      <div class="order-summary__row"><span>Order</span><span class="mono">${order}</span></div>
      <div class="order-summary__row"><span>Items</span><span class="mono">${items}</span></div>
      <div class="order-summary__row"><span>Subtotal</span><span>$${subtotal}</span></div>`;
  } else {
    summary.innerHTML = `<p style="color:var(--ink-2);font-size:14px;">No order details found. This page is normally reached from the cart's checkout button.</p>`;
  }

  const catalog = await fetch("data/products.json").then((r) => r.json());
  Cart.init(catalog.products);
})();
