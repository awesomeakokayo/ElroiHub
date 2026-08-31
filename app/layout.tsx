import "./globals.css";
import "./precision.css";
import "./ui-fixes.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elroi Hub — Creative. Strategic. Built to dominate.",
  description: "Elroi Hub combines creativity, technology, and AI to help brands build lasting influence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
