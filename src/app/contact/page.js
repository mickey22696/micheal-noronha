import Link from "next/link";
export const metadata = { title: "Contact" };
export default function ContactPage() {
  return <main>
    <section className="page-hero wrap">
      <p className="eyebrow">CONTACT</p>
      <h1>Let&apos;s talk about<br /><span>what&apos;s next.</span></h1>
      <p className="lead">Have an idea, a challenge or a project in mind? Share a little about it and start the conversation.</p>
    </section>
    <section className="wrap section"><div className="contact-panel">
      <p className="eyebrow">START A CONVERSATION</p>
      <h2>Tell me what you&apos;re building.</h2>
      <p>Share your requirements through the secure client onboarding form. You can create an account and follow your enquiry from your dashboard.</p>
      <Link className="btn primary" href="/onboard/">Start project onboarding ↗</Link>
    </div></section>
  </main>;
}
