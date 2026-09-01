import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Call Booked" };

export default async function OnboardingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; time?: string; calendarUrl?: string; email?: string }>;
}) {
  const { date, time, calendarUrl, email } = await searchParams;
  const displayDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "Africa/Lagos" })
    : "—";
  const displayTime = time ? `${time} WAT` : "09:00 WAT";

  return (
    <main className="inner-page checkout-success-page">
      <SiteHeader />
      <div style={{ maxWidth: 760, margin: "0 auto", width: "100%", textAlign: "center", paddingTop: 8 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1a3d1a", display: "grid", placeItems: "center", margin: "0 auto 12px", border: "2px solid rgba(255,255,255,0.12)" }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: "#affc9e", display: "grid", placeItems: "center", color: "#1a3d1a", fontWeight: 800 }}>✓</span>
        </div>
        <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 999, background: "#affc9e", color: "#1a3d1a", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Payment Confirmed</div>
        <h1 className="section-title" style={{ fontSize: "clamp(28px,4vw,44px)", textAlign: "center", marginTop: 12, color: "#fff" }}>
          Welcome to <span className="gold">El Roi Hub</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 8 }}>Your Growth Plan is now active. Our team will reach out within 24 hours.</p>

        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "20px 0" }} />

        <div style={{ width: 48, height: 48, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "grid", placeItems: "center", margin: "0 auto 10px" }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fff", display: "grid", placeItems: "center", fontSize: 14 }}>▦</span>
        </div>
        <h2 className="section-title" style={{ fontSize: "clamp(28px,4vw,38px)", textAlign: "center", color: "#fff" }}>Call Booked!</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6 }}>
          Your onboarding call is confirmed for {displayDate} at {displayTime}.<br />
          {email ? `A calendar invite has been sent to ${email}.` : "A calendar invite has been sent to your email."}
        </p>

        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, marginTop: 18, textAlign: "left" }}>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>DATE & TIME</span><strong>{displayDate} • {displayTime}</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>DURATION</span><strong>30 minutes</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>FORMAT</span><strong>Video Call (Google Meet link to be sent)</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>TIMEZONE</span><strong>West Africa Time (WAT, UTC+1)</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.9)", padding: "8px 0" }}><span style={{ opacity: 0.6 }}>HOST</span><strong>ElRoi Hub Account Manager</strong></div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-outline" style={{ minWidth: 160, height: 44, borderColor: "rgba(255,255,255,0.4)", fontSize: 14 }}>Back to Home</Link>
          {calendarUrl ? (
            <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ minWidth: 200, height: 44, fontSize: 14, background: "#ffae00", color: "#1d1d1d" }}>Add to Google Calendar</a>
          ) : (
            <Link href="/onboarding" className="btn btn-gold" style={{ minWidth: 200, height: 44, fontSize: 14, background: "#ffae00", color: "#1d1d1d" }}>Add to Google Calendar</Link>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
