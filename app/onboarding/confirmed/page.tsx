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
      <div className="success-page">
        <img className="success-payment-mark" src="https://www.figma.com/api/mcp/asset/494cd464-1eaf-4831-aa5f-1ffa3f2673f6.png" alt="" aria-hidden="true" />
        <div className="success-status-pill">Payment Confirmed</div>
        <h1>Welcome to <span className="gold">El Roi Hub</span></h1>
        <p className="success-lead">Your Growth Plan is now active. Our team will reach out within 24 hours to get your onboarding started.</p>

        <div className="success-next-divider" style={{ marginTop: 90 }}><span>What&apos;s Next</span></div>

        <section className="success-booked">
          <img className="success-calendar-icon" src="https://www.figma.com/api/mcp/asset/04f49ee8-242f-453e-8170-6dadd11de17f.svg" alt="" aria-hidden="true" />
          <h2>Call Booked!</h2>
          <p className="success-booked-copy">
            Your onboarding call is confirmed for {displayDate} at {time ? displayTime.replace(" WAT", "") : "9:00 AM"}.<br />
            {email ? `A calendar invite has been sent to ${email}.` : "A calendar invite has been sent to your email."}
          </p>
          <div className="success-booked-details">
            <div className="success-detail-row"><span className="success-detail-label">Date &amp; Time</span><strong className="success-detail-value">{displayDate} · {displayTime}</strong></div>
            <div className="success-detail-row"><span className="success-detail-label">Duration</span><strong className="success-detail-value">30 minutes</strong></div>
            <div className="success-detail-row"><span className="success-detail-label">Format</span><strong className="success-detail-value">Video Call (Google Meet link will be sent)</strong></div>
            <div className="success-detail-row"><span className="success-detail-label">Timezone</span><strong className="success-detail-value">West Africa Time (WAT / UTC+1)</strong></div>
            <div className="success-detail-row"><span className="success-detail-label">Host</span><strong className="success-detail-value">DDFCG HUB Account Manager</strong></div>
          </div>
          <div className="success-actions">
            <Link href="/" className="success-home-btn">Back to Home</Link>
            {calendarUrl && <a className="success-calendar-btn" href={calendarUrl} target="_blank" rel="noreferrer noopener">Add to Google Calendar</a>}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
