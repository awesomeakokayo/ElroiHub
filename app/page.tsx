import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FaqList from "@/components/FaqList";

// These are the current Figma-exported assets referenced by the design frames.
const heroBg = "https://www.figma.com/api/mcp/asset/eabb916d-d76e-4bf8-acfb-caf7c5fe115c.png";
const cta = "https://www.figma.com/api/mcp/asset/85b414a2-9786-4234-8ff0-e6f279edb9d8.png";
const whyImageA = "https://www.figma.com/api/mcp/asset/1ee4af42-5f98-4768-90cd-77d66d0d9d75.png";
const whyImageB = "https://www.figma.com/api/mcp/asset/58b8423b-974e-4b16-b17c-6caa5770d5c5.png";
const iconBadge = "https://www.figma.com/api/mcp/asset/439fc6bf-200f-4521-90d6-2f87fe01ed10.png";
const iconFilm = "https://www.figma.com/api/mcp/asset/28e468e2-54c5-4fee-91b0-9fd62d0e3877.svg";
const iconMarketing = "https://www.figma.com/api/mcp/asset/3a50cbd5-ce9a-4890-b821-0664dc4fc217.svg";
const iconWeb = "https://www.figma.com/api/mcp/asset/9f742fc8-9cd3-4233-8981-24026f576252.svg";
const iconAi = "https://www.figma.com/api/mcp/asset/ea32e200-637c-46cf-877e-1a6c93bc0691.svg";
const processDot = "https://www.figma.com/api/mcp/asset/3c0c359a-829d-4840-920f-140adee139b8.svg";

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
    "https://www.figma.com/api/mcp/asset/d9f78600-fec6-44d2-bf77-0728bfa35ab1.png",
    "“At Elroi Hub, we combine creativity, technology, and AI to help businesses grow, operate smarter, and achieve measurable results. Our goal is simple: build solutions that create real value and lasting impact.”",
  ],
  [
    "COO - Lenny Preye",
    "https://www.figma.com/api/mcp/asset/681bd80c-24d0-4ea4-8471-f26ea79a5f43.png",
    "At Elroi Hub, I focus on turning vision into consistent execution aligning our teams, systems, and AI powered processes so every project delivers measurable growth and lasting results for our clients.",
  ],
  [
    "CMO - Favour Owens",
    "https://www.figma.com/api/mcp/asset/b774425f-7a57-46c6-8897-0d7efe4676b8.png",
    "“Brand identity goes far beyond consistency. It is the strategic process of building a distinct presence, creating meaningful connections, and sustaining a brand through purpose, dedication, and commitment. At Elroi Hub, we are committed to transforming ideas into impactful brands through strategic planning, creativity, and collaboration.”",
  ],
  [
    "Okorosa Asemebo Goodness - AI Research Lead.",
    "https://www.figma.com/api/mcp/asset/24aec887-7a2e-480f-bc2c-a680aa378d5e.png",
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
          <div className="hero-bg" style={{ backgroundImage: `url('${heroBg}')` }} />
          <div className="hero-overlay" aria-hidden="true" />
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
                <img className="avatar" src={img} alt="" />
                <p className="quote">{quote}</p>
                <p className="member-name">{name}</p>
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
