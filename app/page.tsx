import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FaqList from "@/components/FaqList";

const hero = "https://www.figma.com/api/mcp/asset/7a63ec39-fb54-4408-ac23-589be2f8e8e7.png";
const trust = "https://www.figma.com/api/mcp/asset/f5972e06-13cf-4a09-b014-70af298a8289.png";
const creative = "https://www.figma.com/api/mcp/asset/468faa6a-bc9a-41ce-afb9-65a783e343e6.png";
const cta = "https://www.figma.com/api/mcp/asset/53b3c401-8a29-4857-b62c-85d6fd8ece9d.png";

const services = [
  ["Media & Content Production", "Professional video editing, graphic design, content creation, and social media management.", true],
  ["Branding & Identity", "Distinct, memorable brand systems that earn trust.", false],
  ["Business Process Optimization", "Using technology and streamlined workflows to improve efficiency and productivity.", false],
  ["Artificial Intelligence Solutions", "Building AI-powered systems, automations, and business solutions.", true],
] as const;

const why = [
  ["Creative Excellence", "We don't just execute, we craft work that stands out.", creative, "why-green"],
  ["Long-Term Trust", "We build influence that compounds, not campaigns that fade.", trust, "why-gold"],
  ["Performance-Driven Marketing", "Growth isn't a guess. We measure what matters.", creative, "why-gold performance"],
  ["Strategic Content", "Every piece of content is built with purpose and performance in mind.", trust, "why-green tall-copy"],
] as const;

const team = [
  ["Kingdavid Patrick", "CEO", "https://www.figma.com/api/mcp/asset/70d08b1f-f9f0-4c81-a9eb-9cf76c8b5c39.png", "At Elroi Hub, we combine creativity, technology, and AI to help businesses grow, operate smarter, and achieve measurable results."],
  ["Lenny Preye", "COO", "https://www.figma.com/api/mcp/asset/de18c863-2dd1-469a-bde7-af35de591c66.png", "I focus on turning vision into consistent execution, aligning teams, systems, and AI-powered processes for measurable growth."],
  ["Favour Owens", "CMO", "https://www.figma.com/api/mcp/asset/0f94c152-bd57-4f79-aba7-42ef7d067ece.png", "Brand identity goes beyond consistency. We build distinct presence, meaningful connections, and brands sustained through purpose and collaboration."],
  ["Goodness Okorosao", "HOD Research & AI Lead", "https://www.figma.com/api/mcp/asset/d445afec-c198-4efe-9346-8e0f604ac295.png", "The future of AI belongs to people who understand how to direct intelligence and turn it into execution."],
] as const;

export default function Home(){
 return <>
  <header id="home"><SiteHeader/></header>
  <main>
    <section className="hero">
      <div className="hero-bg" aria-hidden="true"/><div className="hero-overlay" aria-hidden="true"/>
      <div className="hero-content"><h1>Built for Brands That Refuse to <span className="gold">Blend</span> In.</h1><p>Creative. Strategic. Built to dominate.</p><div className="hero-actions"><Link href="/schedule" className="btn btn-gold">Get Started</Link><a href="#services" className="btn btn-outline">What We Do</a></div></div>
    </section>

    <section id="about" className="section about section-pad"><div className="content"><div className="section-kicker">About Us</div><h2 className="section-title"><span className="gold">Who</span> Are <span className="gold">We?</span></h2><p className="section-copy">Elroi Hub is a world-class digital growth agency helping brands across industries build lasting influence and trust. We combine creative excellence, strategic content, and performance-driven marketing to turn visibility into market dominance for businesses ready to lead, not follow.</p></div></section>

    <section id="services" className="section dark services section-pad"><div className="ghost">WHAT</div><div className="content"><div className="section-kicker">Services</div><h2 className="section-title"><span className="gold">What</span> We <span className="gold">Do?</span></h2><div className="service-grid">{services.map(([title,copy,isGold])=><article key={title} className={`service-card ${isGold?"gold-card":"white-card"}`}><div className="icon-badge"/><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="section why section-pad"><div className="ghost">WHY</div><div className="content"><div className="section-kicker">Why Brands Choose Us</div><h2 className="section-title"><span className="gold">Why</span> ElRoi Hub</h2><div className="why-grid">{why.map(([title,copy,image,cls])=><article key={title} className={`why-card ${cls}`}><img src={image} alt=""/><div className="tint"/><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="section dark section-pad team" id="team"><div className="ghost">OUR TEAM</div><div className="team-title"><div className="section-kicker">Meet the Team</div><h2 className="section-title">The <span className="gold">People</span> Behind the <span className="gold">Growth.</span></h2></div><div className="team-grid">{team.map(([name,role,img,quote])=><article className="team-member" key={name}><img className="avatar" src={img} alt={name}/><div><p className="quote">“{quote}”</p><p className="member-name">{name} — {role}</p></div></article>)}</div></section>

    <section className="section dark section-pad" style={{paddingTop:120,paddingBottom:140}}><div className="ghost">HOW</div><div className="content"><div className="section-kicker">Our Process</div><h2 className="section-title"><span className="gold">How</span> We <span className="gold">Work</span></h2><div className="why-grid process-grid"><article className="why-card" style={{background:"#ff9680",color:"#5c0d00"}}><h3>Discover</h3><p>We learn your brand, market, and goals.</p></article><article className="why-card" style={{background:"#d0a1d7",color:"#5c016a"}}><h3>Strategize</h3><p>We build a roadmap for visibility and growth.</p></article><article className="why-card" style={{background:"#7d732b"}}><h3 className="gold">Execute</h3><p>Creative, content, and campaigns come to life.</p></article><article className="why-card" style={{background:"#246129"}}><h3 className="gold">Scale</h3><p>We optimize and grow what's working.</p></article></div></div></section>

    <section className="section dark faq section-pad"><div className="ghost">FAQ</div><div className="content"><h2 className="section-title"><span className="gold">Frequently Asked</span> Questions</h2><FaqList/></div></section>

    <section className="cta"><img src={cta} alt=""/><div className="cta-content"><h2>Ready to Build <span className="gold">Influence</span> That <span className="gold">Lasts?</span></h2><Link href="/schedule" className="btn btn-gold">Book a Free Strategy Call</Link></div></section>
  </main>
  <Footer/>
 </>;
}
