"use client";

import { useStore } from "@/store/useStore";
import { ShoppingBag, Heart, ArrowLeftRight, Volume2, VolumeX, Menu, X, Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { cart, wishlist, compareList, isSoundEnabled, toggleSound, setCartOpen, theme, toggleTheme } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menExpanded, setMenExpanded] = useState(false);
  const [womenExpanded, setWomenExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize theme state from localStorage
    const savedTheme = localStorage.getItem('pp_theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed === 'light' || parsed === 'dark') {
          useStore.setState({ theme: parsed });
        }
      } catch (e) {
        console.error("Error restoring theme on mount", e);
      }
    }
  }, []);

  // Total quantity in cart
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-zinc-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 items-center">
        
        {/* Row 1: Centered Brand Logo */}
        <div className="flex justify-center w-full">
          <Link href="/" className="flex flex-col items-center group select-none text-center">
            <span className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.25em] uppercase text-white transition-all duration-500 group-hover:text-primary-gold">
              Pixel & Parcel
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C7853] mt-1 font-sans font-semibold">
              Where time meets trust
            </span>
          </Link>
        </div>

        {/* Row 2: Navigation Links & Actions */}
        <div className="w-full flex items-center justify-between border-t border-zinc-900/60 pt-2.5">
          
          {/* Left spacer for desktop symmetry, or mobile menu button */}
          <div className="md:w-1/4 flex items-center">
            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400 md:w-2/4">
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
          </nav>

          {/* Right: Action Icons Panel */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 md:w-1/4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
              title={mounted && theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle visual theme"
            >
              {!mounted ? (
                <div className="h-4 w-4" />
              ) : theme === "light" ? (
                <Moon className="h-4 w-4 text-[#8C7853]" />
              ) : (
                <Sun className="h-4 w-4 text-primary-gold" />
              )}
            </button>

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
          </div>
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

          {/* Categories Section for Mobile View */}
          <div className="border-t border-zinc-900 pt-4 mt-2">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-[0.2em] block mb-2">Shop Categories</span>
            
            {/* Men Category */}
            <div className="space-y-1">
              <div className="flex items-center justify-between py-2">
                <Link 
                  href="/shop?gender=men" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-white text-zinc-300 font-bold"
                >
                  Men
                </Link>
                <button 
                  onClick={() => setMenExpanded(!menExpanded)} 
                  className="p-1 text-zinc-550 hover:text-white"
                  aria-label="Toggle Men Subcategories"
                >
                  {menExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              
              {menExpanded && (
                <div className="pl-4 flex flex-col gap-2 border-l border-zinc-900 ml-1 py-1">
                  {["Casual", "Formal", "Digital", "Smart"].map(style => (
                    <Link
                      key={style}
                      href={`/shop?gender=men&style=${style}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] text-zinc-500 hover:text-primary-gold transition-colors py-1 normal-case font-medium tracking-wide"
                    >
                      {style} Watches
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Women Category */}
            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-between py-2">
                <Link 
                  href="/shop?gender=women" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-white text-zinc-300 font-bold"
                >
                  Women
                </Link>
                <button 
                  onClick={() => setWomenExpanded(!womenExpanded)} 
                  className="p-1 text-zinc-555 hover:text-white"
                  aria-label="Toggle Women Subcategories"
                >
                  {womenExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              
              {womenExpanded && (
                <div className="pl-4 flex flex-col gap-2 border-l border-zinc-900 ml-1 py-1">
                  {["Casual", "Formal", "Digital", "Smart"].map(style => (
                    <Link
                      key={style}
                      href={`/shop?gender=women&style=${style}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] text-zinc-500 hover:text-primary-gold transition-colors py-1 normal-case font-medium tracking-wide"
                    >
                      {style} Watches
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Kids Category */}
            <div className="py-2 mt-2">
              <Link 
                href="/shop?gender=kids" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white text-zinc-300 font-bold block"
              >
                Kids Only
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
