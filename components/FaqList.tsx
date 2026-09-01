"use client";

import { useState } from "react";

const faqs = [
  ["What industries do you work with?", "We work with ambitious businesses across technology, professional services, retail, education, media, and other growth-focused industries."],
  ["How long does a typical project take?", "Most projects run from one to eight weeks depending on scope, approvals, and integrations. Ongoing retainers are planned month to month."],
  ["Do you offer one-off projects or only retainers?", "Both. One-off creative, branding, AI, and web projects are available alongside monthly growth retainers."],
  ["How do we get started?", "Choose a package or book a free strategy call. We will understand your goals, recommend the right next step, and send the required onboarding details."],
];

function FaqPlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .28s ease" }}>
      <circle cx="30" cy="30" r="29" stroke="#246129" strokeWidth="2" fill="none" />
      <line x1="30" y1="18" x2="30" y2="42" stroke="#246129" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="30" x2="42" y2="30" stroke="#246129" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function FaqList() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {faqs.map(([question, answer], index) => {
        const isOpen = open === index;
        const btnId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;
        return (
        <div className={`faq-item ${isOpen ? "open" : ""}`} key={question}>
          <button
            id={btnId}
            className="faq-button"
            onClick={() => setOpen(isOpen ? null : index)}
            aria-expanded={isOpen}
            aria-controls={panelId}
          >
            <span>{question}</span>
            <span className="faq-icon" aria-hidden="true">
              <FaqPlusIcon isOpen={isOpen} />
            </span>
          </button>
          <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen} className="faq-answer">
            {answer}
          </div>
        </div>
        );
      })}
    </div>
  );
}
