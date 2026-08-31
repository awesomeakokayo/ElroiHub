import Link from "next/link";

const logo = "https://www.figma.com/api/mcp/asset/4828770a-dbca-448e-a831-7c4ec2975e54.png";
const leaf = "https://www.figma.com/api/mcp/asset/4018eafa-a81e-4c64-8f60-803405790ed0.png";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Elroi Hub home">
        <img src={logo} alt="Elroi Hub" />
        <img src={leaf} alt="" aria-hidden="true" style={{ display: "none" }} />
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/#home">Home</Link>
        <Link href="/#about">About</Link>
        <Link href="/#services">Services</Link>
        <Link href="/#team">Team</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <Link href="/schedule" className="header-cta">Book a Call</Link>
    </header>
  );
}
