import SiteHeader from "@/components/SiteHeader";
import ContactForm from "@/components/ContactForm";

const socials = [
  ["Instagram", "@elroihub", "https://www.instagram.com/elroihub", "https://www.figma.com/api/mcp/asset/1ec293ad-08e5-4315-bc0f-c07960a0ac3a.svg"],
  ["Twitter / X", "@elroihub", "https://x.com/elroihub", "https://www.figma.com/api/mcp/asset/1be57858-f558-44e6-83de-eeece590a66a.svg"],
  ["LinkedIn", "Elroi Hub", "https://www.linkedin.com/company/elroihub", "https://www.figma.com/api/mcp/asset/5d20fc6a-ec10-48bb-896c-e0b41ca83d3d.svg"],
  ["WhatsApp", "+234 801 234 5678", "https://wa.me/2348012345678", "https://www.figma.com/api/mcp/asset/321613bf-047a-4422-8326-9a933b8b92f4.svg"],
] as const;

const contactIcons = {
  email: "https://www.figma.com/api/mcp/asset/21424bac-60d6-4f03-b398-e3df1b7264f9.svg",
  phone: "https://www.figma.com/api/mcp/asset/06c00ca7-45b1-4110-a4e2-a18abfa7b0c8.svg",
  location: "https://www.figma.com/api/mcp/asset/7623bd5a-14e0-457d-8879-60402c250e57.svg",
  arrow: "https://www.figma.com/api/mcp/asset/d2e3a406-b097-4e4e-b33e-bcc822b3e343.svg",
};

export default function ContactPage() {
  return (
    <main className="inner-page contact-page">
      <SiteHeader />
      <div className="inner-head">
        <h1 className="section-title">Let's Build <span className="gold">Something Great</span></h1>
        <p className="inner-copy">
          Whether you have a question, need a quote, or just want to say hi, our team is ready to help you grow your digital presence.
        </p>
      </div>

      <div className="contact-layout">
        <ContactForm />

        <aside className="contact-info">
          <section className="info-card">
            <h3>Contact Info</h3>
            <div className="info-row">
              <div className="info-icon"><img src={contactIcons.email} alt="" /></div>
              <div><strong>hello@elroihub.com</strong><small>We reply within 24 hours</small></div>
            </div>
            <div className="info-row">
              <div className="info-icon"><img src={contactIcons.phone} alt="" /></div>
              <div><strong>+234 801 234 5678</strong><small>Mon–Fri, 9am–6pm WAT</small></div>
            </div>
            <div className="info-row">
              <div className="info-icon"><img src={contactIcons.location} alt="" /></div>
              <div><strong>Lagos, Nigeria</strong><small>Remote-first · Global clients</small></div>
            </div>
          </section>

          <section className="social-card">
            <h3>Follow Us</h3>
            {socials.map(([name, handle, url, icon]) => (
              <a className="social-link" href={url} target="_blank" rel="noreferrer" key={name}>
                <img className="social-icon" src={icon} alt="" />
                <span><b>{name}</b><small>{handle}</small></span>
                <img className="arrow" src={contactIcons.arrow} alt="" />
              </a>
            ))}
          </section>

          <section className="hours-card">
            <h3>Working Hours</h3>
            <div className="hours-row"><span>Monday – Friday</span><strong>9:00 AM – 6:00 PM</strong></div>
            <div className="hours-row"><span>Saturday</span><strong>10:00 AM – 3:00 PM</strong></div>
            <div className="hours-row"><span>Sunday</span><strong>Closed</strong></div>
            <small className="hours-note">All times in West Africa Time (WAT / UTC+1)</small>
          </section>
        </aside>
      </div>
    </main>
  );
}
