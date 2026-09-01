"use client";

import Link from "next/link";

const logoMark = "/assets/logo-mark.png"; // figma d9ee00d7... — exact same as nav
const logoWordmark = "/assets/logo-wordmark.png"; // e303a137... — exact same as nav

export default function Footer() {
  return (
    <footer className="footer">
      <div className="ghost" aria-hidden="true">El Roi</div>
      <div className="footer-grid">
        <div className="footer-brand">
          <div
            className="footer-logo"
            aria-label="Elroi Hub"
            style={{ position: "relative", width: "clamp(170px, 13.8889vw, 240px)", aspectRatio: "240 / 142" }}
          >
            <span
              className="footer-logo-mark-wrap"
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
                className="footer-logo-mark"
                src={logoMark}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(e) => {
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
              className="footer-logo-wordmark"
              src={logoWordmark}
              alt="Elroi Hub"
              loading="lazy"
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
          </div>
          <p>Creative Excellence. Strategic Growth. Lasting Influence.</p>
          <p className="footer-copy">Privacy Policy | © 2026 Elroi Hub</p>
        </div>
        <div className="footer-links">
          <h4>COMPANY</h4>
          <Link href="/#home">Home</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#team">Team</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
