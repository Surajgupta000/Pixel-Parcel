"use client";

import { useStore } from "@/store/useStore";
import { ShoppingBag, Heart, ArrowLeftRight, Volume2, VolumeX, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { cart, wishlist, compareList, isSoundEnabled, toggleSound, setCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Total quantity in cart
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-zinc-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex flex-col group select-none">
          <span className="text-xl sm:text-2xl font-serif tracking-[0.2em] uppercase text-white transition-all duration-500 group-hover:text-primary-gold">
            Pixel & Parcel
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C7853] mt-0.5 font-sans">
            Where time meets trust
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <Link href="/" className="hover:text-white hover:underline decoration-primary-gold underline-offset-4 transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-white hover:underline decoration-primary-gold underline-offset-4 transition-colors">
            Collections
          </Link>
          <Link href="/trust" className="hover:text-white hover:underline decoration-primary-gold underline-offset-4 transition-colors">
            Authenticity
          </Link>
          <Link href="/about" className="hover:text-white hover:underline decoration-primary-gold underline-offset-4 transition-colors">
            About Us
          </Link>
          {/*
          <Link href="/admin" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            Dashboard
          </Link>
          */}
        </nav>

        {/* Action Icons Panel */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Sound Toggle (watch heartbeat simulator) */}
          <button 
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-all duration-500 flex items-center justify-center relative group ${
              mounted && isSoundEnabled 
                ? "border-primary-gold/45 bg-primary-gold/5 text-primary-gold animate-pulse-gold" 
                : "border-zinc-800 text-zinc-550 hover:border-zinc-700"
            }`}
            title={mounted && isSoundEnabled ? "Mute Mechanical Tick" : "Listen to Mechanical Tick"}
            aria-label="Toggle mechanical ticking sound"
          >
            {mounted && isSoundEnabled ? (
              <>
                <Volume2 className="h-4 w-4" />
                {/* Visual ticking wheel */}
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary-gold animate-ping" />
              </>
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {/* Wishlist Link */}
          <Link 
            href="/shop?filter=wishlist" 
            className="p-2 text-zinc-400 hover:text-white relative transition-colors"
            title="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {mounted && wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary-gold text-black font-sans text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-zinc-950">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Compare Counter */}
          {mounted && compareList.length > 0 && (
            <div 
              className="p-2 text-primary-gold relative flex items-center justify-center border border-primary-gold/20 bg-primary-gold/5 rounded-full"
              title="Compare Drawer Active"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-white text-black font-sans text-[8px] font-extrabold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-zinc-950">
                {compareList.length}
              </span>
            </div>
          )}

          {/* Cart Bag Trigger */}
          <button 
            onClick={() => setCartOpen(true)}
            className="p-2 text-zinc-400 hover:text-white relative transition-colors"
            title="Open Vault"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {mounted && cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary-gold text-black font-sans text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-zinc-950">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Links */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-zinc-900 px-6 py-6 flex flex-col gap-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 hover:text-white"
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 hover:text-white"
          >
            Collections
          </Link>
          <Link 
            href="/trust" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 hover:text-white"
          >
            Authenticity
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 hover:text-white"
          >
            About Us
          </Link>
          {/*
          <Link 
            href="/admin" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-zinc-600 hover:text-zinc-400"
          >
            Dashboard
          </Link>
          */}
        </div>
      )}
    </header>
  );
}
