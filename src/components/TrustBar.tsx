"use client";

import { ShieldCheck, Truck, RotateCcw, Box, Lock } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="sticky top-[116px] z-40 w-full bg-[#0B0B0B]/90 backdrop-blur-md border-b border-zinc-900 py-3 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F5F5F7] whitespace-nowrap overflow-x-auto scrollbar-none gap-6 md:gap-10">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-gold" />
            <span className="text-zinc-300">100% Authentic Guarantee</span>
          </div>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Truck className="h-3.5 w-3.5 text-primary-gold" />
            <span className="text-zinc-300">Free Insured Shipping</span>
          </div>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <RotateCcw className="h-3.5 w-3.5 text-primary-gold" />
            <span className="text-zinc-300">7-Day Easy Returns</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 mx-auto sm:mx-0">
            <Box className="h-3.5 w-3.5 text-primary-gold" />
            <span className="text-zinc-300">Original Box & Papers</span>
          </div>
          <div className="hidden md:flex items-center gap-2 mx-auto sm:mx-0">
            <Lock className="h-3.5 w-3.5 text-primary-gold" />
            <span className="text-zinc-300">Secure Payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
