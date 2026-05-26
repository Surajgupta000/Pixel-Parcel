"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { X, ArrowLeftRight, Check, ShoppingCart, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [barCollapsed, setBarCollapsed] = useState(false);

  if (compareList.length === 0) return null;

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  return (
    <>
      {/* Floating Bottom Drawer Trigger Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E0E]/95 border-t border-zinc-800 shadow-2xl backdrop-blur-sm transition-all duration-300">

        {/* Collapse toggle — only shown on mobile */}
        <button
          onClick={() => setBarCollapsed(!barCollapsed)}
          className="sm:hidden w-full flex items-center justify-center py-1.5 text-zinc-500 hover:text-white border-b border-zinc-900 transition-colors"
          aria-label="Toggle compare bar"
        >
          {barCollapsed ? (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-primary-gold">
              <ChevronUp className="h-3.5 w-3.5" />
              Compare ({compareList.length})
            </span>
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Bar Body */}
        <div className={`${barCollapsed ? "hidden sm:block" : "block"} px-4 sm:px-6 py-3 sm:py-4`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-gold/10 p-2 rounded-full border border-primary-gold/20 flex-shrink-0">
                <ArrowLeftRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F5F5F7]">Compare Timepieces</p>
                <p className="text-xs text-gray-400">{compareList.length} of 3 selected</p>
              </div>
            </div>

            {/* Watch Thumbnails */}
            <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
              {compareList.map((watch) => (
                <div
                  key={watch.id}
                  className="relative bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg flex items-center gap-2 group"
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 relative overflow-hidden rounded flex-shrink-0">
                    <Image
                      src={watch.imageUrl}
                      alt={watch.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <span className="text-xs text-gray-300 hidden sm:inline max-w-[80px] truncate">{watch.name}</span>
                  <button
                    onClick={() => removeFromCompare(watch.id)}
                    className="bg-black/60 hover:bg-red-950/80 rounded-full p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    aria-label={`Remove ${watch.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Drawer Actions */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={clearCompare}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-primary-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-colors duration-300 rounded"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 pt-6 sm:pt-4">
          <div className="bg-[#0D0D0D] border border-zinc-800 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-850 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary-gold" />
                <h2 className="text-lg sm:text-2xl font-serif text-white tracking-wide">Spec Comparison</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-primary-gold transition-colors p-2 rounded-full hover:bg-zinc-900"
                aria-label="Close comparison"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Spec Table — horizontally scrollable */}
            <div className="overflow-auto flex-1 p-3 sm:p-6">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-3 sm:py-4 pr-3 sm:pr-4 font-semibold text-gray-500 w-[110px] sm:w-1/4 uppercase tracking-widest text-[9px] sm:text-[10px] align-bottom sticky left-0 bg-[#0D0D0D] z-10">
                      Specifications
                    </th>
                    {compareList.map((watch) => (
                      <th key={watch.id} className="py-3 sm:py-4 px-2 sm:px-4 align-top">
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className="h-20 w-20 sm:h-28 sm:w-28 relative overflow-hidden rounded-lg border border-zinc-800 flex-shrink-0">
                            <Image
                              src={watch.imageUrl}
                              alt={watch.name}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          </div>
                          <h3 className="font-serif text-white text-xs sm:text-sm leading-tight">{watch.name}</h3>
                          <span className="text-primary-gold font-semibold text-xs sm:text-sm">
                            ₹{watch.price.toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => removeFromCompare(watch.id)}
                            className="text-[9px] text-zinc-500 hover:text-red-400 uppercase tracking-widest font-bold flex items-center gap-1 transition-colors"
                          >
                            <X className="h-2.5 w-2.5" /> Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-900">
                  {[
                    { label: "Movement", key: "movement" },
                    { label: "Caliber", key: "caliber" },
                    { label: "Case Material", key: "caseMaterial" },
                    { label: "Dial Color", key: "dialColor" },
                    { label: "Strap", key: "strapMaterial" },
                    { label: "Case Diameter", key: "caseDiameter" },
                    { label: "Thickness", key: "thickness" },
                    { label: "Power Reserve", key: "powerReserve" },
                    { label: "Water Resistance", key: "waterResistance" },
                    { label: "Glass", key: "glassMaterial" },
                    { label: "Jewels", key: "jewels" },
                    { label: "Gender", key: "gender" },
                  ].map(({ label, key }) => (
                    <tr key={key}>
                      <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-semibold text-gray-500 text-[9px] sm:text-xs uppercase tracking-wider sticky left-0 bg-[#0D0D0D] z-10">
                        {label}
                      </td>
                      {compareList.map((w: any) => {
                        const val = w[key];
                        const display = key === "jewels"
                          ? (val ? `${val} jewels` : "—")
                          : (val && String(val).trim() !== "" ? String(val) : "—");
                        return (
                          <td key={w.id} className="py-2.5 sm:py-3 px-2 sm:px-4 text-zinc-300 text-xs font-mono">
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Availability row */}
                  <tr>
                    <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-semibold text-gray-500 text-[9px] sm:text-xs uppercase tracking-wider sticky left-0 bg-[#0D0D0D] z-10">
                      Availability
                    </td>
                    {compareList.map((w) => (
                      <td key={w.id} className="py-2.5 sm:py-3 px-2 sm:px-4 text-xs font-semibold">
                        {w.stock <= 2 ? (
                          <span className="text-red-400">Only {w.stock} Left</span>
                        ) : (
                          <span className="text-green-400 flex items-center gap-1">
                            <Check className="h-3 w-3" /> In Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* SKU row */}
                  <tr>
                    <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 font-semibold text-gray-500 text-[9px] sm:text-xs uppercase tracking-wider sticky left-0 bg-[#0D0D0D] z-10">
                      SKU
                    </td>
                    {compareList.map((w) => (
                      <td key={w.id} className="py-2.5 sm:py-3 px-2 sm:px-4 font-mono text-zinc-550 text-[10px]">
                        {w.sku || "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Actions row */}
                  <tr>
                    <td className="py-3 sm:py-4 pr-3 sm:pr-4 sticky left-0 bg-[#0D0D0D] z-10" />
                    {compareList.map((w) => (
                      <td key={w.id} className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              handleAddToCart(w);
                              setIsOpen(false);
                            }}
                            className="w-full py-2 bg-primary-gold hover:bg-gold-light text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 rounded"
                          >
                            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Buy
                          </button>
                          <Link
                            href={`/product/${w.id}`}
                            onClick={() => setIsOpen(false)}
                            className="w-full py-1.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center rounded"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-zinc-900/50 border-t border-zinc-850 flex justify-between items-center gap-3 flex-shrink-0">
              <button
                onClick={clearCompare}
                className="text-xs font-semibold uppercase text-gray-500 hover:text-red-400 tracking-widest transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 border border-zinc-700 hover:border-zinc-500 text-xs font-semibold uppercase text-gray-300 hover:text-white transition-colors rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
