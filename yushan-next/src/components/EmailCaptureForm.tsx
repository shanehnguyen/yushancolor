"use client";

import { useState } from "react";
import { submitWeb3Form } from "@/lib/web3forms";

export function EmailCaptureForm() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("No spam. Unsubscribe any time.");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setNote("Sending…");
    try {
      const result = await submitWeb3Form({ subject: "Yushan: Pigment index request", from_name: "Yushan site (homepage signup)", email });
      if (result.success) {
        setNote("You're on the list. Check your inbox to confirm.");
        setEmail("");
      } else {
        setNote("Something went wrong. Try again, or email hello@yushancolour.com.");
      }
    } catch {
      setNote("Something went wrong. Try again, or email hello@yushancolour.com.");
    }
    setSending(false);
  }

  return (
    <div className="email-capture">
      <h2>Get the printable pigment index</h2>
      <p style={{ color: "var(--ink-2)" }}>Join the list for early access to new colours and a print-ready PDF of the full Chart.</p>
      <form onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="email-input">
          Email address
        </label>
        <input type="email" id="email-input" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="btn btn-primary" disabled={sending}>
          Join
        </button>
      </form>
      <p className="email-capture__note">{note}</p>
    </div>
  );
}
