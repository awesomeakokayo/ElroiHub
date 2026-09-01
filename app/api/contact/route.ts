import { NextResponse } from "next/server";
import { sendContactToElroi } from "@/lib/gmail";

// Simple in-memory rate limit: 5 requests per minute per IP
const contactRate = new Map<string, { count: number; reset: number }>();
function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = contactRate.get(ip);
  if (!entry || now > entry.reset) {
    contactRate.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 80, email: 254, phone: 20, service: 60, subject: 120, message: 5000 };

function sanitizeSubject(s: string) {
  return s.replace(/[\r\n]+/g, " ").slice(0, MAX.subject);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRate(ip)) return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = String(form.get("name") || "").trim().slice(0, MAX.name);
  const email = String(form.get("email") || "").trim().slice(0, MAX.email);
  const phone = String(form.get("phone") || "").trim().slice(0, MAX.phone);
  const service = String(form.get("service") || "").trim().slice(0, MAX.service);
  const subjectRaw = String(form.get("subject") || "Website enquiry").trim();
  const subject = sanitizeSubject(subjectRaw) || "Website enquiry";
  const message = String(form.get("message") || "").trim().slice(0, MAX.message);

  if (!name || name.length < 2) return NextResponse.json({ error: "Please enter your full name (at least 2 characters)." }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!message || message.length < 10) return NextResponse.json({ error: "Message is too short. Please provide at least 10 characters." }, { status: 400 });

  // Direct Gmail (Option A) — from Elroihub2502@gmail.com to Elroihub2502@gmail.com, Reply-To visitor
  try {
    await sendContactToElroi({ name, email, phone, service, subject, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Gmail send failed", err);
    const msg = err instanceof Error ? err.message : "Unable to send email at this time.";
    // If OAuth not configured, surface setup hint
    if (msg.includes("Gmail OAuth not configured")) {
      return NextResponse.json({ error: "Email delivery not configured yet. Add GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN (see .env.example)." }, { status: 503 });
    }
    return NextResponse.json({ error: "We received the form, but Gmail delivery failed. Please try again." }, { status: 502 });
  }
}
