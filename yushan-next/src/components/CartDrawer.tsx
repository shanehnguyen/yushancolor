"use client";

import { useState } from "react";
import { useCart, FREE_SHIP_THRESHOLD } from "@/lib/cart-context";
import { money, products } from "@/lib/data";

export function CartDrawer() {
  const cart = useCart();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("60-day returns. Duties prepaid.");
  const [submitting, setSubmitting] = useState(false);

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - cart.subtotal);
  const pct = Math.min(100, (cart.subtotal / FREE_SHIP_THRESHOLD) * 100);
  const shipLabel = remaining > 0 ? `Add ${money(remaining)} more for free shipping` : "Free shipping unlocked";
  const upsell = cart.pickUpsell(products);
  const showUpsell = upsell && !cart.items.some((i) => i.productId === upsell.id);

  async function handleCheckout() {
    if (cart.items.length === 0) {
      setNote("Your cart is empty.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNote("Enter a valid email for your order confirmation.");
      return;
    }
    setSubmitting(true);
    setNote("Confirming order…");
    await cart.checkout(email.trim());
    setSubmitting(false);
  }

  return (
    <>
      <div className="cart-scrim" data-open={String(cart.open)} onClick={cart.closeDrawer} />
      <aside className="cart-drawer" role="dialog" aria-label="Cart" aria-hidden={!cart.open} data-open={String(cart.open)}>
        <div className="cart-drawer__head">
          <strong>Cart</strong>
          <button type="button" className="cart-drawer__close" aria-label="Close cart" onClick={cart.closeDrawer}>
            ×
          </button>
        </div>
        <div>
          <div className="free-ship-bar">
            <div className="free-ship-bar__label">{shipLabel}</div>
            <div className="free-ship-bar__track">
              <div className="free-ship-bar__fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
        <div className="cart-drawer__items">
          {cart.items.length === 0 ? (
            <div className="cart-empty">Your cart is empty. The Dot Card is $14 and the fastest way to see the range.</div>
          ) : (
            cart.items.map((i) => (
              <div className="cart-line" key={i.key}>
                <div className="cart-line__img" aria-hidden="true" />
                <div>
                  <div className="cart-line__name">{i.name}</div>
                  <div className="cart-line__meta">{i.variantLabel || ""}</div>
                  <div className="qty-input" style={{ marginTop: 6 }}>
                    <button type="button" aria-label="Decrease quantity" onClick={() => cart.setQty(i.key, i.qty - 1)}>
                      &minus;
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={i.qty}
                      aria-label="Quantity"
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        cart.setQty(i.key, Number.isFinite(n) ? n : 1);
                      }}
                    />
                    <button type="button" aria-label="Increase quantity" onClick={() => cart.setQty(i.key, i.qty + 1)}>
                      +
                    </button>
                  </div>
                  <button type="button" className="cart-line__remove" onClick={() => cart.remove(i.key)}>
                    Remove
                  </button>
                </div>
                <div className="cart-line__price">{money(i.unitPrice * i.qty)}</div>
              </div>
            ))
          )}
        </div>
        <div>
          {showUpsell && upsell && (
            <div className="cart-upsell">
              <div className="cart-upsell__img" aria-hidden="true" />
              <div className="cart-upsell__body">
                <strong>{upsell.name}</strong>
                {upsell.shortDescription}
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: "8px 14px", fontSize: 13 }}
                onClick={() =>
                  cart.add({ productId: upsell.id, variantId: null, name: upsell.name, unitPrice: upsell.price, variantLabel: upsell.format })
                }
              >
                Add {money(upsell.price)}
              </button>
            </div>
          )}
        </div>
        <div className="cart-drawer__foot">
          <div className="cart-subtotal-row">
            <span>Subtotal</span>
            <span>{money(cart.subtotal)}</span>
          </div>
          <div className="cart-email-row">
            <label className="visually-hidden" htmlFor="cart-email">
              Email for order confirmation
            </label>
            <input
              type="email"
              id="cart-email"
              placeholder="Email for order confirmation"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={handleCheckout} disabled={submitting}>
            {submitting ? "Confirming…" : "Checkout"}
          </button>
          <div className="cart-trust">{note}</div>
          <div className="wallet-row">
            <span>Shop Pay</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
            <span>PayPal</span>
          </div>
        </div>
      </aside>
    </>
  );
}
