import "./globals.css";
import "./fractul.css";
import "./figma-flow.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://elroihub.com"),
  title: {
    default: "Elroi Hub — Creative. Strategic. Built to dominate.",
    template: "%s | Elroi Hub",
  },
  description: "Elroi Hub combines creativity, technology, and AI to help brands build lasting influence.",
  keywords: ["Elroi Hub", "creative agency", "AI solutions", "branding", "web development", "Lagos"],
  authors: [{ name: "Elroi Hub" }],
  openGraph: {
    title: "Elroi Hub — Creative. Strategic. Built to dominate.",
    description: "Elroi Hub combines creativity, technology, and AI to help brands build lasting influence.",
    url: "https://elroihub.com",
    siteName: "Elroi Hub",
    locale: "en_NG",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Elroi Hub", description: "Creative. Strategic. Built to dominate." },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/logo-mark.png", type: "image/png", sizes: "2731x4096" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0c200e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
