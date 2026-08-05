"use client";

import { useEffect, useState } from "react";
import { submitWeb3Form } from "@/lib/web3forms";

const SEEN_KEY = "yushan-email-popup-seen";

export function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("No spam. Unsubscribe any time.");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;

    function show() {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      setVisible(true);
      sessionStorage.setItem(SEEN_KEY, "true");
    }
    function onMouseOut(e: MouseEvent) {
      if (!e.relatedTarget && e.clientY <= 0) show();
    }
    document.addEventListener("mouseout", onMouseOut);
    const timer = setTimeout(show, 25000);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") setVisible(false);
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [visible]);

  if (!visible) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setNote("Sending…");
    try {
      const result = await submitWeb3Form({
        subject: "Yushan: Pigment index request",
        from_name: "Yushan site (exit-intent popup)",
        email,
      });
      if (result.success) {
        setNote("You're on the list. Check your inbox to confirm.");
        setTimeout(() => setVisible(false), 1800);
      } else {
        setNote("Something went wrong. Try again, or email hello@yushancolour.com.");
      }
    } catch {
      setNote("Something went wrong. Try again, or email hello@yushancolour.com.");
    }
    setSending(false);
  }

  return (
    <div className="email-popup-overlay" onClick={(e) => e.target === e.currentTarget && setVisible(false)}>
      <div className="email-popup" role="dialog" aria-modal="true" aria-labelledby="email-popup-title">
        <button type="button" className="email-popup__close" aria-label="Close" onClick={() => setVisible(false)}>
          &times;
        </button>
        <h2 id="email-popup-title">Get the printable pigment index</h2>
        <p>Every Colour Index code, Blue Wool rating and swatch in the range, one print-ready PDF. Join the list for early access to new colours too.</p>
        <form onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="email-popup-input">
            Email address
          </label>
          <input
            type="email"
            id="email-popup-input"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={sending}>
            Send it to me
          </button>
        </form>
        <p className="email-popup__note">{note}</p>
      </div>
    </div>
  );
}
