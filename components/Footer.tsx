import Link from "next/link";

const logoMark = "/assets/footer-mark.png"; // figma 69692345...
const logoWordmark = "/assets/footer-wordmark.png"; // 29cffe9a...

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
            <img
              className="footer-logo-mark"
              src={logoMark}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", left: 0, top: 0, width: "31.315%", height: "98.35%", objectFit: "cover" }}
            />
            <img
              className="footer-logo-wordmark"
              src={logoWordmark}
              alt="Elroi Hub"
              style={{ position: "absolute", left: "31.315%", top: "2.92%", width: "68.52%", height: "97.1%", objectFit: "contain" }}
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
