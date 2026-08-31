import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const service = String(form.get("service") || "").trim();
  const subject = String(form.get("subject") || "Website enquiry").trim();
  const message = String(form.get("message") || "").trim();
  if (!name || !email || !message) return NextResponse.json({error:"Please complete the required fields."},{status:400});
  return sendEmail({to:process.env.NOTIFICATION_EMAIL, from:process.env.EMAIL_FROM, replyTo:email, subject:`${subject} — ${name}`, text:`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`});
}

async function sendEmail({to,from,replyTo,subject,text}:{to?:string,from?:string,replyTo:string,subject:string,text:string}){
  if(!to || !from) return NextResponse.json({error:"Email delivery is not configured yet. Add NOTIFICATION_EMAIL and EMAIL_FROM in Vercel/local environment variables."},{status:503});
  if(!process.env.RESEND_API_KEY) return NextResponse.json({error:"Email delivery is not configured yet. Add RESEND_API_KEY in your environment variables."},{status:503});
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from,to,reply_to:replyTo,subject,text})});
  if(!response.ok) return NextResponse.json({error:"We received the form, but email delivery failed. Check the Resend configuration."},{status:502});
  return NextResponse.json({ok:true});
}
