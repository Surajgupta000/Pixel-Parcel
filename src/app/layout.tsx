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
  description: "Where modern digital precision meets physical artisanal craftsmanship. Discover our curated vault of certified authentic mechanical and automatic watches.",
  keywords: [
    "Pixel & Parcel",
    "luxury watches",
    "mechanical watches",
    "automatic watches",
    "watchmaker atelier",
    "blockchain watch certificate",
    "authentic luxury timepieces",
    "Swiss craftsmanship",
    "tourbillon",
    "chronometer",
    "luxury watch brand",
    "buy mechanical watches",
    "timepieces online"
  ].join(", "),
  metadataBase: new URL("https://pixel-parcel.vercel.app"),
  openGraph: {
    title: "Pixel & Parcel | Luxury Mechanical Timepieces",
    description: "Where time meets trust. Curated high-precision mechanical timepieces verified by secure blockchain authenticity certificates.",
    url: "https://pixel-parcel.vercel.app",
    siteName: "Pixel & Parcel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og_share_logo.png",
        width: 1200,
        height: 630,
        alt: "Pixel & Parcel - Where time meets trust"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel & Parcel | Luxury Mechanical Timepieces",
    description: "Where time meets trust. Curated high-precision mechanical timepieces verified by secure blockchain authenticity certificates.",
    images: ["/og_share_logo.png"],
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const savedTheme = localStorage.getItem('pp_theme');
            const parsedTheme = savedTheme ? JSON.parse(savedTheme) : 'light';
            if (parsedTheme === 'light') {
              document.documentElement.classList.add('light');
            } else {
              document.documentElement.classList.remove('light');
            }
          } catch (e) {}
        ` }} />
      </head>
      <body
        className="min-h-full flex flex-col"
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
