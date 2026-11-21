import Link from "next/link";

const links = [
  ["Home", "/"],
  ["Services", "/services/"],
  ["Who I help", "/who-we-help/"],
  ["Approach", "/approach/"],
  ["About", "/about/"],
  ["Contact", "/contact/"]
];

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <Link className="brand" href="/">MICHEAL<br />NORONHA</Link>
        <p>Independent digital work.<br />Thoughtfully made.</p>
        <div className="footer-links">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} MICHEAL NORONHA</span>
        <span className="made">
          BORN, BUILT &amp; MADE IN INDIA
          <b className="flag" aria-label="Indian flag">
            <i /><i className="chakra">✺</i><i />
          </b>
        </span>
      </div>
    </footer>
  );
}
