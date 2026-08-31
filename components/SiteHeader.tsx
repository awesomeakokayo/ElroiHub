"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Local assets (downloaded), keep Figma hotlinks as fallback via onError
const logoMark = "/assets/logo-mark.png"; // figma d9ee00d7...
const logoWordmark = "/assets/logo-wordmark.png"; // e303a137...

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
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sticky: switch from overlay translucent to solid after scrolling past hero (~80px)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock + Esc + focus trap
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const focusables = Array.from(menuRef.current.querySelectorAll<HTMLAnchorElement>("a[href], button"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // focus first link
    setTimeout(() => menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Effective overlay: translucent only at top over dark hero; after scroll, solid for visibility on white sections
  const effectiveOverlay = overlay && !scrolled && !open;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className={`site-header${effectiveOverlay ? " site-header--overlay" : ""} site-header--sticky`}>
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
              loading="eager"
              decoding="async"
              onError={(e) => {
                // fallback to Figma hotlink if local fails
                const t = e.currentTarget as HTMLImageElement;
                if (!t.dataset.fallback) {
                  t.dataset.fallback = "1";
                  t.src = "https://www.figma.com/api/mcp/asset/d9ee00d7-ae74-4bd0-80d3-4bcc688e5dc6.png";
                }
              }}
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
            loading="eager"
            decoding="async"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              if (!t.dataset.fallback) {
                t.dataset.fallback = "1";
                t.src = "https://www.figma.com/api/mcp/asset/e303a137-4bce-4592-96a5-bf26fab82ef4.png";
              }
            }}
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
          ref={buttonRef}
          type="button"
          className="mobile-menu-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      {open && (
        <>
          <div className="mobile-menu-backdrop" aria-hidden="true" onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 34, background: "rgba(0,0,0,0.4)" }} />
          <div ref={menuRef} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/schedule" className="mobile-menu-cta" onClick={() => setOpen(false)}>
              Book a Call
            </Link>
          </div>
        </>
      )}
    </>
  );
}
