import { NextResponse } from "next/server";

const WAT_OFFSET = "+0100";
const MONTH_MAP: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const scheduleRate = new Map<string, { count: number; reset: number }>();
function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = scheduleRate.get(ip);
  if (!entry || now > entry.reset) {
    scheduleRate.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

// Accepts either legacy "Mon, Aug 11, 2026" or ISO "2026-08-11" + time "09:00"
export function googleCalendarUrl(dateLabel: string, timeLabel?: string) {
  // Try ISO first: dateLabel is YYYY-MM-DD
  let year: string | undefined, month: string | undefined, day: string | undefined;
  const iso = dateLabel.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    [, year, month, day] = iso;
  } else {
    const m = dateLabel.match(/([A-Z][a-z]{2}),\s([A-Z][a-z]{2})\s(\d{1,2}),\s(\d{4})/);
    if (!m) return "";
    year = m[4];
    month = MONTH_MAP[m[2]];
    if (!month) return "";
    day = String(Number(m[3])).padStart(2, "0");
  }
  const t = timeLabel && /^\d{2}:\d{2}$/.test(timeLabel) ? timeLabel.replace(":", "") + "00" : "090000";
  const tEnd = timeLabel ? String(Number(t.slice(0, 2)) + 1).padStart(2, "0") + t.slice(2) : "100000";
  // Use floating time with explicit Africa/Lagos timezone so 09:00 WAT renders correctly for viewer
  const start = `${year}${month}${day}T${t}`;
  const end = `${year}${month}${day}T${tEnd}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Elroi Hub Onboarding Call")}&dates=${start}/${end}&ctz=Africa/Lagos&details=${encodeURIComponent("30-minute onboarding / strategy call with Elroi Hub.")}&location=${encodeURIComponent("Google Meet")}`;
}

function isValidPackage(p: string): boolean {
  if (!p) return true; // optional
  const allowed = [
    "AI Starter","AI Growth","AI Pro","AI Enterprise",
    "Basic","Standard","Premium","Brand Identity",
    "Landing Page","Business Website","Professional Website","E-Commerce Website","Custom Web Application",
    "Starter Combo","Growth Combo","Premium Combo","Business Combo"
  ];
  return allowed.includes(p) || p.length <= 80;
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

  const name = String(form.get("name") || "").trim().slice(0, 80);
  const email = String(form.get("email") || "").trim().slice(0, 254);
  const dateRaw = String(form.get("date") || "").trim().slice(0, 30);
  const timeRaw = String(form.get("time") || "09:00").trim().slice(0, 5);
  const notes = String(form.get("notes") || "").trim().slice(0, 2000);
  const pkg = String(form.get("package") || "").trim().slice(0, 80);

  if (!name || name.length < 2) return NextResponse.json({ error: "Please enter your full name (at least 2 characters)." }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!dateRaw) return NextResponse.json({ error: "Please choose a date and time." }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRaw) && !/^[A-Z][a-z]{2},\s[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$/.test(dateRaw)) {
    return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
  }
  if (!isValidPackage(pkg)) return NextResponse.json({ error: "Invalid package selected." }, { status: 400 });

  // Validate future date (WAT)
  try {
    const nowWAT = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
    const selected = new Date(`${dateRaw}T12:00:00`);
    const todayStart = new Date(nowWAT);
    todayStart.setHours(0, 0, 0, 0);
    if (selected < todayStart) return NextResponse.json({ error: "Please choose a future date." }, { status: 400 });
    if (selected.getDay() === 0) return NextResponse.json({ error: "Sundays are closed. Please pick Mon–Sat." }, { status: 400 });
  } catch {}

  const calendarUrl = googleCalendarUrl(dateRaw, timeRaw);
  const dateDisplay = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)
    ? new Date(`${dateRaw}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "Africa/Lagos" })
    : dateRaw;

  const to = process.env.NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM;
  if (!to || !from || !process.env.RESEND_API_KEY) return NextResponse.json({ error: "Email delivery is not configured yet. Add RESEND_API_KEY, EMAIL_FROM, and NOTIFICATION_EMAIL." }, { status: 503 });

  const headers = { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" };
  const bookingText = `New booking request for Elroi Hub\n\nName: ${name}\nEmail: ${email}\nPackage: ${pkg || "—"}\nRequested slot: ${dateDisplay} at ${timeRaw} WAT (Africa/Lagos)\nNotes: ${notes || "None"}\n\nGoogle Calendar: ${calendarUrl}`;

  const sendTimeout = (ms: number) => {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), ms);
    return { signal: c.signal, done: () => clearTimeout(t) };
  };

  const n1 = sendTimeout(8000);
  let notificationOk = false;
  try {
    const notification = await fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify({ from, to, reply_to: email, subject: `New onboarding call request — ${name}${pkg ? ` (${pkg})` : ""}`, text: bookingText }), signal: n1.signal });
    if (!notification.ok) {
      const body = await notification.text().catch(() => "");
      console.error("Resend schedule notification failed", notification.status, body.slice(0, 500));
      return NextResponse.json({ error: "Booking captured, but the notification email could not be sent." }, { status: 502 });
    }
    notificationOk = true;
  } catch (e) {
    console.error("Resend schedule notification fetch failed", e);
    return NextResponse.json({ error: "Booking request could not be sent. Please try again." }, { status: 502 });
  } finally {
    n1.done();
  }

  if (!notificationOk) return NextResponse.json({ error: "Booking not sent." }, { status: 502 });

  const n2 = sendTimeout(8000);
  try {
    const confirmation = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({
        from,
        to: email,
        subject: "Your Elroi Hub onboarding call request",
        text: `Hi ${name},\n\nWe received your request for ${dateDisplay} at ${timeRaw} WAT (Africa/Lagos)${pkg ? ` — ${pkg}` : ""}. Elroi Hub will confirm the booking by email.\n\nAdd the provisional time to Google Calendar: ${calendarUrl}\n\nElroi Hub`,
      }),
      signal: n2.signal,
    });
    if (!confirmation.ok) {
      const body = await confirmation.text().catch(() => "");
      console.error("Resend schedule confirmation failed", confirmation.status, body.slice(0, 500));
      return NextResponse.json({ ok: true, calendarUrl, warn: "The internal notification was sent, but the client confirmation email could not be sent." });
    }
    return NextResponse.json({ ok: true, calendarUrl });
  } catch (e) {
    console.error("Resend schedule confirmation fetch failed", e);
    return NextResponse.json({ ok: true, calendarUrl, warn: "The internal notification was sent, but the client confirmation email could not be sent." });
  } finally {
    n2.done();
  }
}
