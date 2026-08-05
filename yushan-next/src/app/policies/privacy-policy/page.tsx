import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Privacy policy</span>
      </div>

      <div className="policy-page">
        <h1>Privacy policy</h1>
        <p>Last updated July 2026.</p>

        <h2>Information we collect</h2>
        <p>
          When you place an order, we collect the name, shipping address, and email address you provide at checkout. Payment details are
          handled directly by our payment processor. We never see or store your card number. When you join the mailing list or request the
          printable pigment index, we collect your email address.
        </p>

        <h2>How we use it</h2>
        <p>
          Order information is used to ship your order and to answer questions about it. Email addresses collected through sign-up forms are
          used only to send the content you asked for and occasional updates about new colours. They are never sold or shared with third
          parties.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          Essential cookies keep the cart working during your session. We use Vercel Web Analytics for traffic insight, which is cookieless
          and does not track you across other sites. You can accept or decline non-essential cookies from the banner shown on your first
          visit, and change your choice any time by clearing your browser&apos;s local storage for this site.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy, or a request to access or delete your data: <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a>.
        </p>
      </div>
    </main>
  );
}
