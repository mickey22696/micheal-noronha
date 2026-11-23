"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getNhost, saveOnboarding } from "../../../lib/nhost";

export default function VerifyClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your email and preparing your client portal…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    async function verify() {
      const code = params.get("code");
      const verifier = localStorage.getItem("nhost_pkce_verifier");
      if (!code || !verifier) {
        if (active) { setFailed(true); setMessage("This verification link is incomplete or has expired. Please sign in or request a new verification email."); }
        return;
      }
      try {
        await getNhost().auth.tokenExchange({ code, codeVerifier: verifier });
        localStorage.removeItem("nhost_pkce_verifier");
        const raw = localStorage.getItem("mn_pending_onboarding");
        if (raw) { await saveOnboarding(JSON.parse(raw)); localStorage.removeItem("mn_pending_onboarding"); }
        if (active) router.replace("/portal");
      } catch (err) {
        if (active) { setFailed(true); setMessage(err?.message || "Verification failed. Please try signing in."); }
      }
    }
    verify();
    return () => { active = false; };
  }, [params, router]);

  return <main className="portal-public"><section className="wrap onboarding-wrap"><div className="onboard-card verify-card">
    <p className="eyebrow">ACCOUNT VERIFICATION</p><h2>{failed ? "We couldn't verify that link." : "Just a moment…"}</h2><p>{message}</p>
    {failed && <div className="verify-fallback"><Link className="btn primary" href="/portal/sign-in">Try sign in again ↗</Link><p className="portal-muted">If this domain keeps failing, open the backup sign-in page and request a fresh email link:</p><a className="btn-quiet" href="https://micheal-noronha.vercel.app/portal/sign-in">Open Vercel backup sign-in ↗</a></div>}
  </div></section></main>;
}
