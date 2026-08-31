import { NextResponse } from "next/server";

function googleCalendarUrl(dateLabel: string) {
  const match = dateLabel.match(/([A-Z][a-z]{2}),\s([A-Z][a-z]{2})\s(\d{1,2}),\s(\d{4})/);
  if (!match) return "";
  const month = new Date(`${match[2]} 1, ${match[4]}`).getMonth() + 1;
  const day = Number(match[3]);
  const start = `${match[4]}${String(month).padStart(2,'0')}${String(day).padStart(2,'0')}T090000`;
  const end = `${match[4]}${String(month).padStart(2,'0')}${String(day).padStart(2,'0')}T093000`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Elroi Hub Onboarding Call')}&dates=${start}/${end}&details=${encodeURIComponent('30-minute onboarding / strategy call with Elroi Hub.')}&location=${encodeURIComponent('Google Meet')}`;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const date = String(form.get('date') || '').trim();
  const notes = String(form.get('notes') || '').trim();
  if (!name || !email || !date) return NextResponse.json({error:'Please choose a date and complete your contact information.'},{status:400});
  const calendarUrl = googleCalendarUrl(date);
  const to = process.env.NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM;
  if (!to || !from || !process.env.RESEND_API_KEY) return NextResponse.json({error:'Email delivery is not configured yet. Add RESEND_API_KEY, EMAIL_FROM, and NOTIFICATION_EMAIL.'},{status:503});
  const headers = {Authorization:`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json'};
  const bookingText = `New booking request for Elroi Hub\n\nName: ${name}\nEmail: ${email}\nRequested slot: ${date} at 9:00 AM WAT\nNotes: ${notes || 'None'}\n\nGoogle Calendar: ${calendarUrl}`;
  const notification = await fetch('https://api.resend.com/emails',{method:'POST',headers,body:JSON.stringify({from,to,reply_to:email,subject:`New onboarding call request — ${name}`,text:bookingText})});
  if (!notification.ok) return NextResponse.json({error:'Booking captured, but the notification email could not be sent.'},{status:502});
  const confirmation = await fetch('https://api.resend.com/emails',{method:'POST',headers,body:JSON.stringify({from,to:email,subject:'Your Elroi Hub onboarding call request',text:`Hi ${name},\n\nWe received your request for ${date} at 9:00 AM WAT. Elroi Hub will confirm the booking by email.\n\nAdd the provisional time to Google Calendar: ${calendarUrl}\n\nElroi Hub`})});
  if (!confirmation.ok) return NextResponse.json({ok:true,calendarUrl,warn:'The internal notification was sent, but the client confirmation email could not be sent.'});
  return NextResponse.json({ok:true,calendarUrl});
}
