"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

// Returns YYYY-MM-DD in Africa/Lagos
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
  } catch {
    return iso;
  }
}
function isSunday(iso: string): boolean {
  if (!iso) return false;
  const d = new Date(`${iso}T12:00:00`);
  // getDay in Lagos — construct via locale offset trick: use UTC day of Lagos date
  const watDay = new Date(d.toLocaleString("en-US", { timeZone: "Africa/Lagos" })).getDay();
  // Fallback: check local getDay; for WAT Lagos same as UTC+1 shift but Sunday remains Sunday except edge midnight.
  // Simpler: use getUTCDay from Lagos-converted string
  // We'll use Intl to get weekday
  const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Africa/Lagos" }).format(d);
  return wd === "Sun";
}

export default function ScheduleForm() {
  const search = useSearchParams();
  const pkg = search.get("package") || "";

  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [calendarUrl, setCalendarUrl] = useState("");
  const [warn, setWarn] = useState("");

  const minDate = useMemo(() => todayWATString(), []);
  // prefill with tomorrow (next business day)
  useEffect(() => {
    const t = new Date(minDate + "T12:00:00");
    const next = new Date(t);
    next.setDate(t.getDate() + 1);
    // skip sunday
    let candidate = next.toISOString().slice(0, 10);
    // if candidate is sunday, add one day
    let attempts = 0;
    while (isSunday(candidate) && attempts < 7) {
      const d = new Date(candidate + "T12:00:00");
      d.setDate(d.getDate() + 1);
      candidate = d.toISOString().slice(0, 10);
      attempts++;
    }
    setDate(candidate);
  }, [minDate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    setWarn("");
    setCalendarUrl("");

    if (!date) {
      setStatus("error");
      setMessage("Please choose a date.");
      return;
    }
    if (isSunday(date)) {
      setStatus("error");
      setMessage("Sundays are closed. Please pick Mon–Sat (WAT).");
      return;
    }
    if (date < minDate) {
      setStatus("error");
      setMessage("Please choose a future date.");
      return;
    }

    const form = new FormData(event.currentTarget);
    form.set("date", date);
    form.set("time", time);
    if (pkg) form.set("package", pkg);

    try {
      const res = await fetch("/api/schedule", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to book this time.");
      setStatus("success");
      setMessage("Your request has been submitted. Elroi Hub will confirm the booking by email.");
      setCalendarUrl(data.calendarUrl || "");
      setWarn(data.warn || "");
      if (data.calendarUrl) {
        // keep form data but clear notes? leave as is
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to book this time.");
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      {pkg && (
        <div className="package-banner" role="status" aria-live="polite">
          <strong>Selected package:</strong> <span>{pkg}</span> — this will be included in your booking request.
        </div>
      )}

      <div className="schedule-layout">
        <section className="form-panel" aria-labelledby="pick-heading">
          <h2 id="pick-heading" className="panel-title">Select a Date &amp; Time</h2>
          <p className="panel-hint" style={{ margin: "-12px 0 18px", color: "#666", fontSize: 13 }}>
            All times are West Africa Time (WAT, Africa/Lagos). Mon–Sat only.
          </p>

          <label className="field">
            <span>Date *</span>
            <input type="date" name="date" required value={date} min={minDate} onChange={(e) => setDate(e.target.value)} />
            {date && <small style={{ display: "block", marginTop: 6, color: isSunday(date) ? "#c00" : "#555" }}>{formatDisplay(date)} {isSunday(date) ? "— Sundays closed" : ""}</small>}
          </label>

          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ display: "block", marginBottom: 6, color: "#555", fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>Time (WAT) *</legend>
            <div className="time-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
              {TIME_SLOTS.map((t) => (
                <button key={t} type="button" className={`date-btn ${time === t ? "selected" : ""}`} aria-pressed={time === t} onClick={() => setTime(t)}>
                  {t} WAT
                </button>
              ))}
            </div>
            <input type="hidden" name="time" value={time} />
          </fieldset>
        </section>

        <section className="form-panel" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="panel-title">Your Contact Info</h2>
          <label className="field">
            <span>Full Name *</span>
            <input name="name" required placeholder="Your full name" autoComplete="name" maxLength={80} />
          </label>
          <label className="field">
            <span>Email for calendar invite *</span>
            <input type="email" name="email" required placeholder="you@company.com" autoComplete="email" maxLength={254} />
          </label>
          <label className="field">
            <span>Anything specific you&apos;d like to discuss?</span>
            <textarea name="notes" placeholder="Optional" maxLength={2000} rows={4} />
          </label>
          {pkg && <input type="hidden" name="package" value={pkg} />}
        </section>
      </div>

      <button className="schedule-submit" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? "Confirming…" : "Confirm Booking"}
      </button>

      <div role="status" aria-live="polite" aria-atomic="true" style={{ marginTop: 16 }}>
        {message && (
          <div className={status === "success" ? "success" : "error"} style={{ padding: "12px 14px", borderRadius: 12, background: status === "success" ? "#f0faf0" : "#fdf0f0", color: status === "success" ? "#1a3d1a" : "#7a1a1a", border: `1px solid ${status === "success" ? "#b7ddb7" : "#e7b7b7"}` }}>
            {message}
            {warn && <><br /><small style={{ color: "#7a5a00" }}>{warn}</small></>}
            {calendarUrl && (
              <>
                <br />
                <br />
                <a href={calendarUrl} target="_blank" rel="noreferrer noopener"><u>Add to Google Calendar (WAT)</u></a>
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
