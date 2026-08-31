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
    <form className="contact-form" onSubmit={submit}>
      <h2 className="panel-title">Send us a Message</h2>
      <div className="form-shell">
        <label className="field"><span>Full Name *</span><input name="name" required placeholder="Adaeze Okonkwo" /></label>
        <label className="field"><span>Email Address *</span><input type="email" name="email" required placeholder="adaeze@brand.com" /></label>
        <label className="field"><span>Phone Number</span><input name="phone" placeholder="+234 801 234 5678" /></label>
        <label className="field"><span>Service Interested In</span>
          <select name="service" defaultValue=""><option value="" disabled>Select a service…</option><option>AI Solutions</option><option>Branding & Identity</option><option>Web Development</option><option>Media & Content Production</option><option>Business Process Optimization</option></select>
        </label>
      </div>
      <label className="field"><span>Subject</span><input name="subject" placeholder="How can we help you?" /></label>
      <label className="field"><span>Message *</span><textarea name="message" required placeholder="Tell us about your project, goals, or any questions you have…" /></label>
      <button className="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Message →"}</button>
      {message && <div className={status === "success" ? "success" : "error"}>{message}</div>}
    </form>
  );
}
