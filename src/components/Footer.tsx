"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Truck, ShieldAlert } from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="9.7 9 9.7 15 14.5 12 9.7 9" />
  </svg>
);

interface TimeZoneClock {
  city: string;
  timeZone: string;
  time: string;
}

export default function Footer() {
  const [clocks, setClocks] = useState<TimeZoneClock[]>([
    { city: "London", timeZone: "Europe/London", time: "--:--:--" },
    { city: "Geneva", timeZone: "Europe/Zurich", time: "--:--:--" },
    { city: "Mumbai", timeZone: "Asia/Kolkata", time: "--:--:--" },
    { city: "Tokyo", timeZone: "Asia/Tokyo", time: "--:--:--" },
    { city: "New York", timeZone: "America/New_York", time: "--:--:--" }
  ]);

  useEffect(() => {
    const updateClocks = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };

      setClocks(prev =>
        prev.map(clock => {
          try {
            const timeStr = new Intl.DateTimeFormat("en-US", {
              ...options,
              timeZone: clock.timeZone
            }).format(new Date());
            return { ...clock, time: timeStr };
          } catch {
            return clock;
          }
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-[#040404] border-t border-zinc-900 text-zinc-400 text-sm mt-auto">

      {/* Dynamic Watchmaker Timezone Clocks */}
      <div className="border-b border-zinc-950 bg-[#060606] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4 text-xs font-mono tracking-wider">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-sans font-bold">Horological Stations:</span>
          <div className="flex flex-wrap gap-6 sm:gap-10 mx-auto sm:mx-0">
            {clocks.map((clock) => (
              <div key={clock.city} className="flex items-center gap-2">
                <span className="text-zinc-600 font-sans uppercase text-[10px]">{clock.city}</span>
                <span className="text-primary-gold font-bold">{clock.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Column */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <h3 className="text-lg font-serif text-white tracking-widest uppercase">Pixel & Parcel</h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
            We fuse modern pixel-level digital precision with the heritage craftsmanship of physical parcel delivery. Each timepiece represents our dedication to ultimate chronometric precision and client security.
          </p>
          <div className="space-y-2 pt-2 text-xs text-zinc-400">
            <p className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-primary-gold tracking-widest font-mono">Hours:</span>
              <span>Mon - Sat | 10:00 - 19:00 IST</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-primary-gold tracking-widest font-mono">Email:</span>
              <a href="mailto:concierge@pixelparcel.com" className="hover:text-primary-gold transition-colors">pixelparcelindia@gmail.com</a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-primary-gold tracking-widest font-mono">Telephone:</span>
              <a href="tel:+912269829826" className="hover:text-primary-gold transition-colors">+91 8950820757</a>
            </p>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="text-zinc-500 hover:text-primary-gold transition-colors transition-transform duration-300 hover:scale-110" aria-label="Instagram">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="#" className="text-zinc-500 hover:text-primary-gold transition-colors transition-transform duration-300 hover:scale-110" aria-label="Facebook">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="#" className="text-zinc-500 hover:text-primary-gold transition-colors transition-transform duration-300 hover:scale-110" aria-label="Twitter">
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a href="#" className="text-zinc-500 hover:text-primary-gold transition-colors transition-transform duration-300 hover:scale-110" aria-label="YouTube">
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Sitemap Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Navigations</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/shop" className="hover:text-primary-gold transition-colors">The Watch Gallery</Link>
            </li>
            <li>
              <Link href="/trust" className="hover:text-primary-gold transition-colors">Authenticity Check</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary-gold transition-colors">Our Craft & Story</Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-primary-gold transition-colors">Merchant Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Legal & Trust Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Certifications</h4>
          <ul className="space-y-2.5 text-xs text-zinc-500">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary-gold flex-shrink-0" />
              <span>Tamper-Proof Certificates</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary-gold flex-shrink-0" />
              <span>SSL 256-bit Secure Gateway</span>
            </li>
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary-gold flex-shrink-0" />
              <span>Complimentary Insured Delivery</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary-gold flex-shrink-0" />
              <span>5-Year Escapement Warranty</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Payment Partner Badges and Copyright */}
      <div className="bg-[#030303] border-t border-zinc-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-650">
            © {new Date().getFullYear()} Pixel & Parcel. All Rights Reserved. Crafted for watch enthusiasts.
          </p>

          {/* Secure Badges */}
          <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-mono tracking-widest">
            <span className="border border-zinc-800 px-2 py-0.5 rounded">RAZORPAY SECURE</span>
            <span className="border border-zinc-800 px-2 py-0.5 rounded">NORTON SECURED</span>
            <span className="border border-zinc-800 px-2 py-0.5 rounded">VERIFIED AUTHENTICITY</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
