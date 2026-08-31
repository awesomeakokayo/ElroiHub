"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/contact", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success"); setMessage("Thanks. Your message has been sent to Elroi Hub."); event.currentTarget.reset();
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Something went wrong."); }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <h2 className="panel-title">Send us a Message</h2>
      <div className="form-shell">
        <label className="field" htmlFor="cf-name"><span>Full Name *</span><input id="cf-name" name="name" required placeholder="Adaeze Okonkwo" autoComplete="name" maxLength={80} /></label>
        <label className="field" htmlFor="cf-email"><span>Email Address *</span><input id="cf-email" type="email" name="email" required placeholder="adaeze@brand.com" autoComplete="email" maxLength={254} /></label>
        <label className="field" htmlFor="cf-phone"><span>Phone Number</span><input id="cf-phone" name="phone" placeholder="+234 801 234 5678" autoComplete="tel" maxLength={20} inputMode="tel" /></label>
        <label className="field" htmlFor="cf-service"><span>Service Interested In</span>
          <select id="cf-service" name="service" defaultValue=""><option value="" disabled>Select a service…</option><option>AI Solutions</option><option>Branding & Identity</option><option>Web Development</option><option>Media & Content Production</option><option>Business Process Optimization</option></select>
        </label>
      </div>
      <label className="field" htmlFor="cf-subject"><span>Subject</span><input id="cf-subject" name="subject" placeholder="How can we help you?" maxLength={120} /></label>
      <label className="field" htmlFor="cf-message"><span>Message *</span><textarea id="cf-message" name="message" required placeholder="Tell us about your project, goals, or any questions you have…" maxLength={5000} rows={5} /></label>
      <button className="submit" disabled={status === "sending"} aria-busy={status === "sending"}>{status === "sending" ? "Sending…" : "Send Message →"}</button>
      <div role="status" aria-live="polite" aria-atomic="true" style={{ marginTop: 12 }}>
        {message && <div className={status === "success" ? "success" : "error"} style={{ padding: "10px 12px", borderRadius: 10, background: status === "success" ? "#f0faf0" : "#fdf0f0", color: status === "success" ? "#1a3d1a" : "#7a1a1a", border: `1px solid ${status === "success" ? "#b7ddb7" : "#e7b7b7"}` }}>{message}</div>}
      </div>
    </form>
  );
}
