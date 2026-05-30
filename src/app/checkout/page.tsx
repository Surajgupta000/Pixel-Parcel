"use client";

import { useStore } from "@/store/useStore";
import { Lock, ShieldCheck, CreditCard, ChevronRight, X, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cart, appliedCoupon, clearCart, setCartOpen } = useStore();
  const router = useRouter();
  
  // Shipping Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showMockGateway, setShowMockGateway] = useState(false);
  const [mockOrderId, setMockOrderId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing && !showMockGateway) {
      router.push("/shop");
    }
  }, [cart, router, isProcessing, showMockGateway]);

  if (cart.length === 0 && !showMockGateway) return null;

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const gstTax = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + gstTax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // 1. Create order on server-side
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Order creation failed");
      }

      const orderData = data.order;

      // 2. Decide: Real vs Mock Gateway
      if (data.isMock) {
        setMockOrderId(orderData.id);
        setShowMockGateway(true);
        setIsProcessing(false);
      } else {
        // Run Real Razorpay checkout
        const options = {
          key: data.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Pixel & Parcel",
          description: "Luxury Timepiece Acquisition",
          order_id: orderData.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/checkout/success?orderId=${orderData.id}`);
            } else {
              router.push(`/checkout/failure?orderId=${orderData.id}`);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#D4AF37"
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsProcessing(false);
      }

    } catch (err) {
      console.error(err);
      alert("Payment processing initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    setShowMockGateway(false);
    setIsProcessing(true);

    try {
      // Verify payment with mock parameters
      const verifyRes = await fetch("/api/checkout/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: mockOrderId,
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
          razorpay_signature: "mock_signature_data"
        })
      });

      const verifyData = await verifyRes.json();

      if (success && verifyData.success) {
        // Save order in local history for admin dashboard simulation
        const orderHistory = JSON.parse(localStorage.getItem("pp_orders") || "[]");
        orderHistory.push({
          id: mockOrderId,
          date: new Date().toISOString(),
          customerName: formData.name,
          customerEmail: formData.email,
          total: total,
          status: "Processing",
          items: cart.map(item => ({
            name: item.product.name,
            qty: item.quantity,
            engraving: item.engraving,
            price: item.product.price
          }))
        });
        localStorage.setItem("pp_orders", JSON.stringify(orderHistory));

        clearCart();
        router.push(`/checkout/success?orderId=${mockOrderId}`);
      } else {
        router.push(`/checkout/failure?orderId=${mockOrderId}`);
      }
    } catch {
      router.push(`/checkout/failure?orderId=${mockOrderId}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-900 mb-10">
        <h1 className="text-2xl font-serif text-white tracking-wider flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary-gold" />
          Secure Acquisition Checkout
        </h1>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-550 uppercase tracking-widest font-mono">
          <span>Cart</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-bold">Billing</span>
          <ChevronRight className="h-3 w-3" />
          <span>Receipt</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* SHIPPING FORM (8 columns on lg) */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-serif text-white tracking-wide">Shipping Address</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Lord John Doe"
                className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Email Address (For Invoicing & Serial Ledger)</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="recipient@domain.com"
              className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Address Line 1</label>
            <input 
              type="text" 
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Suite 404, Horology Crescent"
              className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Address Line 2 (Apartment, suite, unit, building, floor, etc.)</label>
            <input 
              type="text" 
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              placeholder="Floor 4, Apartment 4B"
              className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">City</label>
              <input 
                type="text" 
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Mumbai"
                className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">State</label>
              <input 
                type="text" 
                name="state"
                required
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Maharashtra"
                className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">ZIP Code</label>
              <input 
                type="text" 
                name="zip"
                required
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="400001"
                className="w-full bg-[#0E0E0E] border border-zinc-900 text-zinc-300 text-xs px-3 py-2.5 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded shadow-lg shadow-primary-gold/5"
          >
            <Lock className="h-4 w-4" />
            {isProcessing ? "Initiating Transaction..." : "Proceed to Payment"}
          </button>
        </form>

        {/* ORDER SUMMARY (5 columns on lg) */}
        <aside className="lg:col-span-5 bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-serif text-white tracking-wide">Acquisitions Summary</h3>

          {/* Cart Items List */}
          <div className="divide-y divide-zinc-900 max-h-64 overflow-y-auto scrollbar-none pr-1">
            {cart.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="py-3 flex gap-3">
                <div className="h-14 w-14 relative overflow-hidden rounded border border-zinc-900 flex-shrink-0 bg-zinc-950">
                  <Image 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    fill 
                    className="object-cover" 
                    sizes="56px"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-serif text-white leading-tight truncate">{item.product.name}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Qty: {item.quantity}</span>
                  {item.engraving && (
                    <p className="text-[9px] text-zinc-500 italic mt-0.5 truncate">Engraving: &ldquo;{item.engraving}&rdquo;</p>
                  )}
                </div>
                <span className="text-xs text-primary-gold font-semibold whitespace-nowrap">
                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="h-[1px] w-full bg-zinc-900" />

          {/* Pricing breakdowns */}
          <div className="space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-450">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Shipping</span>
              <span className="text-primary-gold uppercase tracking-wider font-semibold text-[10px]">Complimentary</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (18%)</span>
              <span className="text-white">₹{gstTax.toLocaleString("en-IN")}</span>
            </div>
            <div className="border-t border-zinc-900 my-3 pt-3 flex justify-between text-sm font-semibold text-white">
              <span>Grand Total</span>
              <span className="text-primary-gold font-bold">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Secure Badges */}
          <div className="bg-[#070707] border border-zinc-950 p-4 rounded space-y-3.5">
            <div className="flex items-center gap-2.5 text-xs text-zinc-350">
              <ShieldCheck className="h-5 w-5 text-primary-gold flex-shrink-0" />
              <span>Verified Authentic Escapement calibers only.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-355">
              <Lock className="h-5 w-5 text-primary-gold flex-shrink-0" />
              <span>Norton Secured & Razorpay Gateway.</span>
            </div>
          </div>
        </aside>

      </div>

      {/* CUSTOM MOCK PAYMENTS MODAL */}
      {showMockGateway && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-zinc-800 w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-gold">
                <CreditCard className="h-5 w-5" />
                <h3 className="font-serif text-white tracking-wide">Razorpay Checkout Sandbox</h3>
              </div>
              <button 
                onClick={() => setShowMockGateway(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="bg-zinc-900/35 border border-zinc-800 p-4 rounded text-center space-y-2 text-xs">
                <p className="text-zinc-400">Order ID: <span className="font-mono text-white">{mockOrderId}</span></p>
                <p className="text-zinc-400">Amount Due: <span className="text-primary-gold font-bold text-sm">₹{total.toLocaleString("en-IN")}</span></p>
                <p className="text-[10px] text-zinc-550 leading-relaxed max-w-xs mx-auto">
                  Sandbox active since no live Razorpay credentials are found in the environment.
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleSimulatePayment(true)}
                  className="w-full py-3 bg-green-500 hover:bg-green-400 text-black text-xs font-bold uppercase tracking-widest transition-colors rounded"
                >
                  Simulate Successful Acquisition
                </button>
                <button 
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-3 bg-red-650 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded"
                >
                  Simulate Declined Card
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-850 text-center text-[10px] text-zinc-500 uppercase tracking-widest">
              Secure Sandbox Verification
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
