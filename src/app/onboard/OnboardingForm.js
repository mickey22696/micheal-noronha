"use client";

import { useState } from "react";
import Link from "next/link";
import { generatePKCEPair } from "@nhost/nhost-js/auth";
import { useRouter } from "next/navigation";
import { getNhost, saveOnboarding } from "../../lib/nhost";

const serviceOptions = [
  "Website design & development", "UI/UX & product design", "Web or mobile application",
  "E-commerce", "SaaS / API / integrations", "Automation & growth systems",
  "Cloud / DevOps / IT consulting", "Not sure yet"
];

const initial = {
  fullName: "", email: "", phone: "", jobTitle: "", companyName: "",
  companyWebsite: "", industry: "", companySize: "", country: "India",
  services: [], budget: "", timeline: "", projectBrief: ""
};

export default function OnboardingForm() {
  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();

  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const toggleService = (service) => update("services",
    form.services.includes(service) ? form.services.filter((item) => item !== service) : [...form.services, service]
  );

  function validateStep() {
    if (step === 1 && (!form.fullName.trim() || !form.email.trim() || !form.phone.trim())) {
      return "Please complete your name, email and phone number.";
    }
    if (step === 2 && (!form.companyName.trim() || !form.industry || !form.country)) {
      return "Please add your business name, industry and country. If you are a freelancer, use your own name as the business name.";
    }
    if (step === 3 && form.services.length === 0) return "Choose at least one service so I know what you need.";
    return "";
  }

  async function submit() {
    setError(""); setNotice(""); setBusy(true);
    try {
      const nhost = getNhost();
      const { verifier, challenge } = await generatePKCEPair();
      localStorage.setItem("nhost_pkce_verifier", verifier);
      const pending = { ...form };
      delete pending.password;
      delete pending.confirmPassword;
      localStorage.setItem("mn_pending_onboarding", JSON.stringify(pending));

      const response = await nhost.auth.signInPasswordlessEmail({
        email: form.email.trim().toLowerCase(),
        options: {
          displayName: form.fullName.trim(),
          metadata: {
            fullName: form.fullName.trim(),
            companyName: form.companyName.trim(),
            onboardingSource: "website"
          },
          redirectTo: window.location.origin + "/portal/verify"
        },
        codeChallenge: challenge
      });

      if (response.error || response.body?.error) throw new Error(response.body?.message || "We couldn't send your sign-in link.");
      setNotice("We've emailed you a secure sign-in link. Open it on this device to verify your email and enter your client portal.");
    } catch (err) {
      setError(err?.message || "We couldn't create your account. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="wrap onboarding-wrap">
      <div className="onboard-card">
        {notice ? (
          <div className="onboard-success">
            <span className="success-mark">✓</span>
            <p className="eyebrow">ONE MORE STEP</p>
            <h2>Check your email.</h2>
            <p>{notice}</p>
            <Link className="btn primary" href="/portal/sign-in">Go to client sign in ↗</Link>
          </div>
        ) : (
          <>
            <div className="onboard-progress">
              <div><span>STEP 0{step} / 04</span><b>{["Personal details", "Your business", "Project requirements", "Email sign-in"][step - 1]}</b></div>
              <div className="progress-track"><i style={{ width: (step * 25) + "%" }} /></div>
            </div>
            {step === 1 && <div className="form-grid">
              <Field label="Full name" required><input autoComplete="name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your name" /></Field>
              <Field label="Business email" required><input type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" /></Field>
              <Field label="Phone / WhatsApp" required><input autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 ..." /></Field>
              <Field label="Your role"><input value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Founder, manager, freelancer..." /></Field>
            </div>}
            {step === 2 && <div className="form-grid">
              <Field label="Business / brand name" required><input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Company or personal brand" /></Field>
              <Field label="Website"><input type="url" value={form.companyWebsite} onChange={(e) => update("companyWebsite", e.target.value)} placeholder="https://" /></Field>
              <Field label="Industry" required><select value={form.industry} onChange={(e) => update("industry", e.target.value)}><option value="">Select industry</option>{["Technology / IT","Professional services","Retail / E-commerce","Food & hospitality","Healthcare","Education","Real estate / construction","Media / creative","Finance","Other"].map(x => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Business size"><select value={form.companySize} onChange={(e) => update("companySize", e.target.value)}><option value="">Select size</option>{["Just me","2–10 people","11–50 people","51–200 people","201+ people"].map(x => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Country" required><input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Country" /></Field>
            </div>}
            {step === 3 && <>
              <p className="form-hint">What would you like help with? Select all that apply.</p>
              <div className="service-options">{serviceOptions.map((service) => <button type="button" key={service} className={form.services.includes(service) ? "option selected" : "option"} onClick={() => toggleService(service)}><span>{form.services.includes(service) ? "✓" : "+"}</span>{service}</button>)}</div>
              <div className="form-grid project-fields">
                <Field label="Approximate budget"><select value={form.budget} onChange={(e) => update("budget", e.target.value)}><option value="">Select a range</option>{["Under ₹25,000","₹25,000–₹50,000","₹50,000–₹1 lakh","₹1–3 lakh","₹3 lakh+","Not decided"].map(x => <option key={x}>{x}</option>)}</select></Field>
                <Field label="Ideal timeline"><select value={form.timeline} onChange={(e) => update("timeline", e.target.value)}><option value="">Select timeline</option>{["As soon as possible","Within 2–4 weeks","Within 1–3 months","Flexible / exploring"].map(x => <option key={x}>{x}</option>)}</select></Field>
                <Field label="A little about the project" wide><textarea rows="4" value={form.projectBrief} onChange={(e) => update("projectBrief", e.target.value)} placeholder="What are you trying to achieve? Any important features, challenges or references?" /></Field>
              </div>
            </>}
            {step === 4 && <div className="form-grid">
              <div className="account-note"><b>Your client portal access</b><p>No password to create or remember. We'll email a secure sign-in link whenever you want to access your workspace.</p><span>{form.email}</span></div>
              <Field label="Confirm password" required><input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="Enter it again" /></Field>
              <p className="privacy-note">By creating an account, you agree that the details above may be used to respond to your enquiry and manage your project. Your portal data is private to your account.</p>
            </div>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="form-actions">
              {step > 1 ? <button type="button" className="btn-quiet" onClick={() => { setError(""); setStep(step - 1); }}>← Back</button> : <span className="signin-prompt">Already a client? <Link href="/portal/sign-in">Sign in</Link></span>}
              {step < 4 ? <button type="button" className="btn primary" onClick={() => { const issue = validateStep(); if (issue) setError(issue); else { setError(""); setStep(step + 1); } }}>Continue ↗</button> :
                <button type="button" className="btn primary" disabled={busy} onClick={() => { const issue = validateStep(); if (issue) setError(issue); else submit(); }}>{busy ? "Sending link…" : "Email my secure sign-in link ↗"}</button>}
            </div>
          </>
        )}
      </div>
      <p className="onboard-footnote">A personal, secure workspace for your business and projects.</p>
    </section>
  );
}

function Field({ label, required, wide, children }) {
  return <label className={"field" + (wide ? " field-wide" : "")}><span>{label}{required && <i> *</i>}</span>{children}</label>;
}
