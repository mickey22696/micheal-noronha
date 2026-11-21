import OnboardingForm from "./OnboardingForm";

export const metadata = { title: "Start a Project" };

export default function OnboardPage() {
  return (
    <main className="portal-public">
      <div className="wrap portal-intro">
        <p className="eyebrow">CLIENT ONBOARDING</p>
        <h1>Let&apos;s get your<br /><span>project moving.</span></h1>
        <p className="lead">A few details help me understand your business, your goals and the support you need. You&apos;ll create your secure client account at the end.</p>
      </div>
      <OnboardingForm />
    </main>
  );
}
