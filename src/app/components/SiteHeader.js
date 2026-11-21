"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Home", "/"],
  ["Services", "/services/"],
  ["Who I help", "/who-we-help/"],
  ["Approach", "/approach/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
  ["Get started", "/onboard/"]
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="tricolor" aria-hidden="true">
        <i /><i /><i />
      </div>
      <header className="header wrap">
        <Link className="brand brand-animated" href="/" aria-label="Micheal Noronha home">
          <span>MICHEAL</span>
          <span>NORONHA</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
        <nav className={`nav${open ? " open" : ""}`} aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={href === "/onboard/" ? "nav-cta" : undefined} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
