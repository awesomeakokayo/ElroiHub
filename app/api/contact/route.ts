import { NextResponse } from "next/server";

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

  return sendEmail({
    to: process.env.NOTIFICATION_EMAIL,
    from: process.env.EMAIL_FROM,
    replyTo: email,
    subject: `${subject} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nService: ${service || "—"}\n\n${message}`,
  });
}

async function sendEmail({ to, from, replyTo, subject, text }: { to?: string; from?: string; replyTo: string; subject: string; text: string }) {
  if (!to || !from) return NextResponse.json({ error: "Email delivery is not configured yet. Add NOTIFICATION_EMAIL and EMAIL_FROM in Vercel/local environment variables." }, { status: 503 });
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Email delivery is not configured yet. Add RESEND_API_KEY in your environment variables." }, { status: 503 });
  if (!from.includes("<") || !from.includes(">")) {
    // Basic check: must be "Name <email@domain>"
    return NextResponse.json({ error: "EMAIL_FROM must be in format 'Name <email@verified-domain.com>'." }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: replyTo, subject, text }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Resend contact error", response.status, body.slice(0, 500));
      return NextResponse.json({ error: "We received the form, but email delivery failed. Check the Resend configuration." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error("Resend contact fetch failed", err);
    return NextResponse.json({ error: isAbort ? "Email service timed out. Please try again." : "Unable to send email at this time." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
