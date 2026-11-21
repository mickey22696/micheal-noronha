import SignInForm from "./SignInForm";
export const metadata = { title: "Client Sign In" };
export default function SignInPage() {
  return <main className="portal-public"><div className="wrap portal-intro compact"><p className="eyebrow">CLIENT PORTAL</p><h1>Welcome<br /><span>back.</span></h1><p className="lead">Sign in to see your services, projects and updates.</p></div><SignInForm /></main>;
}
