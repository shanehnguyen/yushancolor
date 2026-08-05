import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false },
};

export default function TermsOfServicePage() {
  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Terms of service</span>
      </div>

      <div className="policy-page">
        <h1>Terms of service</h1>
        <p>Last updated July 2026.</p>

        <h2>Orders</h2>
        <p>
          Checkout on this site does not process real payment yet, so no order is fulfilled and nothing ships. The confirmation page shows
          what a completed order would look like once payment is connected.
        </p>

        <h2>Product information</h2>
        <p>We work to keep pigment data, pricing, and shipping terms accurate and up to date. If something looks wrong, email us and we&apos;ll correct it.</p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a>.
        </p>
      </div>
    </main>
  );
}
