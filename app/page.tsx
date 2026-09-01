import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FaqList from "@/components/FaqList";

// Local assets (downloaded from Figma MCP for offline/performant loading). Figma hotlinks kept as fallback comments.
// heroBg figma: fd3e254e-d300-40c8-ab6a-e9a061b9de12.png — local: /assets/hero-bg.png
const heroBg = "/assets/hero-bg.png";
const cta = "/assets/cta.png"; // figma 85b414a2...
const whyImageA = "/assets/why-a.png"; // 1ee4af42...
const whyImageB = "/assets/why-b.png"; // 58b8423b...
const iconBadge = "/assets/icon-badge.svg"; // dd3238bb...
const iconFilm = "/assets/icon-film.svg"; // 7398d77e...
const iconMarketing = "/assets/icon-marketing.svg"; // 5defbb61...
const iconWeb = "/assets/icon-web.svg"; // 9a82ef04...
const iconAi = "/assets/icon-ai.svg"; // 9fac8c58...
const processDot = "/assets/dot.svg"; // 3c0c359a...

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
    "/assets/team-ceo.png", // figma d9f78600...
    "“At Elroi Hub, we combine creativity, technology, and AI to help businesses grow, operate smarter, and achieve measurable results. Our goal is simple: build solutions that create real value and lasting impact.”",
  ],
  [
    "COO - Lenny Preye",
    "/assets/team-coo.png", // 681bd80c...
    "At Elroi Hub, I focus on turning vision into consistent execution aligning our teams, systems, and AI powered processes so every project delivers measurable growth and lasting results for our clients.",
  ],
  [
    "CMO - Favour Owens",
    "/assets/team-cmo.png", // b774425f...
    "“Brand identity goes far beyond consistency. It is the strategic process of building a distinct presence, creating meaningful connections, and sustaining a brand through purpose, dedication, and commitment. At Elroi Hub, we are committed to transforming ideas into impactful brands through strategic planning, creativity, and collaboration.”",
  ],
  [
    "Okorosa Asemebo Goodness - AI Research Lead.",
    "/assets/team-ai.png", // 24aec887...
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
      <div id="home"><SiteHeader /></div>
      <main id="main-content">
        <section className="hero" aria-label="Hero">
          <div className="hero-bg" style={{ backgroundImage: `url('${heroBg}')` }} role="img" aria-label="Elroi Hub hero" />
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
          <div className="ghost" aria-hidden="true">WHAT</div>
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
          <div className="ghost" aria-hidden="true">WHY</div>
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
          <div className="ghost" aria-hidden="true">HOW</div>
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

        <section className="section team-ghost-section" aria-hidden="true">
          <div className="team-ghost-text">OUR TEAM</div>
        </section>

        <section className="section dark section-pad team" id="team">
          <div className="team-title">
            <div className="section-kicker">Meet the Team</div>
            <h2 className="section-title">The <span className="gold">People</span> Behind the <span className="gold">Growth.</span></h2>
          </div>
          <div className="team-grid">
            {team.map(([name, img, quote]) => (
              <article className="team-member" key={name}>
                <img className="avatar" src={img} alt="" />
                <div className="team-member-copy">
                  <p className="quote">{quote}</p>
                  <p className="member-name">{name}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section faq-ghost-section" aria-hidden="true">
          <div className="faq-ghost-text">FAQ</div>
        </section>

        <section className="section dark faq section-pad">
          <div className="ghost" aria-hidden="true">FAQ</div>
          <div className="content">
            <h2 className="section-title faq-title">Frequently Asked <span className="gold">Questions</span></h2>
            <FaqList />
          </div>
        </section>

        <section className="cta" aria-label="Call to action">
          <div className="cta-content">
            <div className="cta-img-wrap">
              <img src={cta} alt="Elroi Hub creative workspace" loading="lazy" decoding="async" />
            </div>
            <div className="cta-text">
              <h2>Ready to Build <span className="gold">Influence</span> That <span className="gold">Lasts?</span></h2>
              <p className="cta-subtitle">Let&apos;s turn your brand&apos;s vision into market dominance.</p>
              <Link href="/schedule" className="btn btn-gold">Book a Free Strategy Call</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
