import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CompareDrawer from "@/components/CompareDrawer";
import NewsletterPopup from "@/components/NewsletterPopup";
import TrustBar from "@/components/TrustBar";
import SoundManager from "@/components/SoundManager";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pixel & Parcel | Luxury Mechanical Timepieces",
  description: "Where modern digital precision meets physical artisanal craftsmanship. Discover our range of certified authentic mechanical watches.",
  keywords: "luxury watches, mechanical watch, automatic watch, tourbillon, titanium watch, gold watch, timepieces",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Pixel & Parcel | Luxury Mechanical Timepieces",
    description: "Where time meets trust. Authentic watchmaker craftsmanship verified by blockchain serial certificate.",
    images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000"],
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#080808] text-[#F5F5F7]"
        suppressHydrationWarning
      >
        {/* Global sensory ticking sound */}
        <SoundManager />

        {/* Global sticky navigation header */}
        <Navbar />

        {/* Sticky trust ribbon just below navbar */}
        <TrustBar />

        {/* Main page content container */}
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>

        {/* Global sticky/floating utilities */}
        <CartDrawer />
        <CompareDrawer />
        <NewsletterPopup />

        {/* Global luxury clocks and links footer */}
        <Footer />
      </body>
    </html>
  );
}
