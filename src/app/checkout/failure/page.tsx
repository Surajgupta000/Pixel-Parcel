"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ShieldAlert, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-8 flex-grow flex flex-col justify-center">
      
      <div className="inline-flex p-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-400">
        <ShieldAlert className="h-10 w-10 animate-pulse" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-serif text-white tracking-widest uppercase">Transaction Stalled</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#8C7853]">The mechanical alignment has paused</p>
        <p className="text-xs text-zinc-450 leading-relaxed max-w-sm mx-auto">
          We were unable to process your payment authorization. This can occur due to card restrictions, insufficient limits, or verification timeout.
        </p>
      </div>

      {orderId !== "N/A" && (
        <div className="bg-[#0E0E0E] border border-zinc-900 px-4 py-3 rounded text-xs font-mono text-zinc-500">
          <span>Failed Order Reference: {orderId}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link 
          href="/checkout"
          className="w-full py-3 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Acquisition
        </Link>
        <Link 
          href="/shop"
          className="w-full py-3 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Gallery
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-600 uppercase tracking-wider">
        <AlertTriangle className="h-3 w-3 text-primary-gold" />
        <span>No funds have been debited</span>
      </div>

    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 font-mono tracking-widest uppercase text-xs">Processing Transaction failure...</p>
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
}
