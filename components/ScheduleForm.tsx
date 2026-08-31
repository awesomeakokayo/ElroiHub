"use client";

import { FormEvent, useMemo, useState } from "react";

const dates = ["Mon, Aug 11", "Tue, Aug 12", "Wed, Aug 13", "Thu, Aug 14", "Fri, Aug 15"];

export default function ScheduleForm() {
  const [date, setDate] = useState(dates[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [calendarUrl, setCalendarUrl] = useState("");
  const dateValue = useMemo(() => `${date}, 2026`, [date]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    const form = new FormData(event.currentTarget); form.set("date", dateValue);
    try {
      const res = await fetch("/api/schedule", { method: "POST", body: form });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Unable to book this time.");
      setStatus("success"); setMessage("Your request has been submitted. Elroi Hub will confirm the booking by email."); setCalendarUrl(data.calendarUrl || "");
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Unable to book this time."); }
  }

  return (
    <form onSubmit={submit}>
      <div className="schedule-layout">
        <section className="form-panel">
          <h2 className="panel-title">Select a Date &amp; Time</h2>
          <div className="date-grid">
            {dates.map((item) => <button type="button" key={item} className={`date-btn ${date === item ? "selected" : ""}`} onClick={() => setDate(item)}>{item}</button>)}
          </div>
        </section>
        <section className="form-panel">
          <h2 className="panel-title">Your Contact Info</h2>
          <label className="field"><span>Full Name *</span><input name="name" required placeholder="Your full name" /></label>
          <label className="field"><span>Email for calendar invite *</span><input type="email" name="email" required placeholder="you@company.com" /></label>
          <label className="field"><span>Anything specific you'd like to discuss?</span><textarea name="notes" placeholder="Optional" /></label>
        </section>
      </div>
      <button className="schedule-submit" disabled={status === "sending"}>{status === "sending" ? "Confirming…" : "Confirm Booking"}</button>
      {message && <div className={status === "success" ? "success" : "error"}>{message}{calendarUrl && <><br /><br /><a href={calendarUrl} target="_blank" rel="noreferrer"><u>Add to Google Calendar</u></a></>}</div>}
    </form>
  );
}
