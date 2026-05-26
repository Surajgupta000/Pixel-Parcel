"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { X, Mail, Sparkles, Check } from "lucide-react";

export default function NewsletterPopup() {
  const { exitIntentSeen, setExitIntentSeen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (exitIntentSeen) return;

    // Wait 5 seconds before activation to prevent immediate triggers
    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY < 15) {
          setIsOpen(true);
          setExitIntentSeen(true);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      // Clean up event listener if component unmounts before trigger
      document.removeEventListener("mouseleave", () => {});
    };
  }, [exitIntentSeen, setExitIntentSeen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative glass-panel-gold rounded-lg max-w-lg w-full p-8 md:p-10 shadow-2xl text-center overflow-hidden">
        
        {/* Subtle background clock elements */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full border border-primary-gold/10 opacity-30 animate-spin-slow pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full border border-zinc-800 opacity-20 pointer-events-none" />

        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-primary-gold transition-colors p-1"
          aria-label="Close newsletter popup"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="inline-flex p-3 bg-primary-gold/10 border border-primary-gold/20 rounded-full mb-4 text-primary-gold">
              <Mail className="h-6 w-6" />
            </div>
            
            <h3 className="text-3xl font-serif text-white tracking-wide mb-2">Join the Watch Circle</h3>
            
            <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-6">
              Subscribe to unlock early access to limited editions and receive <span className="text-primary-gold font-semibold">10% off</span> your initial purchase.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email"
                placeholder="Enter your private email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0A0A0A] border border-zinc-800 text-zinc-200 placeholder-zinc-650 px-4 py-3 text-sm focus:outline-none focus:border-primary-gold transition-colors rounded text-center"
              />
              <button 
                type="submit"
                className="w-full py-3 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded shadow-lg shadow-primary-gold/10 hover:shadow-primary-gold/25"
              >
                Request Exclusive Code
              </button>
            </form>

            <p className="text-[10px] text-zinc-550 uppercase tracking-wider mt-4">
              Pure horology. No spam. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="py-6">
            <div className="inline-flex p-3 bg-green-500/10 border border-green-500/20 rounded-full mb-4 text-green-400 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            
            <h3 className="text-2xl font-serif text-white tracking-wide mb-2">Welcome to the Circle</h3>
            
            <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-6">
              Your registration is complete. Use code below during checkout for 10% off your timepiece.
            </p>

            <div className="bg-[#0A0A0A] border border-dashed border-primary-gold/40 px-6 py-4 rounded mb-6 select-all cursor-pointer">
              <span className="font-mono text-xl text-primary-gold font-bold tracking-widest uppercase">LUXURY10</span>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Click to copy code</p>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-widest transition-colors rounded text-zinc-300"
            >
              Enter The Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
