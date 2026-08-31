"use client";

import Link from "next/link";
import { useState } from "react";

const logo = "https://www.figma.com/api/mcp/asset/4828770a-dbca-448e-a831-7c4ec2975e54.png";

const links = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Services", "/#services"],
  ["Team", "/#team"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"],
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Elroi Hub home" onClick={() => setOpen(false)}>
          <img src={logo} alt="Elroi Hub" />
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </nav>

        <Link href="/schedule" className="header-cta" onClick={() => setOpen(false)}>
          Book a Call
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link href="/schedule" className="mobile-menu-cta" onClick={() => setOpen(false)}>
            Book a Call
          </Link>
        </div>
      )}
    </>
  );
}
