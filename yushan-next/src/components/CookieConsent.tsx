"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "yushan-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "accepted" || stored === "declined") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  function decide(value: "accepted" | "declined") {
    localStorage.setItem(KEY, value);
    setVisible(false);
  }

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie notice">
      <p>
        We use essential cookies to run the cart, and optional cookies for analytics. No ads, nothing sold to third parties.{" "}
        <Link href="/policies/privacy-policy">Privacy policy</Link>
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="btn btn-outline" onClick={() => decide("declined")}>
          Decline
        </button>
        <button type="button" className="btn btn-primary" onClick={() => decide("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
