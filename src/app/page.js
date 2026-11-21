import Link from "next/link";
import TypewriterHeadline from "./components/TypewriterHeadline";

export default function HomePage() {
  return (
    <main>
      <section className="hero wrap">
        <p className="eyebrow">INDEPENDENT DIGITAL STUDIO · INDIA</p>
        <TypewriterHeadline />
        <p className="lead">
          Thoughtful design and dependable technology for freelancers, ambitious startups and established businesses.
        </p>
        <div className="actions">
          <Link className="btn primary" href="/contact/">Start a project ↗</Link>
          <Link className="text-link" href="/services/">Explore services</Link>
        </div>
        <div className="hero-note">Strategy · Design · Development · Technology</div>
      </section>

      <section className="band">
        <div className="wrap band-grid">
          <div>
            <p className="eyebrow">WHO I WORK WITH</p>
            <h2>Built around your<br />next chapter.</h2>
          </div>
          <div className="audience">
            <article><b>01 / FREELANCERS</b><h3>Look professional.<br />Win better work.</h3></article>
            <article><b>02 / STARTUPS</b><h3>Move from idea<br />to launch.</h3></article>
            <article><b>03 / CORPORATE</b><h3>Modernise and<br />scale with clarity.</h3></article>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <p className="eyebrow">WHAT I DO</p>
        <h2>Digital, made useful.</h2>
        <div className="cards">
          <Link href="/services/" className="service-card">
            <span>01</span><h3>Websites &amp; platforms</h3>
            <p>Fast, accessible websites and scalable digital platforms.</p>
          </Link>
          <Link href="/services/" className="service-card">
            <span>02</span><h3>Product &amp; UX design</h3>
            <p>Clear interfaces and thoughtful user experiences.</p>
          </Link>
          <Link href="/services/" className="service-card">
            <span>03</span><h3>Apps &amp; automation</h3>
            <p>Connected tools, integrations and smarter workflows.</p>
          </Link>
        </div>
      </section>

      <section className="cta">
        <div className="wrap cta-inner">
          <p className="eyebrow">HAVE A PROJECT IN MIND?</p>
          <h2>Let&apos;s make something<br />that moves you forward.</h2>
          <Link className="btn light" href="/contact/">Tell me about it ↗</Link>
        </div>
      </section>
    </main>
  );
}
