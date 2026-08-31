import Link from "next/link";

const logo = "https://www.figma.com/api/mcp/asset/4018eafa-a81e-4c64-8f60-803405790ed0.png";

export default function Footer(){
 return <footer className="footer"><div className="ghost">El Roi</div><div className="footer-grid"><div className="footer-brand"><img src={logo} alt="Elroi Hub"/><p>Creative Excellence. Strategic Growth. Lasting Influence.</p><p className="footer-copy">Privacy Policy | © 2026 Elroi Hub</p></div><div className="footer-links"><h4>COMPANY</h4><Link href="/#home">Home</Link><Link href="/#services">Services</Link><Link href="/#team">Team</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link></div></div></footer>;
}
