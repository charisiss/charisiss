import type { Metadata, Viewport } from "next";
import { Manrope, Orbitron } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "greek"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Charisis Samaras", url: site.url }],
  creator: "Charisis Samaras",
  keywords: [
    "Charisis Samaras",
    "Charisiss",
    "Full-Stack Engineer",
    "Web Development",
    "Next.js",
    "Thessaloniki",
    "Κατασκευή Ιστοσελίδων",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.shareTitle,
    description: site.shareDescription,
    type: "website",
    locale: "en_US",
    alternateLocale: ["el_GR"],
    url: site.url,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.shareTitle,
    description: site.shareDescription,
  },
  appleWebApp: {
    title: site.name,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${orbitron.variable} antialiased`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <SmoothScroll>{children}</SmoothScroll>
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
