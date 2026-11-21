import Link from "next/link";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">CONTACT</p>
        <h1>Let&apos;s talk about<br /><span>what&apos;s next.</span></h1>
        <p className="lead">
          Have an idea, a challenge or a project in mind? Share a little about it and start the conversation.
        </p>
      </section>
      <section className="wrap section">
        <div className="contact-panel">
          <p className="eyebrow">START A CONVERSATION</p>
          <h2>Tell me what you&apos;re building.</h2>
          <p>For project enquiries, collaborations and general questions, reach out by email.</p>
          <Link className="btn primary" href="mailto:hello@michealnoronha.com">Email Micheal ↗</Link>
          <p className="small-note">Please replace this placeholder email with your preferred business contact before promoting the site.</p>
        </div>
      </section>
    </main>
  );
}
