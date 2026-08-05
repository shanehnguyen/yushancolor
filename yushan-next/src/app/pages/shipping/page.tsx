import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping and Returns",
  description: "Shipping origin, cost, transit time, duties and the 60-day return policy for Yushan Colour Co.",
};

export default function ShippingPage() {
  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Shipping and returns</span>
      </div>

      <div className="policy-page">
        <h1>Shipping and returns</h1>
        <p>
          Plain terms, no fine print. If something here doesn&apos;t answer your question, email{" "}
          <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a>.
        </p>

        <h2>Processing</h2>
        <p>Every order ships from the workshop in Datong District, Taipei, within 24 hours of being placed, Monday through Saturday.</p>

        <h2>Cost and transit time</h2>
        <div className="compare-table" style={{ margin: "var(--sp-4) 0" }}>
          <table>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Cost</th>
                <th>Transit time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>United States</td>
                <td className="mono">$9, free over $80</td>
                <td>6–9 business days</td>
              </tr>
              <tr>
                <td>United Kingdom</td>
                <td className="mono">$9, free over $80</td>
                <td>6–9 business days</td>
              </tr>
              <tr>
                <td>European Union</td>
                <td className="mono">$9, free over $80</td>
                <td>6–9 business days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>These are the only three regions Yushan currently ships to.</p>

        <h2>Duties and import tax</h2>
        <p>Duties and import tax are calculated and prepaid at checkout. Nothing is owed to the courier on delivery.</p>

        <h2>Returns</h2>
        <p>
          Every order has a 60-day return window from the delivery date, whether the pans have been used or not. To start a return, email{" "}
          <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a> with your order number and we&apos;ll send instructions for
          sending it back.
        </p>
        <ul>
          <li>Used or unused, no explanation required</li>
          <li>60 days from delivery, not from order date</li>
          <li>Refunds go back to the original payment method</li>
        </ul>

        <h2>Damaged or missing items</h2>
        <p>
          If anything arrives damaged, or a pan is missing from your order, email a photo to{" "}
          <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a> and we&apos;ll sort a replacement without asking you to return
          anything first.
        </p>
      </div>
    </main>
  );
}
