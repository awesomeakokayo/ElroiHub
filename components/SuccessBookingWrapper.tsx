"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function todayWATString() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
}

function isSunday(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Africa/Lagos" }).format(d) === "Sun";
}

function nextFiveBusinessDates(startIso: string) {
  const dates: string[] = [];
  let cursor = new Date(`${startIso}T12:00:00`);
  cursor.setDate(cursor.getDate() + 1);
  while (dates.length < 5) {
    const iso = cursor.toISOString().slice(0, 10);
    if (!isSunday(iso)) dates.push(iso);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function displayDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Africa/Lagos",
  });
}

function displayBookedDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });
}

export default function SuccessBookingWrapper({ planName, email }: { planName: string; email: string; sessionId?: string }) {
  const [booked, setBooked] = useState<null | { date: string; time: string; calendarUrl: string; email: string }>(null);
  const [date, setDate] = useState("");
  const [bookingEmail, setBookingEmail] = useState(email);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const today = todayWATString();
    const options = nextFiveBusinessDates(today);
    setDates(options);
    setDate(options[0] || "");
  }, []);

  const selectedTime = "09:00";
  const selectedPlan = useMemo(() => planName || "Growth", [planName]);

  async function submitBooking() {
    setError("");
    if (!name.trim() || name.trim().length < 2) { setError("Please enter your full name."); return; }
    if (!bookingEmail.trim() || !/^\S+@\S+\.\S+$/.test(bookingEmail.trim())) { setError("Please enter a valid email address."); return; }
    if (!date) { setError("Please choose a date."); return; }

    setStatus("sending");
    try {
      const form = new FormData();
      form.set("name", name.trim());
      form.set("email", bookingEmail.trim());
      form.set("date", date);
      form.set("time", selectedTime);
      form.set("notes", notes.trim());
      form.set("package", selectedPlan);

      const res = await fetch("/api/schedule", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to book this time.");
      setBooked({ date, time: selectedTime, calendarUrl: data.calendarUrl || "", email: bookingEmail.trim() });
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unable to book this time.");
    }
  }

  if (booked) {
    return (
      <section className="success-booked">
        <img className="success-calendar-icon" src="https://www.figma.com/api/mcp/asset/04f49ee8-242f-453e-8170-6dadd11de17f.svg" alt="" aria-hidden="true" />
        <h2>Call Booked!</h2>
        <p className="success-booked-copy">
          Your onboarding call is confirmed for {displayBookedDate(booked.date)} at 9:00 AM.<br />
          A calendar invite has been sent to {booked.email}.
        </p>

        <div className="success-booked-details">
          <div className="success-detail-row"><span className="success-detail-label">Date &amp; Time</span><strong className="success-detail-value">{displayBookedDate(booked.date)} · 9:00 AM</strong></div>
          <div className="success-detail-row"><span className="success-detail-label">Duration</span><strong className="success-detail-value">30 minutes</strong></div>
          <div className="success-detail-row"><span className="success-detail-label">Format</span><strong className="success-detail-value">Video Call (Google Meet link will be sent)</strong></div>
          <div className="success-detail-row"><span className="success-detail-label">Timezone</span><strong className="success-detail-value">West Africa Time (WAT / UTC+1)</strong></div>
          <div className="success-detail-row"><span className="success-detail-label">Host</span><strong className="success-detail-value">DDFCG HUB Account Manager</strong></div>
        </div>

        <div className="success-actions">
          <Link href="/" className="success-home-btn">Back to Home</Link>
          {booked.calendarUrl && <a className="success-calendar-btn" href={booked.calendarUrl} target="_blank" rel="noreferrer noopener">Add to Google Calendar</a>}
        </div>
      </section>
    );
  }

  return (
    <section className="onboarding-section">
      <div className="onboarding-kicker">Schedule a Call</div>
      <h2>Book Your Onboarding Call</h2>
      <p className="onboarding-copy">Let&apos;s get acquainted. A 30-minute kickoff call with your dedicated account manager to align on your brand goals, content direction, and first month&apos;s plan.</p>

      <div className="onboarding-layout">
        <section className="onboarding-card" aria-labelledby="onboarding-date-title">
          <h3 className="panel-title" id="onboarding-date-title">Select a Date &amp; Time</h3>
          <div className="onboarding-dates">
            {dates.map((option) => (
              <button
                key={option}
                type="button"
                className={`onboarding-date-btn${date === option ? " selected" : ""}`}
                onClick={() => setDate(option)}
                aria-pressed={date === option}
              >
                {displayDate(option)}
              </button>
            ))}
          </div>
        </section>

        <section className="onboarding-card" aria-labelledby="onboarding-contact-title">
          <h3 className="panel-title" id="onboarding-contact-title">Your Contact Info</h3>
          <div className="onboarding-contact-fields">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" maxLength={80} />
            <input type="email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} placeholder="Email for calendar invite" maxLength={254} />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything specific you'd like to discuss? (optional)" maxLength={2000} />
          </div>
        </section>
      </div>

      <button className="onboarding-submit" type="button" onClick={submitBooking} disabled={status === "sending"}>
        {status === "sending" ? "Confirming…" : "Confirm Booking"}
      </button>
      {error && <div className="checkout-error" style={{ marginTop: 14 }}>{error}</div>}
    </section>
  );
}
