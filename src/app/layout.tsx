import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://marianrivera-fanportal.local"),
  title: "Marian Rivera | Official VIP Fan Portal",
  description: "Official interactive celebrity fan portal for Marian Rivera-Dantes. Chat directly with Marian, listen to voice audio, read fan letters, and explore her iconic legacy.",
  keywords: ["Marian Rivera", "Dingdong Dantes", "DongYan", "Rewind", "Balota", "Marimar", "Amaya", "Flora Vida by Marian", "Kapuso"],
  authors: [{ name: "Marian Rivera Official Fan Portal" }],
  openGraph: {
    title: "Marian Rivera | Official VIP Fan Portal",
    description: "Chat directly with Marian Rivera, listen to voice greetings, and connect with fans.",
    images: ["/images/marian-avatar.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-[#060608] text-white antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
