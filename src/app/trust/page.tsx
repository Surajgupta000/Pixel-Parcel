"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { ShieldCheck, Search, ShieldAlert, Award, Camera, Check, RefreshCw, Box, Lock } from "lucide-react";
import Image from "next/image";

export default function TrustPage() {
  // Serial Verification state
  const [serialQuery, setSerialQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Scanner Simulator state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: idle, 1: scanning, 2: success

  // Warranty Form state
  const [warrantyForm, setWarrantyForm] = useState({
    serial: "",
    name: "",
    email: "",
    retailer: "concierge",
    agreed: false
  });
  const [warrantySubmitted, setWarrantySubmitted] = useState(false);

  const handleVerifySerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialQuery) return;

    setIsChecking(true);
    setVerificationResult(null);

    // Simulate database lookup
    setTimeout(() => {
      const cleanQuery = serialQuery.trim().toUpperCase().replace(/_/g, "-");
      const matchedProduct = products.find(p => p.sku === cleanQuery || cleanQuery.includes(p.id.toUpperCase()));

      if (matchedProduct) {
        setVerificationResult({
          success: true,
          productName: matchedProduct.name,
          sku: matchedProduct.sku,
          assemblyDate: "October 14, 2025",
          calibrations: "CoSc Chronometer Compliant (+2s/day)",
          status: "Officially Cataloged",
          blockchainHash: "0x89ac...98d2f"
        });
      } else {
        setVerificationResult({
          success: false,
          message: "Serial signature not recognized in our database registry."
        });
      }
      setIsChecking(false);
    }, 1500);
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanStep(1);
    
    // Simulate camera activation and scan grid
    setTimeout(() => {
      setScanStep(2);
      // Automatically load the first product Chronos Horizon details
      setVerificationResult({
        success: true,
        productName: "Chronos Horizon",
        sku: "PP-CH-8921",
        assemblyDate: "October 14, 2025",
        calibrations: "CoSc Chronometer Compliant (+2s/day)",
        status: "Officially Cataloged",
        blockchainHash: "0x89ac...98d2f"
      });
      setIsScanning(false);
    }, 2500);
  };

  const handleWarrantyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warrantyForm.serial || !warrantyForm.name || !warrantyForm.email || !warrantyForm.agreed) return;

    setWarrantySubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-20">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-widest uppercase">Trust & Verification</h1>
        <p className="text-xs uppercase tracking-[0.3em] text-[#8C7853]">Where digital precision validates mechanical artistry</p>
      </div>

      {/* Grid: 1. Checking Serial & QR Scanning - COMMENTED OUT
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* CHECK SERIAL FORM }
        <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-serif text-white tracking-wide flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary-gold" />
              Caliber Registry Checker
            </h3>
            <p className="text-xs text-zinc-500 font-light">
              Enter the unique laser-etched serial code found on your watch caseback or physical warranty card.
            </p>
          </div>

          <form onSubmit={handleVerifySerial} className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. PP-CH-8921"
              value={serialQuery}
              onChange={(e) => setSerialQuery(e.target.value)}
              className="flex-1 bg-[#070707] border border-zinc-800 text-zinc-355 placeholder-zinc-700 px-4 py-3 text-xs focus:outline-none focus:border-primary-gold rounded font-mono uppercase"
            />
            <button 
              type="submit"
              disabled={isChecking}
              className="px-6 py-3 bg-primary-gold hover:bg-gold-light disabled:bg-zinc-800 text-black disabled:text-zinc-550 text-xs font-bold uppercase tracking-widest transition-colors rounded flex items-center gap-2"
            >
              {isChecking ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Search className="h-4.5 w-4.5" />}
              Verify
            </button>
          </form>

          {/* Results Output }
          {verificationResult && (
            <div className={`p-5 rounded border animate-fade-in ${
              verificationResult.success 
                ? "bg-green-950/20 border-green-500/20 text-green-400" 
                : "bg-red-952/20 border-red-500/20 text-red-400"
            }`}>
              {verificationResult.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 bg-green-500/10 p-0.5 rounded-full" />
                    <span className="font-bold text-sm">Registry Match Confirmed</span>
                  </div>
                  <div className="text-xs text-zinc-300 space-y-1 font-mono">
                    <p>Model: {verificationResult.productName}</p>
                    <p>SKU: {verificationResult.sku}</p>
                    <p>Manufacture Date: {verificationResult.assemblyDate}</p>
                    <p>Calibrations: {verificationResult.calibrations}</p>
                    <p>Ledger Hash: <span className="text-zinc-500">{verificationResult.blockchainHash}</span></p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 text-xs">
                  <ShieldAlert className="h-5 w-5 flex-shrink-0 text-red-400" />
                  <div>
                    <span className="font-bold text-sm block mb-1">Unknown Signature</span>
                    <p className="text-zinc-400">{verificationResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips }
          <div className="bg-[#070707] border border-zinc-955 p-4 rounded text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Registry Tips:</span>
            <ul className="list-disc pl-4 text-zinc-400 space-y-1 leading-relaxed">
              <li>Test using catalog SKU code: <strong className="text-primary-gold font-mono">PP-CH-8921</strong> (Chronos Horizon) or <strong className="text-primary-gold font-mono">PP-VC-8100</strong>.</li>
              <li>Input codes exactly as written including dashes.</li>
            </ul>
          </div>
        </div>

        {/* SCAN QR SIMULATOR }
        <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 md:p-8 space-y-6 h-full flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-serif text-white tracking-wide flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary-gold" />
              QR Code Scanner Simulator
            </h3>
            <p className="text-xs text-zinc-500 font-light">
              Simulate scanning the QR watermark on the physical watch presentation case using your device camera.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center py-6">
            {!isScanning && scanStep !== 2 ? (
              <button 
                onClick={handleStartScan}
                className="px-8 py-6 border border-dashed border-zinc-800 hover:border-primary-gold/40 rounded-xl flex flex-col items-center gap-3 transition-colors bg-[#080808]/55 text-zinc-450 hover:text-primary-gold"
              >
                <Camera className="h-10 w-10 animate-pulse text-primary-gold" />
                <span className="text-xs uppercase tracking-widest font-bold">Simulate Scanning Camera</span>
              </button>
            ) : isScanning ? (
              <div className="relative w-full max-w-[280px] aspect-square rounded-xl border border-zinc-800 overflow-hidden bg-black flex flex-col items-center justify-center p-4">
                {/* Simulated scan grid }
                <div className="absolute inset-4 border border-primary-gold/40 rounded opacity-65 flex items-center justify-center">
                  {/* Glowing laser line }
                  <div className="absolute w-full h-[1px] bg-primary-gold animate-bounce shadow-md shadow-primary-gold" />
                  <div className="h-20 w-20 border border-zinc-700 rounded-full border-dashed animate-spin-slow opacity-20" />
                </div>
                <span className="relative z-10 text-[9px] uppercase tracking-widest font-mono text-primary-gold">Calibrating Lens...</span>
              </div>
            ) : (
              <div className="border border-green-500/20 bg-green-950/10 p-6 rounded-xl text-center space-y-4 max-w-sm">
                <div className="inline-flex p-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-white text-sm">QR Validation Verified</h4>
                <p className="text-xs text-zinc-400">Watch serial matches registry catalog Chronos Horizon (PP-CH-8921).</p>
                <button 
                onClick={() => setScanStep(0)}
                  className="px-4 py-1.5 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded"
                >
                  Scan Again
                </button>
              </div>
            )}
          </div>
        </div>

      </section>
      */}

      {/* Grid: 2. Sourcing Pillars & Warranty Registration */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* SOURCING PILLARS */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Our Integrity</span>
            <h3 className="text-3xl font-serif text-white tracking-wide">The Pillars of Sourcing</h3>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-primary-gold/10 p-3 rounded-full border border-primary-gold/20 text-primary-gold h-fit">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-white text-base">Atelier Calibration Standards</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Every automatic balance wheel and escapement spring is regulated across 5 positional axes and temperature variations. We hold certifications confirming compliance with chronometer margins (+6 to -4 seconds deviation daily limit).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-primary-gold/10 p-3 rounded-full border border-primary-gold/20 text-primary-gold h-fit">
                <Box className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-white text-base">Unboxing Box & Certified Paperwork</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Our parcels are shipped in tamper-evident steel packaging containers holding the luxury piano wood box. We provide original manuals, physical micro-stamped serial certificates, and high-precision calibrating tools.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-primary-gold/10 p-3 rounded-full border border-primary-gold/20 text-primary-gold h-fit">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-white text-base">Encrypted Ledger Records</h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  To eliminate luxury watch counterfeiting, we record each unique watch serial hash on a private security database network, preventing fraudulent warranty claims or serial duplicate replications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WARRANTY REGISTRATION FORM */}
        <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-serif text-white tracking-wide">Escapement Warranty Registry</h3>
            <p className="text-xs text-zinc-550">
              Register your newly acquired timepiece within 30 days of delivery to activate your 5-Year complimentary concierge mechanism warranty.
            </p>
          </div>

          {!warrantySubmitted ? (
            <form onSubmit={handleWarrantyRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Watch Serial Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. PP-VC-8100"
                  value={warrantyForm.serial}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, serial: e.target.value })}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Owner's Name"
                    value={warrantyForm.name}
                    onChange={(e) => setWarrantyForm({ ...warrantyForm, name: e.target.value })}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Private Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="email@example.com"
                    value={warrantyForm.email}
                    onChange={(e) => setWarrantyForm({ ...warrantyForm, email: e.target.value })}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Acquired Retailer Source</label>
                <select 
                  value={warrantyForm.retailer}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, retailer: e.target.value })}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
                >
                  <option value="concierge">Pixel & Parcel Concierge (Atelier)</option>
                  <option value="auction">Certified Luxury Watch Partner</option>
                  <option value="gift">Legacy Gift Transfer</option>
                </select>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400 hover:text-white select-none pt-2">
                <input 
                  type="checkbox" 
                  required
                  checked={warrantyForm.agreed}
                  onChange={(e) => setWarrantyForm({ ...warrantyForm, agreed: e.target.checked })}
                  className="accent-primary-gold rounded mt-0.5"
                />
                <span className="text-[11px] leading-snug">I certify that the information entered is accurate, and I accept the terms of the 5-Year Mechanical escapement agreement.</span>
              </label>

              <button 
                type="submit"
                className="w-full py-3 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors rounded shadow-lg shadow-primary-gold/5"
              >
                Register Warranty
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 animate-bounce">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-white text-base">Warranty Registered Successfully</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Your 5-Year escapement mechanics coverage is now active for serial number <span className="font-mono text-white uppercase">{warrantyForm.serial}</span>. A confirmation ledger copy has been sent to {warrantyForm.email}.
              </p>
              <button 
                onClick={() => setWarrantySubmitted(false)}
                className="px-5 py-2 border border-zinc-800 text-zinc-450 hover:text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                Register Another Timepiece
              </button>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
