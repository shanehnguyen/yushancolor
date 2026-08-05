"use client";

import { useState } from "react";
import Link from "next/link";

export default function AccountLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult("Account sign-in isn't available yet. Check your order confirmation email, or see the FAQ for order questions.");
  }

  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Account</span>
      </div>

      <div className="account-page">
        <h1>Sign in</h1>
        <p className="account-page__note">
          Account sign-in isn&apos;t connected yet. Checkout stays guest-only, so you don&apos;t need an account to order. For a question about
          an existing order, email <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a> with your order number, or check the{" "}
          <Link href="/pages/faq">FAQ</Link>.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="account-email">Email</label>
          <input
            type="email"
            id="account-email"
            name="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="account-password">Password</label>
          <input
            type="password"
            id="account-password"
            name="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-block">
            Sign in
          </button>
        </form>
        {result && (
          <p className="account-page__result" role="status">
            {result}
          </p>
        )}
        <p className="account-page__switch">Accounts aren&apos;t available yet, so there&apos;s no sign-up either. Order questions go to the email above.</p>
      </div>
    </main>
  );
}
