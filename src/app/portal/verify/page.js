import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return <Suspense fallback={<main className="portal-app"><div className="portal-loading">Verifying your account…</div></main>}><VerifyClient /></Suspense>;
}
