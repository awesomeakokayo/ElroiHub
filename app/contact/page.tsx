import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Elroi Hub for questions, quotes, or partnership inquiries. We reply within 24 hours.",
};

const socials = [
  ["Instagram", "@elroihub", "https://www.instagram.com/elroihub", "/assets/social-instagram.svg"],
  ["Twitter / X", "@elroihub", "https://x.com/elroihub", "/assets/social-x.svg"],
  ["LinkedIn", "Elroi Hub", "https://www.linkedin.com/company/elroihub", "/assets/social-linkedin.svg"],
  ["WhatsApp", "+234 801 234 5678", "https://wa.me/2348012345678", "/assets/social-whatsapp.svg"],
] as const;

const contactIcons = {
  email: "/assets/icon-email.svg",
  phone: "/assets/icon-phone.svg",
  location: "/assets/icon-location.svg",
  arrow: "/assets/icon-arrow.svg",
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
      <Footer />
    </main>
  );
}
