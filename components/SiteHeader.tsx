"use client";

import Link from "next/link";
import { useState } from "react";

const logoMark = "https://www.figma.com/api/mcp/asset/d9ee00d7-ae74-4bd0-80d3-4bcc688e5dc6.png";
const logoWordmark = "https://www.figma.com/api/mcp/asset/e303a137-4bce-4592-96a5-bf26fab82ef4.png";

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
          <span
            className="brand-mark-wrap"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "31.3578%",
              aspectRatio: "40.138 / 74.588",
              overflow: "hidden",
            }}
          >
            <img
              className="brand-mark"
              src={logoMark}
              alt=""
              style={{
                position: "absolute",
                left: "-47.71%",
                top: "-107.99%",
                width: "361.12%",
                height: "291.37%",
                maxWidth: "none",
                objectFit: "fill",
              }}
            />
          </span>
          <img
            className="brand-wordmark"
            src={logoWordmark}
            alt="Elroi Hub"
            style={{
              position: "absolute",
              left: "31.3578%",
              top: "2.9079%",
              width: "68.6422%",
              height: "96.895%",
              objectFit: "fill",
            }}
          />
        </Link>
        <nav className="nav" aria-label="Primary navigation" style={{ lineHeight: "normal" }}>
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
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
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/schedule" className="mobile-menu-cta" onClick={() => setOpen(false)}>
            Book a Call
          </Link>
        </div>
      )}
    </>
  );
}
