"use client";

import { useState } from "react";

const faqPlus = "/assets/plus.svg"; // figma 28e468e2...

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
              <img src={faqPlus} alt="" onError={(e)=>{const t=e.currentTarget as HTMLImageElement; if(!t.dataset.fallback){t.dataset.fallback="1"; t.src="https://www.figma.com/api/mcp/asset/28e468e2-54c5-4fee-91b0-9fd62d0e3877.svg";}}} />
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
