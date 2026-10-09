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
  metadataBase: new URL("https://charisiss.gr"),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "el_GR",
    siteName: site.name,
    images: ["/images/portrait.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0b",
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
