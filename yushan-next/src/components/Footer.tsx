import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-col">
          <div className="wordmark" style={{ marginBottom: "var(--sp-3)" }}>
            玉山 Yushan
          </div>
          <p style={{ fontSize: 14, color: "#C9C5BC", maxWidth: "32ch" }}>
            Hand-milled watercolour from Datong District, Taipei. Every Colour Index code and lightfastness result published, including the weak
            ones.
          </p>
        </div>
        <div className="footer-col">
          <h3>Shop</h3>
          <ul>
            <li>
              <Link href="/collections/all">All colours and sets</Link>
            </li>
            <li>
              <Link href="/pages/chart">The Chart</Link>
            </li>
            <li>
              <Link href="/products/dot-card">The Dot Card, $14</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Support</h3>
          <ul>
            <li>
              <Link href="/pages/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/pages/shipping">Shipping and returns</Link>
            </li>
            <li>$9 worldwide, free over $80</li>
            <li>60-day return</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a>
            </li>
            <li>Datong District, Taipei</li>
            <li>
              <Link href="/pages/wholesale">Wholesale and stockists</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Yushan Colour Co. All rights reserved.</span>
        <span>
          <Link href="/policies/privacy-policy">Privacy</Link> · <Link href="/policies/terms-of-service">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
