"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNhost } from "../../../lib/nhost";

export default function SignInForm() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const response=await getNhost().auth.signInEmailPassword({email:email.trim(),password});
      if(response.body?.session) router.push("/portal");
      else setError("Sign in could not be completed. Check your email and password.");
    } catch(err) { setError(err?.message || "Unable to sign in."); }
    finally { setBusy(false); }
  }

  return <section className="wrap onboarding-wrap"><div className="onboard-card signin-card">
    <p className="eyebrow">YOUR WORKSPACE</p><h2>Client sign in</h2>
    <form onSubmit={submit} className="portal-form">
      <label className="field"><span>Email address</span><input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label className="field"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn primary" disabled={busy}>{busy?"Signing in…":"Sign in to your portal ↗"}</button>
    </form>
    <p className="signin-prompt">New here? <Link href="/onboard">Start your onboarding</Link></p>
  </div></section>;
}
