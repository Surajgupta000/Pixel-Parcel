"use client";

import { useStore } from "@/store/useStore";
import { X, Plus, Minus, Trash2, Tag, Lock, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setCartOpen, 
    updateQuantity, 
    removeFromCart, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon 
  } = useStore();
  
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  if (!isCartOpen) return null;

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const gstTax = (subtotal - discountAmount) * 0.18; // 18% GST for luxury watches
  const total = subtotal - discountAmount + gstTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponError("");
      setCouponCode("");
    } else {
      setCouponError(res.message);
      setCouponSuccess("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess("");
    setCouponError("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Slide-out panel */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-[#0D0D0D] border-l border-zinc-800 shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-850 flex items-center justify-between">
            <h2 className="text-xl font-serif text-white tracking-wide">Your Vault ({cart.length})</h2>
            <button 
              onClick={() => setCartOpen(false)}
              className="text-gray-400 hover:text-primary-gold p-1 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-900 scrollbar-none">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="border border-dashed border-zinc-800 p-6 rounded-full mb-4 text-zinc-600">
                  <Image 
                    src="/favicon.ico" 
                    alt="Empty Vault" 
                    width={32} 
                    height={32} 
                    className="opacity-20 grayscale"
                  />
                </div>
                <h3 className="text-lg font-serif text-white tracking-wide mb-1">Your Vault is Empty</h3>
                <p className="text-xs text-gray-550 max-w-xs mb-6">Explore our curated collections of luxury mechanical timepieces.</p>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="px-6 py-2.5 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors rounded"
                >
                  Return to Gallery
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="py-4 flex gap-4">
                  {/* Image */}
                  <div className="h-20 w-20 relative overflow-hidden rounded border border-zinc-800 bg-zinc-950 flex-shrink-0">
                    <Image 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      fill 
                      className="object-cover" 
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-serif text-white text-sm leading-tight truncate">{item.product.name}</h4>
                        <span className="text-primary-gold text-xs font-semibold whitespace-nowrap">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.product.caliber}</p>
                      
                      {/* Engraving */}
                      {item.engraving && (
                        <div className="mt-1 bg-zinc-900/60 border border-zinc-850 px-2 py-0.5 rounded inline-block">
                          <p className="text-[10px] text-zinc-400 italic">Engraving: &ldquo;{item.engraving}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    {/* Quantity controls & delete */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-800 rounded bg-[#070707] scale-90 origin-left">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.engraving)}
                          className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.engraving)}
                          className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product.id, item.engraving)}
                        className="text-zinc-650 hover:text-red-400 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Checkout Summary Panel */}
          {cart.length > 0 && (
            <div className="border-t border-zinc-850 bg-zinc-950/70 p-6 space-y-4">
              
              {/* Coupon Form */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#0A0A0A] border border-zinc-800 text-zinc-300 placeholder-zinc-600 px-3 py-2 text-xs focus:outline-none focus:border-primary-gold rounded font-mono uppercase"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2 border border-zinc-800 hover:border-zinc-600 text-zinc-300 text-[10px] font-bold uppercase tracking-widest transition-colors rounded"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-primary-gold/5 border border-primary-gold/20 px-3 py-2 rounded text-xs">
                  <div className="flex items-center gap-1.5 text-primary-gold">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="font-semibold font-mono">{appliedCoupon.code} ({appliedCoupon.discountPercent}% Off)</span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-[10px] text-red-450">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-green-450">{couponSuccess}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F5F5F7]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-450">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-primary-gold uppercase tracking-wider font-semibold text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="text-[#F5F5F7]">₹{gstTax.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-zinc-850 my-2 pt-2 flex justify-between text-sm font-semibold text-white">
                  <span>Total Due</span>
                  <span className="text-primary-gold font-bold">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link 
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded shadow-lg shadow-primary-gold/5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Proceed to Secure Checkout
                </Link>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors rounded text-center"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-550 uppercase tracking-widest pt-2">
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  <span>Razorpay Checkout</span>
                </div>
                <span>•</span>
                <span>Fully Insured Transit</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
