import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FaqList from "@/components/FaqList";

const heroBg = "https://www.figma.com/api/mcp/asset/72fb9b36-08eb-44c7-bf21-b99697247c9e.png";
const cta = "https://www.figma.com/api/mcp/asset/53515314-cf7a-4f6e-877d-c28e64153217.png";
const whyImageA = "https://www.figma.com/api/mcp/asset/1dbf97d4-92db-4d12-843b-33dc4dbb6baf.png";
const whyImageB = "https://www.figma.com/api/mcp/asset/17fd01f7-3b8a-4676-83d8-4f997f3c8f17.png";
const iconBadge = "https://www.figma.com/api/mcp/asset/8916cb97-cfc3-44a7-a0a5-f379d6d3b2e8.svg";
const iconFilm = "https://www.figma.com/api/mcp/asset/2e8229a0-4145-45d3-a93c-600411eb3d04.svg";
const iconMarketing = "https://www.figma.com/api/mcp/asset/70ae261b-e7d1-4a89-aa62-eaa28c87c7b8.svg";
const iconWeb = "https://www.figma.com/api/mcp/asset/85a8d5f7-3b48-4ddd-a972-541c9f1d2698.svg";
const iconAi = "https://www.figma.com/api/mcp/asset/8aa2d47e-d682-4fe2-8428-d6506d167245.svg";
const processDot = "https://www.figma.com/api/mcp/asset/8911b9f8-c912-493c-b92e-59ba307ab83c.svg";

const services = [
  ["Media & Content Production", "Professional video editing, graphic design, content creation, and social media management.", true, iconFilm],
  ["Branding & Identity", "Distinct, memorable brand systems that earn trust.", false, iconWeb],
  ["Business Process Optimization", "Using technology and streamlined workflows to improve efficiency and productivity.", false, iconMarketing],
  ["Artificial Intelligence Solutions", "Building AI-powered systems, automations, and business solutions.", true, iconAi],
] as const;

const why = [
  ["Creative Excellence", "We don't just execute, we craft work that stands out.", whyImageA, "why-creative"],
  ["Long-Term Trust", "We build influence that compounds, not campaigns that fade.", whyImageB, "why-trust"],
  ["Performance-Driven Marketing", "Growth isn't a guess. We measure what matters.", whyImageA, "why-performance"],
  ["Strategic Content", "Every piece of content is built with purpose and performance in mind.", whyImageB, "why-strategic"],
] as const;

const team = [
  [
    "CEO — Kingdavid",
    "https://www.figma.com/api/mcp/asset/fb5359b6-f782-4998-8424-955a6d4afe73.png",
    "“At Elroi Hub, we combine creativity, technology, and AI to help businesses grow, operate smarter, and achieve measurable results. Our goal is simple: build solutions that create real value and lasting impact.”",
  ],
  [
    "COO - Lenny Preye",
    "https://www.figma.com/api/mcp/asset/0a2ec82a-d40a-413f-89bb-00d8d6c1ac16.png",
    "At Elroi Hub, I focus on turning vision into consistent execution aligning our teams, systems, and AI powered processes so every project delivers measurable growth and lasting results for our clients.",
  ],
  [
    "CMO - Favour Owens",
    "https://www.figma.com/api/mcp/asset/e0c2efa9-8c84-40c7-b378-12f7c2fb083f.png",
    "“Brand identity goes far beyond consistency. It is the strategic process of building a distinct presence, creating meaningful connections, and sustaining a brand through purpose, dedication, and commitment. At Elroi Hub, we are committed to transforming ideas into impactful brands through strategic planning, creativity, and collaboration.”",
  ],
  [
    "Okorosa Asemebo Goodness - AI Research Lead",
    "https://www.figma.com/api/mcp/asset/621e220d-e002-4ae5-9d99-4e035a826142.png",
    "“The future of AI will not belong to those who merely have access to powerful tools, but to those who understand how to think with them, direct them, and turn intelligence into execution. PromptForge AI is where that transformation begins.”",
  ],
] as const;

const processSteps = [
  ["Discover", "We learn your brand, market, and goals.", "process-discover"],
  ["Strategize", "We build a roadmap for visibility and growth.", "process-strategize"],
  ["Execute", "Creative, content, and campaigns come to life.", "process-execute"],
  ["Scale", "We optimize and grow what's working.", "process-scale"],
] as const;

export default function Home() {
  return (
    <>
      <header id="home"><SiteHeader /></header>
      <main>
        <section className="hero">
          <div className="hero-bg" style={{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.12),rgba(0,0,0,.02) 64%,rgba(0,0,0,.13)),url('${heroBg}')` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>Built for Brands That Refuse to <span className="gold">Blend</span> In.</h1>
            <p>Creative. Strategic. Built to dominate.</p>
            <div className="hero-actions">
              <Link href="/schedule" className="btn btn-gold">Get Started</Link>
              <a href="#services" className="btn btn-outline">What We Do</a>
            </div>
          </div>
        </section>

        <section id="about" className="section about section-pad">
          <div className="content">
            <div className="section-kicker">About Us</div>
            <h2 className="section-title"><span className="gold">Who</span> Are <span className="gold">We?</span></h2>
            <p className="section-copy">Elroi Hub is a world-class digital growth agency helping brands across industries build lasting influence and trust. We combine creative excellence, strategic content, and performance-driven marketing to turn visibility into market dominance for businesses ready to lead, not follow.</p>
          </div>
        </section>

        <section id="services" className="section dark services section-pad">
          <div className="ghost">WHAT</div>
          <div className="content">
            <div className="section-kicker">Services</div>
            <h2 className="section-title"><span className="gold">What</span> We <span className="gold">Do?</span></h2>
            <div className="service-grid">
              {services.map(([title, copy, isGold, icon]) => (
                <article key={title} className={`service-card ${isGold ? "gold-card" : "white-card"}`}>
                  <div className="icon-badge">
                    <img src={iconBadge} alt="" className="icon-badge-bg" />
                    <img src={icon} alt="" className="icon-badge-glyph" />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section why section-pad">
          <div className="ghost">WHY</div>
          <div className="content">
            <div className="section-kicker">Why Brands Choose Us</div>
            <h2 className="section-title why-title"><span className="gold">Why</span> ElRoi Hub</h2>
            <div className="why-grid">
              {why.map(([title, copy, image, cls]) => (
                <article key={title} className={`why-card ${cls}`}>
                  <img src={image} alt="" className="why-card-art" />
                  <div className="why-card-copy">
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section dark section-pad" id="process">
          <div className="ghost">HOW</div>
          <div className="content">
            <div className="section-kicker">Our Process</div>
            <h2 className="section-title process-title"><span className="gold">How</span> <span className="process-we">We</span> <span className="gold">Work</span></h2>
            <div className="process-grid">
              {processSteps.map(([title, copy, cls]) => (
                <article key={title} className={`process-card ${cls}`}>
                  <span className="process-dot process-dot-tl"><img src={processDot} alt="" /></span>
                  <span className="process-dot process-dot-tr"><img src={processDot} alt="" /></span>
                  <span className="process-dot process-dot-bl"><img src={processDot} alt="" /></span>
                  <span className="process-dot process-dot-br"><img src={processDot} alt="" /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section dark section-pad team" id="team">
          <div className="ghost">OUR TEAM</div>
          <div className="team-title">
            <div className="section-kicker">Meet the Team</div>
            <h2 className="section-title">The <span className="gold">People</span> Behind the <span className="gold">Growth.</span></h2>
          </div>
          <div className="team-grid">
            {team.map(([name, img, quote]) => (
              <article className="team-member" key={name}>
                <img className="avatar" src={img} alt={name} />
                <div>
                  <p className="quote">{quote}</p>
                  <p className="member-name">{name}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section dark faq section-pad">
          <div className="ghost">FAQ</div>
          <div className="content">
            <h2 className="section-title faq-title">Frequently Asked <span className="gold">Questions</span></h2>
            <FaqList />
          </div>
        </section>

        <section className="cta">
          <img src={cta} alt="" />
          <div className="cta-content">
            <h2>Ready to Build <span className="gold">Influence</span> That <span className="gold">Lasts?</span></h2>
            <p className="cta-subtitle">Let&apos;s turn your brand&apos;s vision into market dominance.</p>
            <Link href="/schedule" className="btn btn-gold">Book a Free Strategy Call</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
