(async function () {
  const params = new URLSearchParams(location.search);
  const order = params.get("order");
  const items = params.get("items");
  const subtotal = params.get("subtotal");
  const email = params.get("email");
  const confirmed = params.get("confirmed") === "true";

  const summary = document.getElementById("order-summary");
  if (order && items && subtotal) {
    summary.innerHTML = `
      <div class="order-summary__row"><span>Order</span><span class="mono">${order}</span></div>
      <div class="order-summary__row"><span>Items</span><span class="mono">${items}</span></div>
      <div class="order-summary__row"><span>Subtotal</span><span>$${subtotal}</span></div>`;
  } else {
    summary.innerHTML = `<p style="color:var(--ink-2);font-size:14px;">No order details found. This page is normally reached from the cart's checkout button.</p>`;
  }

  const note = document.getElementById("thank-you-note");
  if (note && order) {
    note.textContent = email && confirmed
      ? `Checkout isn't connected to a payment processor yet, so no payment was taken and nothing will ship — but we've sent a confirmation to ${email}.`
      : "Checkout isn't connected to a payment processor yet, so no payment was taken and nothing will ship — but here's what your order confirmation looks like.";
  }

  const catalog = await fetch("data/products.json").then((r) => r.json());
  Cart.init(catalog.products);
})();
