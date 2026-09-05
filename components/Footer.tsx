"use client";

import Image from "next/image";
import Link from "next/link";

const logoMark = "/assets/logo-mark.png";
const logoWordmark = "/assets/logo-wordmark.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div
        className="ghost"
        aria-hidden="true"
        style={{
          left: "50%",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          fontSize: "clamp(180px, 31vw, 520px)",
          lineHeight: 0.8,
          whiteSpace: "nowrap",
          transform: "translateX(-50%) scaleX(1.2)",
          transformOrigin: "center bottom",
        }}
      >
        El Roi
      </div>
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
              <Image
                className="footer-logo-mark"
                src={logoMark}
                alt=""
                fill
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
              className="footer-logo-wordmark-wrap"
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
                className="footer-logo-wordmark"
                src={logoWordmark}
                alt="Elroi Hub"
                fill
                sizes="200px"
                quality={70}
                style={{ objectFit: "fill" }}
              />
            </span>
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
