"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { productsById, money } from "@/lib/data";

function ThankYouContent() {
  const params = useSearchParams();
  const order = params.get("order");
  const items = params.get("items");
  const subtotal = params.get("subtotal");
  const email = params.get("email");
  const confirmed = params.get("confirmed") === "true";
  const puliBlock = productsById["puli-block"];

  const note =
    order && email && confirmed
      ? `Checkout isn't connected to a payment processor yet, so no payment was taken and nothing will ship. We've sent a confirmation to ${email}.`
      : "Checkout isn't connected to a payment processor yet, so no payment was taken and nothing will ship. Here's what your order confirmation looks like.";

  return (
    <main id="main">
      <div className="state-page">
        <div className="eyebrow">Order confirmed</div>
        <h1 style={{ margin: "var(--sp-3) 0" }}>Thank you</h1>
        <p style={{ color: "var(--ink-2)" }}>{note}</p>

        <div className="order-summary">
          {order && items && subtotal ? (
            <>
              <div className="order-summary__row">
                <span>Order</span>
                <span className="mono">{order}</span>
              </div>
              <div className="order-summary__row">
                <span>Items</span>
                <span className="mono">{items}</span>
              </div>
              <div className="order-summary__row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--ink-2)", fontSize: 14 }}>
              No order details found. This page is normally reached from the cart&apos;s checkout button.
            </p>
          )}
        </div>

        <div style={{ marginTop: "var(--sp-6)" }}>
          <Link className="btn btn-outline" href="/pages/chart">
            Explore the Chart
          </Link>
          <Link className="btn btn-primary" href="/collections/all" style={{ marginLeft: "var(--sp-2)" }}>
            Keep shopping
          </Link>
        </div>
      </div>

      {puliBlock && (
        <section className="section">
          <div className="section__head section__head--center">
            <h2>Before your order arrives</h2>
            <p>A Puli paper block holds granulation better than most sketchbook paper. It&apos;s the exact paper every swatch on this site was painted on.</p>
          </div>
          <div style={{ maxWidth: 360, margin: "0 auto" }}>
            <div className="product-card">
              <div
                className="product-card__img pattern-tile"
                role="img"
                aria-label="Puli cotton paper texture, represented as a woven pattern"
                style={{ backgroundColor: "var(--paper-2)", opacity: 0.7 }}
              />
              <div className="product-card__name">{puliBlock.name}</div>
              <div className="product-card__price">{money(puliBlock.price)}</div>
              <Link className="btn btn-outline btn-block" href={`/products/${puliBlock.id}`}>
                Add to next order
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}
