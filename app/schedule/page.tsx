import { Suspense } from "react";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import ScheduleForm from "@/components/ScheduleForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Schedule a Call",
  description: "Book a free 30-minute strategy call with Elroi Hub to align on your brand goals and growth plan.",
};

export default function SchedulePage() {
  return (
    <main className="inner-page schedule-page">
      <SiteHeader />
      <div className="inner-head">
        <div className="section-kicker" style={{ background: "#affc9e", color: "#246129" }}>
          Schedule a Call
        </div>
        <h1 className="section-title">Book Your Onboarding Call</h1>
        <p className="schedule-description">
          Let&apos;s get acquainted. A 30-minute kickoff call with your dedicated account manager to align on your brand goals, content direction, and first month&apos;s plan.
        </p>
      </div>
      <Suspense fallback={<div className="form-panel">Loading scheduler…</div>}>
        <ScheduleForm />
      </Suspense>
      <Footer />
    </main>
  );
}
