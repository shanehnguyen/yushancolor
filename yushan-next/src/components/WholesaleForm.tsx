"use client";

import { useState } from "react";
import { submitWeb3Form } from "@/lib/web3forms";

export function WholesaleForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shop, setShop] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setNote("Sending…");
    try {
      const result = await submitWeb3Form({
        subject: "Yushan: Wholesale/press inquiry",
        from_name: "Yushan site (wholesale page)",
        name,
        email,
        shop,
        location,
        message,
      });
      if (result.success) {
        setNote("Sent. We'll reply by email.");
        setName("");
        setEmail("");
        setShop("");
        setLocation("");
        setMessage("");
      } else {
        setNote("Something went wrong. Try again, or email hello@yushancolour.com.");
      }
    } catch {
      setNote("Something went wrong. Try again, or email hello@yushancolour.com.");
    }
    setSending(false);
  }

  return (
    <>
      <form className="inquiry-form" onSubmit={handleSubmit}>
        <label htmlFor="wholesale-name">Name</label>
        <input type="text" id="wholesale-name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="wholesale-email">Email</label>
        <input type="email" id="wholesale-email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="wholesale-shop">Shop or studio name</label>
        <input type="text" id="wholesale-shop" name="shop" value={shop} onChange={(e) => setShop(e.target.value)} />

        <label htmlFor="wholesale-location">Location</label>
        <input type="text" id="wholesale-location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />

        <label htmlFor="wholesale-message">What are you interested in?</label>
        <textarea
          id="wholesale-message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          Send inquiry
        </button>
      </form>
      <p className="inquiry-form__note" aria-live="polite">
        {note}
      </p>
    </>
  );
}
