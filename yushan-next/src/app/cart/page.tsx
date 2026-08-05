"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { money, productUrl } from "@/lib/data";

export default function CartPage() {
  const cart = useCart();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Cart</span>
      </div>
      <div className="container" style={{ paddingTop: "var(--sp-6)", paddingBottom: "var(--sp-8)" }}>
        <h1 style={{ marginBottom: "var(--sp-6)" }}>Your cart</h1>

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            Your cart is empty. <Link href={productUrl("dot-card")}>The Dot Card</Link> is $14 and the fastest way to see the range.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "var(--sp-6)", alignItems: "start" }}>
            <div className="cart-drawer__items" style={{ border: "var(--border)", padding: "var(--sp-4)" }}>
              {cart.items.map((i) => (
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
              ))}
            </div>

            <div className="cart-drawer__foot" style={{ border: "var(--border)", padding: "var(--sp-4)" }}>
              <div className="cart-subtotal-row">
                <span>Subtotal</span>
                <span>{money(cart.subtotal)}</span>
              </div>
              <div className="cart-email-row">
                <label className="visually-hidden" htmlFor="cart-page-email">
                  Email for order confirmation
                </label>
                <input
                  type="email"
                  id="cart-page-email"
                  placeholder="Email for order confirmation"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="button" className="btn btn-primary btn-lg btn-block" onClick={handleCheckout} disabled={submitting}>
                {submitting ? "Confirming…" : "Checkout"}
              </button>
              {note && <div className="cart-trust">{note}</div>}
              <div className="wallet-row">
                <span>Shop Pay</span>
                <span>Apple Pay</span>
                <span>Google Pay</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
