"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { Check, ShieldCheck, Compass, Box, Truck, ArrowRight, Download } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || `ord_${Math.random().toString(36).substring(2, 11)}`;
  
  // Simulated tracking step state
  const [trackingStep, setTrackingStep] = useState(1);

  useEffect(() => {
    // Increment tracking step over time to simulate a live factory calibration
    const timer1 = setTimeout(() => setTrackingStep(2), 5000);
    const timer2 = setTimeout(() => setTrackingStep(3), 12000);
    const timer3 = setTimeout(() => setTrackingStep(4), 22000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleDownloadInvoice = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `PIXEL & PARCEL ATELIER GENÈVE
OFFICIAL ACQUISITION RECEIPT
--------------------------------------
Invoice Reference: INV-${orderId.substring(4).toUpperCase()}
Order Reference: ${orderId}
Date: ${new Date().toLocaleDateString()}
Payment Gateway: Razorpay SECURE

DETAILS:
- Timepiece Acquisition: Fully Authenticated
- Shipping: Complimentary Fully Insured Courier
- Warranty: 5-Year Escape Mechanics Activation
- Box: Piano Lacquered Oak Wood Presentation Case

Thank you for your trust in our craftsmanship.
--------------------------------------
Where time meets trust.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `pixel_parcel_receipt_${orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex-grow space-y-12">
      
      {/* SUCCESS CONFIRMATION HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 animate-bounce">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-widest uppercase">Acquisition Successful</h1>
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-550">
          Your order has been registered in the secure ledger
        </p>
        
        <div className="bg-zinc-900/35 border border-zinc-850 p-4 rounded max-w-sm mx-auto text-xs font-mono text-zinc-400 space-y-1">
          <p>Order Reference ID: <span className="text-white font-bold">{orderId}</span></p>
          <p>Verification Ledger: <span className="text-primary-gold">0x{orderId.substring(4)}...98a7</span></p>
        </div>
      </div>

      {/* REAL-TIME ORDER TRACKING SIMULATOR */}
      <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 md:p-8 space-y-8">
        <h3 className="text-lg font-serif text-white tracking-wide text-center">Atelier Craftsmanship Progression</h3>
        
        {/* Stepper tracker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-2 relative z-10">
            <div className={`p-3 rounded-full border transition-all ${
              trackingStep >= 1 
                ? "bg-primary-gold/10 border-primary-gold text-primary-gold" 
                : "bg-zinc-950 border-zinc-900 text-zinc-700"
            }`}>
              <Check className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">Order Verified</span>
            <p className="text-[10px] text-zinc-500">Acquisition checked and ledger created</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-2 relative z-10">
            <div className={`p-3 rounded-full border transition-all ${
              trackingStep >= 2 
                ? "bg-primary-gold/10 border-primary-gold text-primary-gold" 
                : "bg-zinc-950 border-zinc-900 text-zinc-700"
            }`}>
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">Escapement Regulated</span>
            <p className="text-[10px] text-zinc-500">Amplitude & frequency checked by watchmaker</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-2 relative z-10">
            <div className={`p-3 rounded-full border transition-all ${
              trackingStep >= 3 
                ? "bg-primary-gold/10 border-primary-gold text-primary-gold" 
                : "bg-zinc-950 border-zinc-900 text-zinc-700"
            }`}>
              <Box className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">Lacquered & Sealed</span>
            <p className="text-[10px] text-zinc-500">Secured in oak chest with original papers</p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center space-y-2 relative z-10">
            <div className={`p-3 rounded-full border transition-all ${
              trackingStep >= 4 
                ? "bg-primary-gold/10 border-primary-gold text-primary-gold" 
                : "bg-zinc-950 border-zinc-900 text-zinc-700"
            }`}>
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">Insured Transit</span>
            <p className="text-[10px] text-zinc-500">Handed to courier for fully-insured delivery</p>
          </div>

        </div>

        {/* Dynamic status text */}
        <div className="text-center pt-4 text-xs font-light text-zinc-400">
          {trackingStep === 1 && <p>Current step: <strong className="text-primary-gold">Verifying transaction signature in the central ledger...</strong></p>}
          {trackingStep === 2 && <p>Current step: <strong className="text-primary-gold">Watch escapement wheel undergoing precision calibrations...</strong></p>}
          {trackingStep === 3 && <p>Current step: <strong className="text-primary-gold">Timepiece being hand-packed inside luxury piano-wood case...</strong></p>}
          {trackingStep === 4 && <p>Current step: <strong className="text-primary-gold">Package loaded on complimentary insured transit courier.</strong></p>}
        </div>
      </div>

      {/* CALL TO ACTIONS */}
      <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-serif text-white text-base">Invoicing and Paperwork</h4>
          <p className="text-xs text-zinc-500">Download a digital copy of your official luxury purchase receipt.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadInvoice}
            className="px-6 py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
          <Link 
            href="/shop"
            className="px-6 py-3 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded shadow-lg shadow-primary-gold/5"
          >
            Return to Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 font-mono tracking-widest uppercase text-xs">Authenticating Order...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
