export const metadata = { title: "Who I Help" };

const audiences = [
  ["01 / FREELANCERS", "Make your work stand out.", "Personal websites, portfolios and simple systems that help you present your value and attract the right clients."],
  ["02 / STARTUPS", "Turn momentum into product.", "From early concepts and MVPs to launch-ready websites, product design and connected workflows."],
  ["03 / CORPORATE", "Make complexity clearer.", "Modern web experiences, internal tools, integrations and technology improvements for growing teams."]
];

export default function WhoWeHelpPage() {
  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">WHO I HELP</p>
        <h1>Different journeys.<br /><span>Shared ambition.</span></h1>
        <p className="lead">
          Digital support shaped around where you are today — and where you want to go next.
        </p>
      </section>
      <section className="wrap section cards">
        {audiences.map(([eyebrow, title, description]) => (
          <article className="service-card" key={eyebrow}>
            <span>{eyebrow}</span><h2>{title}</h2><p>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
