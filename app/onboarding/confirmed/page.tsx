import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { findPlanByName } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Call Booked",
  description: "Your ElRoi Hub onboarding call is confirmed.",
};

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

export default async function OnboardingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; date?: string; time?: string; email?: string; calendarUrl?: string }>;
}) {
  const params = await searchParams;
  const planName = params?.plan || "Growth";
  const plan = findPlanByName(planName) || findPlanByName("Growth")!;
  const displayPrice = plan.price.startsWith("$") ? plan.price : `$${plan.price}`;
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);
  const nextBillingStr = nextBilling.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const date = params?.date || new Date().toISOString().slice(0, 10);
  const time = params?.time || "09:00";
  const email = params?.email || "elroihub@gmail.com";
  const calendarUrl = params?.calendarUrl || "";

  // Fallback calendar URL if not provided: generate Google Calendar link
  const fallbackCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`ElRoi Hub Onboarding - ${plan.name}`)}&dates=${date.replace(/-/g, "")}T${time.replace(":", "")}00Z/${date.replace(/-/g, "")}T${String(parseInt(time.split(":")[0], 10) + 1).padStart(2, "0")}${time.split(":")[1]}00Z&details=${encodeURIComponent(`Onboarding call for ${plan.name} plan`)}&ctz=Africa/Lagos`;

  const calUrl = calendarUrl || fallbackCalendarUrl;

  return (
    <main className="checkout-success-page">
      <SiteHeader />
      <div>
        {/* Top - Payment Confirmed */}
        <div className="success-page">
          <img src="/assets/icon-badge.svg" alt="" className="success-payment-mark" aria-hidden="true" />
          <div className="success-status-pill">Payment Confirmed</div>
          <h1>
            Welcome to <span className="gold">El Roi Hub</span>
          </h1>
          <p className="success-lead">Your {plan.name} Plan is now active. Our team will reach out within 24 hours to get your onboarding started.</p>

          <div className="success-plan-card">
            <div>
              <div className="success-plan-label">Plan</div>
              <div className="success-plan-value">{plan.name}</div>
            </div>
            <div>
              <div className="success-plan-label">Amount</div>
              <div className="success-plan-value">{displayPrice}/mo</div>
            </div>
            <div>
              <div className="success-plan-label">Status</div>
              <div className="success-plan-value active">✓ Active</div>
            </div>
            <div>
              <div className="success-plan-label">Next Billing</div>
              <div className="success-plan-value">{nextBillingStr}</div>
            </div>
          </div>
        </div>

        <div className="success-next-divider">
          <span>What&apos;s Next</span>
        </div>

        {/* Call Booked */}
        <div className="success-booked">
          <img src="/assets/icon-badge.svg" alt="" className="success-calendar-icon" aria-hidden="true" />
          <h2>Call Booked!</h2>
          <p className="success-booked-copy">
            Your onboarding call is confirmed for {formatDisplay(date)} at {time} WAT.
            <br />A calendar invite has been sent to {email}.
          </p>

          <div className="success-booked-details">
            <div className="success-detail-row">
              <span className="success-detail-label">Date &amp; Time</span>
              <span className="success-detail-value">{formatDisplay(date)} at {time} WAT</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Duration</span>
              <span className="success-detail-value">30 minutes</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Format</span>
              <span className="success-detail-value">Video Call (Google Meet link to be sent)</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Timezone</span>
              <span className="success-detail-value">West Africa Time (WAT, UTC+1)</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Host</span>
              <span className="success-detail-value">ElRoi Hub Onboarding Manager</span>
            </div>
          </div>

          <div className="success-actions">
            <Link href="/" className="success-home-btn">Back to Home</Link>
            <a href={calUrl} target="_blank" rel="noreferrer noopener" className="success-calendar-btn">Add to Google Calendar</a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
