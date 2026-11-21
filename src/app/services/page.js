import Link from "next/link";

export const metadata = { title: "Services" };

const services = [
  ["01", "Website design & development", "Responsive business websites, landing pages, portfolios and e-commerce experiences."],
  ["02", "UI/UX & product design", "User research, wireframes, interface design, design systems and prototypes."],
  ["03", "Web & mobile applications", "Purpose-built applications, dashboards, portals and MVPs."],
  ["04", "SaaS, APIs & integrations", "Connected products, backend integrations and subscription-ready platforms."],
  ["05", "Automation & growth systems", "Workflow automation, lead capture, CRM connections and operational tools."],
  ["06", "Cloud, DevOps & IT consulting", "Deployment workflows, hosting guidance, infrastructure and technical support."]
];

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">SERVICES</p>
        <h1>Everything digital.<br /><span>One clear direction.</span></h1>
        <p className="lead">
          A practical mix of design, development and technology to help your business move forward.
        </p>
      </section>
      <section className="wrap section">
        <div className="service-list">
          {services.map(([number, title, description]) => (
            <article key={number}>
              <b>{number}</b>
              <div><h2>{title}</h2><p>{description}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section className="cta">
        <div className="wrap cta-inner">
          <p className="eyebrow">LET&apos;S TALK</p>
          <h2>Have a challenge<br />worth solving?</h2>
          <Link className="btn light" href="/contact/">Start a conversation ↗</Link>
        </div>
      </section>
    </main>
  );
}
