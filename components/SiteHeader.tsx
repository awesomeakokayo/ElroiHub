"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Local assets (downloaded), rendered through Next Image so the browser receives optimized AVIF/WebP variants.
const logoMark = "/assets/logo-mark.png";
const logoWordmark = "/assets/logo-wordmark.png";

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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("/#home");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateActive = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === "/pricing") { setActiveHref("/pricing"); return; }
      if (path === "/contact") { setActiveHref("/contact"); return; }
      if (path === "/schedule") { setActiveHref("/contact"); return; }
      if (hash) { setActiveHref(`/${hash}`); return; }
      if (path === "/") {
        const ids = ["home", "about", "services", "team"];
        let current = "/#home";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) current = `/#${id}`;
        }
        setActiveHref(current);
        return;
      }
      setActiveHref(path);
    };
    updateActive();
    window.addEventListener("hashchange", updateActive);
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => {
      window.removeEventListener("hashchange", updateActive);
      window.removeEventListener("scroll", updateActive);
    };
  }, [pathname]);

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
    setTimeout(() => menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const effectiveOverlay = overlay && !open;

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
            <Image
              className="brand-mark"
              src={logoMark}
              alt=""
              fill
              priority
              sizes="40px"
              quality={70}
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
          <span
            className="brand-wordmark-wrap"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "31.3578%",
              top: "2.9079%",
              width: "68.6422%",
              height: "96.895%",
            }}
          >
            <Image
              className="brand-wordmark"
              src={logoWordmark}
              alt="Elroi Hub"
              fill
              priority
              sizes="88px"
              quality={70}
              style={{ objectFit: "fill" }}
            />
          </span>
        </Link>
        <nav className="nav" aria-label="Primary navigation" style={{ lineHeight: "normal" }}>
          {links.map(([label, href]) => {
            const isActive = activeHref === href || (href === "/#home" && activeHref === "/") || (href === "/#home" && activeHref === "/#home");
            return (
              <Link
                key={label}
                href={href}
                onClick={() => { setActiveHref(href); setOpen(false); }}
                className={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
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
            {links.map(([label, href]) => {
              const isActive = activeHref === href || (href === "/#home" && activeHref === "/") || (href === "/#home" && activeHref === "/#home");
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => { setActiveHref(href); setOpen(false); }}
                  className={isActive ? "active" : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
            <Link href="/schedule" className="mobile-menu-cta" onClick={() => setOpen(false)}>
              Book a Call
            </Link>
          </div>
        </>
      )}
    </>
  );
}
