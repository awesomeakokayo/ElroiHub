# Elroi Hub

Responsive Next.js implementation of the Elroi Hub Figma design.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Email configuration

The contact and schedule forms are wired to the Resend HTTP API without exposing a key in the browser. Add these environment variables locally or in Vercel:

```env
RESEND_API_KEY=...
EMAIL_FROM=Elroi Hub <hello@your-verified-domain.com>
NOTIFICATION_EMAIL=elroihub@gmail.com
```

The notification email can be any Gmail/Google Workspace inbox. The sender domain must be configured in your email provider. The schedule flow also returns a Google Calendar event link for the visitor.

## Routes

- `/` — landing page
- `/pricing` — pricing tabs and packages
- `/schedule` — onboarding call request flow
- `/contact` — contact form and company contact details
