export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">ABOUT</p>
        <h1>Technology with<br /><span>people at the centre.</span></h1>
        <p className="lead">
          I&apos;m Micheal Noronha — an independent digital professional bringing together user experience, design and development to solve practical business problems.
        </p>
      </section>
      <section className="wrap section">
        <div className="about-panel">
          <p className="eyebrow">THE PRINCIPLE</p>
          <h2>Good digital work should feel simple to use, dependable to run and meaningful to the people it serves.</h2>
          <p>
            From a freelancer&apos;s first website to a startup&apos;s next product milestone or a company&apos;s digital improvement, the focus stays on clear communication and useful outcomes.
          </p>
        </div>
      </section>
    </main>
  );
}
