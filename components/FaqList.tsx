"use client";

import { useState } from "react";

const faqs = [
  ["What industries do you work with?", "We work with ambitious businesses across technology, professional services, retail, education, media, and other growth-focused industries."],
  ["How long does a typical project take?", "Most projects run from one to eight weeks depending on scope, approvals, and integrations. Ongoing retainers are planned month to month."],
  ["Do you offer one-off projects or only retainers?", "Both. One-off creative, branding, AI, and web projects are available alongside monthly growth retainers."],
  ["How do we get started?", "Choose a package or book a free strategy call. We will understand your goals, recommend the right next step, and send the required onboarding details."],
];

export default function FaqList() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq-list">
      {faqs.map(([question, answer], index) => (
        <div className={`faq-item ${open === index ? "open" : ""}`} key={question}>
          <button className="faq-button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>
            <span>{question}</span><span className="faq-icon">+</span>
          </button>
          {open === index && <div className="faq-answer">{answer}</div>}
        </div>
      ))}
    </div>
  );
}
