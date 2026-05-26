"use client";

import Link from "next/link";
import { Compass, RefreshCw, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-8 flex-grow flex flex-col justify-center items-center">
      
      {/* Broken Escapement animation in CSS */}
      <div className="relative h-32 w-32 flex items-center justify-center">
        {/* Outer broken gear */}
        <div className="absolute inset-0 rounded-full border border-dashed border-primary-gold/40 animate-spin-slow opacity-40" />
        {/* Inner gears */}
        <div className="absolute h-20 w-20 rounded-full border-2 border-[#8C7853]/25 animate-spin-reverse opacity-20 border-t-transparent" />
        
        {/* Center broken anchor symbol */}
        <Compass className="h-10 w-10 text-primary-gold animate-bounce" />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-serif text-white tracking-widest uppercase">Time Stalled</h1>
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C7853]">Metaphorical Gear Slip (404)</p>
        <p className="text-xs text-zinc-450 leading-relaxed max-w-sm mx-auto">
          The balance spring has slipped. This moment in time does not exist in our calibrations, or has ceased ticking.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link 
          href="/"
          className="w-full py-3 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back in Time (Home)
        </Link>
        <Link 
          href="/shop"
          className="w-full py-3 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded"
        >
          <Compass className="h-4 w-4" />
          The Watch Gallery
        </Link>
      </div>

      <div className="text-[9px] text-zinc-650 uppercase tracking-widest font-mono">
        Pixel & Parcel Atelier Genève
      </div>

    </div>
  );
}
