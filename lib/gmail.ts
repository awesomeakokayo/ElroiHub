import { google } from "googleapis";

const GMAIL_USER = "Elroihub2502@gmail.com";
const REQUIRED = ["GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"] as const;

type SendArgs = {
  to?: string; // defaults to Elroihub2502@gmail.com
  subject: string;
  text: string;
  html?: string;
  replyTo?: string; // visitor's email so Elroi can reply directly
  inReplyTo?: string; // for single-thread: pass Message-ID of first mail
  references?: string; // thread chain
};

function assertEnv() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Gmail OAuth not configured. Missing: ${missing.join(", ")}. See .env.example Option A setup.`);
  }
}

function getOAuthClient() {
  assertEnv();
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID!,
    process.env.GMAIL_CLIENT_SECRET!,
    process.env.GMAIL_REDIRECT_URI || "https://developers.google.com/oauthplayground"
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
  });
  return oAuth2Client;
}

function buildRaw({ to, subject, text, html, replyTo, inReplyTo, references }: SendArgs): string {
  const toAddr = to || GMAIL_USER;
  // From is the ElRoi Gmail itself — Option A delivers *from* Elroihub2502@gmail.com
  const from = `"ElRoi Hub" <${GMAIL_USER}>`;
  const date = new Date().toUTCString();
  const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@elroihub.com>`;

  const headers = [
    `From: ${from}`,
    `To: ${toAddr}`,
    `Subject: ${subject.replace(/[\r\n]+/g, " ")}`,
    `Date: ${date}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
  ];
  if (replyTo) headers.push(`Reply-To: ${replyTo}`);
  if (inReplyTo) headers.push(`In-Reply-To: ${inReplyTo}`);
  if (references) headers.push(`References: ${references}`);
  // Gmail threading also needs explicit Threading headers on subsequent mails
  if (inReplyTo) {
    const threadSubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
    // override Subject to thread correctly
    headers[2] = `Subject: ${threadSubject.replace(/[\r\n]+/g, " ")}`;
  }

  // Build multipart/alternative if html provided, else text only
  if (html) {
    const boundary = `elroi_${Date.now()}`;
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    const body = [
      ...headers,
      "",
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: quoted-printable`,
      "",
      text,
      "",
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: quoted-printable`,
      "",
      html,
      "",
      `--${boundary}--`,
    ].join("\r\n");
    return Buffer.from(body).toString("base64url");
  }

  headers.push(`Content-Type: text/plain; charset="UTF-8"`);
  headers.push(`Content-Transfer-Encoding: quoted-printable`);
  const body = [...headers, "", text].join("\r\n");
  return Buffer.from(body).toString("base64url");
}

/**
 * Send an email *from* Elroihub2502@gmail.com *to* Elroihub2502@gmail.com (or override `to`).
 * Uses Gmail API OAuth — Option A (most deliverable).
 * For single-thread payment+booking, call once with combined text after booking succeeds,
 * or call twice with same subject + inReplyTo set to the first message's Message-ID.
 */
export async function sendViaGmail(args: SendArgs): Promise<{ messageId: string; threadId?: string }> {
  const auth = getOAuthClient();
  // Ensure access token is fresh
  await auth.getAccessToken();
  const gmail = google.gmail({ version: "v1", auth });

  const raw = buildRaw(args);

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  const messageIdHeader = res.data.id ? `<${res.data.id}@gmail>` : "";
  return { messageId: messageIdHeader, threadId: res.data.threadId || undefined };
}

// Convenience wrappers for the two shapes we use app-wide

export async function sendContactToElroi(input: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  subject: string;
  message: string;
}) {
  const { name, email, phone, service, subject, message } = input;
  const text = `New contact request — ElRoi Hub\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nService: ${service || "—"}\n\n${message}\n\n—\nReply-To: ${email}`;
  const html = `<div style="font-family:sans-serif;line-height:1.6"><h2>New contact request — ElRoi Hub</h2><p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Phone:</strong> ${phone || "—"}<br><strong>Service:</strong> ${service || "—"}</p><pre style="white-space:pre-wrap;background:#f6f8f6;padding:12px;border-radius:8px">${message}</pre><p><em>Reply directly to this email to reach ${email}</em></p></div>`;
  return sendViaGmail({
    subject: `${subject} — ${name}`,
    text,
    html,
    replyTo: email,
  });
}

export async function sendBookingToElroi(input: {
  name: string;
  email: string;
  dateDisplay: string;
  dateRaw: string;
  time: string;
  packageName: string;
  notes?: string;
  calendarUrl: string;
  paymentMeta?: { plan: string; amountLabel?: string; sessionId?: string };
}) {
  const { name, email, dateDisplay, dateRaw, time, packageName, notes, calendarUrl, paymentMeta } = input;

  const paymentBlock = paymentMeta
    ? `Payment\n  Plan: ${paymentMeta.plan}\n  Amount: ${paymentMeta.amountLabel || "—"} (USD)\n  Session: ${paymentMeta.sessionId || "mock/local"}\n  Status: Paid\n`
    : "";

  const text = `New booking request for ElRoi Hub${paymentMeta ? " — PAID BOOKING (single thread)" : ""}\n\nName: ${name}\nEmail: ${email}\nPackage: ${packageName || "—"}\nRequested slot: ${dateDisplay} at ${time} WAT (Africa/Lagos)\nRaw date: ${dateRaw}\nNotes: ${notes || "None"}\n\n${paymentBlock}\nGoogle Calendar: ${calendarUrl}\n\n—\nReply-To: ${email}`;

  const html = `<div style="font-family:sans-serif;line-height:1.6"><h2>New ${paymentMeta ? "PAID " : ""}booking — ElRoi Hub</h2><p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Package:</strong> ${packageName || "—"}<br><strong>Slot:</strong> ${dateDisplay} at ${time} WAT</p>${paymentMeta ? `<div style="background:#f0faf0;border:1px solid #b7ddb7;padding:10px;border-radius:8px"><strong>Payment — Paid (USD)</strong><br>Plan: ${paymentMeta.plan}<br>Amount: ${paymentMeta.amountLabel || "—"}<br>Session: ${paymentMeta.sessionId || "mock"}</div>` : ""}<p><strong>Notes:</strong> ${notes || "None"}</p><p><a href="${calendarUrl}">Google Calendar (Africa/Lagos)</a></p><p><em>Reply directly to reach ${email}</em></p></div>`;

  // Single-thread: one combined mail after booking that includes payment. If payment already sent a mail, the caller can pass inReplyTo to thread.
  return sendViaGmail({
    subject: `New ${paymentMeta ? "paid " : ""}onboarding call request — ${name}${packageName ? ` (${packageName})` : ""}`,
    text,
    html,
    replyTo: email,
  });
}

export const ELROI_GMAIL = GMAIL_USER;
