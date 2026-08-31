import Link from "next/link";

const logoMark = "https://www.figma.com/api/mcp/asset/69692345-589e-49e1-82b7-f6d363c27f96.png";
const logoWordmark = "https://www.figma.com/api/mcp/asset/29cffe9a-5635-45a0-8ab6-8c746d7ba294.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="ghost">El Roi</div>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo" aria-label="Elroi Hub">
            <img className="footer-logo-mark" src={logoMark} alt="" aria-hidden="true" />
            <img className="footer-logo-wordmark" src={logoWordmark} alt="Elroi Hub" />
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
