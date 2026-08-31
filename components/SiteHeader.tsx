"use client";

import Link from "next/link";
import { useState } from "react";

const logo = "https://www.figma.com/api/mcp/asset/8e517b34-050b-4089-bfe8-f20d23c31f32.png";

const links = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Services", "/#services"],
  ["Team", "/#team"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"],
] as const;

type SiteHeaderProps = {
  overlay?: boolean;
};

export default function SiteHeader({ overlay = true }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={`site-header${overlay ? " site-header--overlay" : ""}`}>
        <Link href="/" className="brand" aria-label="Elroi Hub home" onClick={() => setOpen(false)}>
          <img src={logo} alt="Elroi Hub" />
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
        </nav>
        <Link href="/schedule" className="header-cta" onClick={() => setOpen(false)}>Book a Call</Link>
        <button type="button" className="mobile-menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(v => !v)}>
          <span /><span /><span />
        </button>
      </header>
      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          {links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href="/schedule" className="mobile-menu-cta" onClick={() => setOpen(false)}>Book a Call</Link>
        </div>
      )}
    </>
  );
}
