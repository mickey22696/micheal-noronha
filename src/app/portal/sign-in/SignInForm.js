"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getNhost } from "../../../lib/nhost";

const countries = [
  { name: "India", dial: "+91" }, { name: "Kuwait", dial: "+965" },
  { name: "United States", dial: "+1" }, { name: "United Kingdom", dial: "+44" },
  { name: "United Arab Emirates", dial: "+971" }, { name: "Saudi Arabia", dial: "+966" },
  { name: "Qatar", dial: "+974" }, { name: "Oman", dial: "+968" },
  { name: "Bahrain", dial: "+973" }, { name: "Canada", dial: "+1" },
  { name: "Australia", dial: "+61" }, { name: "Other", dial: "+" }
];

const digits = (value) => String(value || "").replace(/\\D/g, "");

export default function SignInForm() {
  const [surname, setSurname] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("details");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const fullPhone = countryCode + digits(phone);

  async function requestCode(e) {
    e.preventDefault();
    setError("");
    if (!surname.trim() || digits(phone).length < 6) {
      setError("Enter your surname and a valid phone number.");
      return;
    }
    setBusy(true);
    try {
      const response = await getNhost().auth.signInPasswordlessSms({ phoneNumber: fullPhone });
      if (response.error || response.body?.error) throw new Error(response.body?.message || "Could not send a verification code.");
      setStep("otp");
    } catch (err) {
      setError(err?.message || "SMS sign-in is not available yet. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setError("");
    if (!/^\\d{4,8}$/.test(otp.trim())) {
      setError("Enter the verification code sent to your phone.");
      return;
    }
    setBusy(true);
    try {
      const nhost = getNhost();
      const response = await nhost.auth.verifySignInPasswordlessSms({ phoneNumber: fullPhone, otp: otp.trim() });
      const session = response.body?.session;
      if (response.error || !session?.user?.id) throw new Error(response.body?.message || "That code could not be verified.");

      const result = await nhost.graphql.request({
        query: `query VerifyClientIdentity($userId: uuid!) {
          customer_profiles(where: { user_id: { _eq: $userId } }, limit: 1) { full_name phone }
        }`,
        variables: { userId: session.user.id }
      });
      if (result.body?.errors?.length) throw new Error("We couldn't verify your client profile. Please contact support.");
      const profile = result.body?.data?.customer_profiles?.[0];
      const expectedSurname = (profile?.full_name || "").trim().split(/\\s+/).pop() || "";
      const suppliedSurname = surname.trim().toLocaleLowerCase();
      const savedDigits = digits(profile?.phone);
      const enteredDigits = digits(phone);
      const phoneMatches = savedDigits && (savedDigits.endsWith(enteredDigits) || enteredDigits.endsWith(savedDigits));
      if (!profile || expectedSurname.toLocaleLowerCase() !== suppliedSurname || !phoneMatches) {
        await nhost.auth.signOut();
        throw new Error("Those details don't match a client profile. Check your surname and phone number or contact us for help.");
      }
      router.push("/portal");
      router.refresh();
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="wrap onboarding-wrap"><div className="onboard-card signin-card">
    <p className="eyebrow">YOUR WORKSPACE</p><h2>Client sign in</h2>
    <p className="portal-muted">Use the surname and phone number registered with your account.</p>
    {step === "details" ? <form onSubmit={requestCode} className="portal-form">
      <label className="field"><span>Surname</span><input autoComplete="family-name" required value={surname} onChange={e=>setSurname(e.target.value)} placeholder="Your surname" /></label>
      <label className="field"><span>Country code</span><select value={countryCode} onChange={e=>setCountryCode(e.target.value)}>{countries.map(c=><option key={c.name} value={c.dial}>{c.name} ({c.dial})</option>)}</select></label>
      <label className="field"><span>Phone number</span><input type="tel" inputMode="numeric" autoComplete="tel-national" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Enter number without country code" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn primary" disabled={busy}>{busy?"Sending…":"Continue ↗"}</button>
    </form> : <form onSubmit={verifyCode} className="portal-form">
      <p className="form-hint">Enter the code sent to {fullPhone}.</p>
      <label className="field"><span>Verification code</span><input autoComplete="one-time-code" inputMode="numeric" required value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter SMS code" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn primary" disabled={busy}>{busy?"Verifying…":"Verify and sign in ↗"}</button>
      <button type="button" className="btn-quiet" onClick={()=>{setStep("details");setOtp("");setError("");}}>← Change details</button>
    </form>}
    <p className="privacy-note">Keep your phone and verification codes private. You are responsible for activity carried out through your authenticated account or device.</p>
    <p className="signin-prompt">New here? <Link href="/onboard">Start your onboarding</Link></p>
  </div></section>;
}
