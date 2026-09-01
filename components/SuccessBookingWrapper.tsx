"use client";

import { useState } from "react";
import Link from "next/link";
import ScheduleForm from "./ScheduleForm";

export default function SuccessBookingWrapper({ planName, email, sessionId }: { planName: string; email: string; sessionId?: string }) {
  const [booked, setBooked] = useState<null | { date: string; time: string; calendarUrl: string; email: string }>(null);

  // ScheduleForm will call onBooked when it succeeds — we intercept via custom event?
  // Simpler: we wrap ScheduleForm and listen for its success message via polling of its calendarUrl state?
  // For now, we render ScheduleForm and also handle its success via a callback prop we add.
  // To avoid refactoring ScheduleForm, we render it and after it succeeds it shows its own success box.
  // Here we provide a richer Call Booked view when booked is set.

  // We'll create a small wrapper that renders ScheduleForm but also exposes an onSuccess hook via window event?
  // Easiest: duplicate ScheduleForm logic here with plan context, but reuse its UI.
  // For MVP, just render ScheduleForm with package=planName and email prefill via query, and also show Call Booked section below when booked.

  if (booked) {
    const { date, time, calendarUrl, email: bookedEmail } = booked;
    const displayDate = (() => {
      try {
        return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "Africa/Lagos" });
      } catch { return date; }
    })();
    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "18px 0 10px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "grid", placeItems: "center", margin: "0 auto 10px" }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fff", display: "grid", placeItems: "center", fontSize: 14 }}>▦</span>
          </div>
          <h2 className="section-title" style={{ fontSize: "clamp(28px,4vw,38px)", textAlign: "center", color: "#fff" }}>Call Booked!</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6 }}>
            Your onboarding call is confirmed for {displayDate} at {time} WAT.<br />
            A calendar invite has been sent to {bookedEmail}.
          </p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>DATE & TIME</span><strong>{displayDate} • {time} WAT</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>DURATION</span><strong>30 minutes</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>FORMAT</span><strong>Video Call (Google Meet link to be sent)</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>TIMEZONE</span><strong>West Africa Time (WAT, UTC+1)</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>HOST</span><strong>ElRoi Hub Account Manager</strong></div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-outline" style={{ minWidth: 160, height: 44, borderColor: "rgba(255,255,255,0.4)", fontSize: 14 }}>Back to Home</Link>
          {calendarUrl && <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ minWidth: 200, height: 44, fontSize: 14, background: "#ffae00", color: "#1d1d1d" }}>Add to Google Calendar</a>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "#affc9e", color: "#1a3d1a", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Schedule a Call</div>
        <h2 className="section-title" style={{ fontSize: "clamp(24px,3.2vw,32px)", textAlign: "center", color: "#fff", marginTop: 8 }}>Book Your Onboarding Call</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6 }}>Let&apos;s get acquainted. A 30-minute kickoff call with your dedicated account manager to align on your brand goals, content direction, and first month&apos;s plan.</p>
      </div>
      {/* Reuse existing ScheduleForm but intercept success to show Call Booked UI above */}
      <div style={{ position: "relative" }}>
        <ScheduleFormWrapper planName={planName} email={email} onBooked={(d) => setBooked(d)} />
      </div>
    </div>
  );
}

// Thin wrapper around ScheduleForm that lifts its success data
import { useEffect, useRef } from "react";
function ScheduleFormWrapper({ planName, email, onBooked }: { planName: string; email: string; onBooked: (d: { date: string; time: string; calendarUrl: string; email: string }) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Monkey-patch fetch? Instead, we poll for ScheduleForm's success DOM
    // Simpler: just render ScheduleForm with package and let its own success show, but also observe for calendarUrl
    const obs = new MutationObserver(() => {
      const el = ref.current?.querySelector('a[href*="calendar.google.com"]') as HTMLAnchorElement | null;
      if (el) {
        // Try to extract date/time from form state via the displayed message? For MVP, use generic
        const dateInput = ref.current?.querySelector('input[name="date"]') as HTMLInputElement | null;
        const timeBtn = ref.current?.querySelector('.date-btn.selected') as HTMLButtonElement | null;
        const date = dateInput?.value || "";
        const time = timeBtn?.textContent?.replace(" WAT","").trim() || "09:00";
        const emailInput = ref.current?.querySelector('input[name="email"]') as HTMLInputElement | null;
        onBooked({ date, time, calendarUrl: el.href, email: emailInput?.value || email });
      }
    });
    if (ref.current) obs.observe(ref.current, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [email, onBooked]);
  // We need to pass package via URL search param — ScheduleForm reads useSearchParams(). So set it
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.get("package")) {
      url.searchParams.set("package", planName);
      window.history.replaceState({}, "", url.toString());
    }
    if (email && !url.searchParams.get("email")) {
      // ScheduleForm doesn't read email from query, but we could set it via DOM
      const el = document.querySelector('input[name="email"]') as HTMLInputElement | null;
      if (el && !el.value) el.value = email;
    }
  }, [planName, email]);
  return (
    <div ref={ref}>
      <ScheduleForm />
    </div>
  );
}
