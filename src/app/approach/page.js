export const metadata = { title: "Approach" };

const steps = [
  ["01", "Discover", "Understand your goals, audience, constraints and what success should look like."],
  ["02", "Plan & design", "Shape the scope, structure and experience before moving into development."],
  ["03", "Build & launch", "Develop, test and refine the solution with care, clarity and performance in mind."],
  ["04", "Improve", "Keep learning from real use and make thoughtful improvements as your needs evolve."]
];

export default function ApproachPage() {
  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">THE APPROACH</p>
        <h1>Clear thinking.<br /><span>Careful execution.</span></h1>
        <p className="lead">
          A collaborative process that keeps the goal visible from first conversation to launch and beyond.
        </p>
      </section>
      <section className="wrap section steps">
        {steps.map(([number, title, description]) => (
          <article key={number}>
            <b>{number}</b>
            <div><h2>{title}</h2><p>{description}</p></div>
          </article>
        ))}
      </section>
    </main>
  );
}
