"use client";
import { useState } from "react";
import Link from "next/link";
import { generatePKCEPair } from "@nhost/nhost-js/auth";
import { getNhost } from "../../../lib/nhost";

export default function SignInForm() {
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const { verifier, challenge } = await generatePKCEPair();
      localStorage.setItem("nhost_pkce_verifier", verifier);
      const response = await getNhost().auth.signInPasswordlessEmail({
        email: email.trim().toLowerCase(),
        options: { redirectTo: window.location.origin + "/portal/verify" },
        codeChallenge: challenge
      });
      if (response.error || response.body?.error) throw new Error(response.body?.message || "Unable to send your sign-in link.");
      setSent(true);
    } catch(err) {
      localStorage.removeItem("nhost_pkce_verifier");
      setError(err?.message || "Unable to send your sign-in link. Please try again.");
    } finally { setBusy(false); }
  }

  return <section className="wrap onboarding-wrap"><div className="onboard-card signin-card">
    <p className="eyebrow">YOUR WORKSPACE</p><h2>{sent ? "Check your inbox." : "Sign in with email"}</h2>
    {sent ? <>
      <p>We've sent a secure sign-in link to <strong>{email}</strong>. Open it on this device to access your client workspace. The link may expire, so use the latest email.</p>
      <button type="button" className="btn-quiet" onClick={()=>setSent(false)}>Use a different email</button>
    </> : <form onSubmit={submit} className="portal-form">
      <p className="portal-muted">Enter the email address you used when you started your project. No password needed.</p>
      <label className="field"><span>Email address</span><input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn primary" disabled={busy}>{busy?"Sending link…":"Email me a sign-in link ↗"}</button>
    </form>}
    <p className="privacy-note">Only use your own email account and keep access to your inbox secure. You are responsible for activity carried out through your authenticated account or device.</p>
    <p className="signin-prompt">New here? <Link href="/onboard">Start your onboarding</Link></p>
  </div></section>;
}
