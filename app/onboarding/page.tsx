import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ScheduleForm from "@/components/ScheduleForm";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Book Your Onboarding Call" };

export default function OnboardingPage() {
  return (
    <main className="inner-page checkout-success-page">
      <SiteHeader />
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", padding: "8px 0 12px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1a3d1a", display: "grid", placeItems: "center", margin: "0 auto 12px", border: "2px solid rgba(255,255,255,0.12)" }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: "#affc9e", display: "grid", placeItems: "center", color: "#1a3d1a", fontWeight: 800 }}>✓</span>
          </div>
          <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 999, background: "#affc9e", color: "#1a3d1a", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Payment Confirmed</div>
          <h1 className="section-title" style={{ fontSize: "clamp(28px,4vw,44px)", textAlign: "center", marginTop: 12, color: "#fff" }}>
            Welcome to <span className="gold">El Roi Hub</span>
          </h1>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 8 }}>Your plan is now Active. Let&apos;s get your onboarding scheduled.</p>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "18px 0" }} />
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 12 }}>What&apos;s Next</div>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "#affc9e", color: "#1a3d1a", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Schedule a Call</div>
          <h2 className="section-title" style={{ fontSize: "clamp(24px,3.2vw,32px)", textAlign: "center", color: "#fff", marginTop: 8 }}>Book Your Onboarding Call</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6 }}>A 30-minute kickoff with your dedicated account manager to align on your brand goals, content direction, and first month&apos;s plan.</p>
        </div>

        <Suspense fallback={<div className="form-panel">Loading scheduler…</div>}>
          <ScheduleForm />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
