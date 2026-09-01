"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

function todayWATString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
}
function formatDisplay(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Africa/Lagos",
    });
  } catch { return iso; }
}
function isSunday(iso: string): boolean {
  const d = new Date(`${iso}T12:00:00`);
  const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Africa/Lagos" }).format(d);
  return wd === "Sun";
}

export default function OnboardingBooking({ plan }: { plan: string }) {
  const router = useRouter();
  const minDate = useMemo(() => todayWATString(), []);
  const [date, setDate] = useState(() => {
    const t = new Date(minDate + "T12:00:00");
    const next = new Date(t);
    next.setDate(t.getDate() + 1);
    let cand = next.toISOString().slice(0, 10);
    let attempts = 0;
    while (isSunday(cand) && attempts < 7) {
      const d = new Date(cand + "T12:00:00");
      d.setDate(d.getDate() + 1);
      cand = d.toISOString().slice(0, 10);
      attempts++;
    }
    return cand;
  });
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  // Generate next 5 weekdays for quick pick (like design: Mon Aug 11 etc.)
  const dateOptions = useMemo(() => {
    const opts: string[] = [];
    let d = new Date(minDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    while (opts.length < 5) {
      const iso = d.toISOString().slice(0, 10);
      if (!isSunday(iso)) opts.push(iso);
      d.setDate(d.getDate() + 1);
    }
    return opts;
  }, [minDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!date || isSunday(date)) {
      setMessage("Please choose a valid date (Mon–Sat).");
      setStatus("error");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setMessage("Please fill in your name and email.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const form = new FormData();
      form.set("date", date);
      form.set("time", time);
      form.set("name", name);
      form.set("email", email);
      form.set("notes", notes);
      if (plan) form.set("package", plan);
      const res = await fetch("/api/schedule", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to book.");
      // Redirect to confirmed with details for calendar
      const qs = new URLSearchParams({
        plan,
        date,
        time,
        email,
        calendarUrl: data.calendarUrl || "",
      }).toString();
      router.push(`/onboarding/confirmed?${qs}`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="onboarding-layout">
        <section className="onboarding-card" aria-labelledby="pick-heading">
          <h3 id="pick-heading" className="panel-title">Select a Date &amp; Time</h3>
          <div className="onboarding-dates">
            {dateOptions.map((iso) => (
              <button
                key={iso}
                type="button"
                className={`onboarding-date-btn ${date === iso ? "selected" : ""}`}
                aria-pressed={date === iso}
                onClick={() => setDate(iso)}
              >
                {formatDisplay(iso)}
              </button>
            ))}
            <label className="field" style={{ marginTop: 8 }}>
              <span>Or pick a date</span>
              <input type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} required />
              {date && <small style={{ display: "block", marginTop: 6, color: isSunday(date) ? "#c00" : "#555" }}>{formatDisplay(date)} {isSunday(date) ? "— Sundays closed" : ""}</small>}
            </label>
            <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ display: "block", marginBottom: 6, color: "#555", fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>Time (WAT) *</legend>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
                {TIME_SLOTS.map((t) => (
                  <button key={t} type="button" className={`date-btn ${time === t ? "selected" : ""}`} aria-pressed={time === t} onClick={() => setTime(t)}>
                    {t} WAT
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        <section className="onboarding-card" aria-labelledby="contact-heading">
          <h3 id="contact-heading" className="panel-title">Your Contact Info</h3>
          <div className="onboarding-contact-fields">
            <label className="field">
              <span>Full Name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" maxLength={80} required />
            </label>
            <label className="field">
              <span>Email for calendar invite *</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" maxLength={254} required />
            </label>
            <label className="field">
              <span>Anything specific you&apos;d like to discuss?</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" maxLength={2000} rows={4} />
            </label>
          </div>
        </section>
      </div>

      {message && <div role="alert" style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "#fdf0f0", color: "#7a1a1a", border: "1px solid #e7b7b7" }}>{message}</div>}

      <button className="onboarding-submit" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? "Confirming…" : "Confirm Booking"}
      </button>
    </form>
  );
}
