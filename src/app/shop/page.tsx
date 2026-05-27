"use client";

import { useStore } from "@/store/useStore";
import { products, WatchProduct } from "@/data/products";
import { Heart, ArrowLeftRight, Eye, ShoppingCart, SlidersHorizontal, Search, Star, X, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// Separated component for internal logic
function ShopContent() {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, compareList, addToCompare, removeFromCompare } = useStore();
  const searchParams = useSearchParams();

  // Load products dynamically
  const [productsList, setProductsList] = useState<WatchProduct[]>(products);
  useEffect(() => {
    const local = localStorage.getItem("pp_products");
    if (local) {
      try {
        setProductsList(JSON.parse(local));
      } catch (e) {
        console.error("Error loading products from localStorage", e);
      }
    }
  }, []);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovements, setSelectedMovements] = useState<string[]>([]);
  const [selectedStraps, setSelectedStraps] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  // Mobile filter panel toggle
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync with searchParams (e.g. wishlist filter)
  const isWishlistOnly = searchParams.get("filter") === "wishlist";

  const handleToggleMovement = (mov: string) => {
    setSelectedMovements(prev =>
      prev.includes(mov) ? prev.filter(m => m !== mov) : [...prev, mov]
    );
  };

  const handleToggleStrap = (strap: string) => {
    setSelectedStraps(prev =>
      prev.includes(strap) ? prev.filter(s => s !== strap) : [...prev, strap]
    );
  };

  const handleToggleCase = (material: string) => {
    setSelectedCases(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedMovements([]);
    setSelectedStraps([]);
    setSelectedCases([]);
    setMaxPrice(500000);
    setSortBy("default");
  };

  // Active filter count badge
  const activeFiltersCount =
    selectedMovements.length + selectedStraps.length + selectedCases.length +
    (maxPrice < 500000 ? 1 : 0) + (searchQuery ? 1 : 0);

  // Filter and Sort calculation
  const filteredProducts = productsList.filter(watch => {
    const matchesSearch =
      watch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.caliber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMovement = selectedMovements.length === 0 || selectedMovements.includes(watch.movement);
    const matchesStrap = selectedStraps.length === 0 || selectedStraps.includes(watch.strapMaterial);
    const matchesCase = selectedCases.length === 0 || selectedCases.includes(watch.caseMaterial);
    const matchesPrice = watch.price <= maxPrice;
    const matchesWishlist = !isWishlistOnly || wishlist.includes(watch.id);
    return matchesSearch && matchesMovement && matchesStrap && matchesCase && matchesPrice && matchesWishlist;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleToggleCompare = (product: WatchProduct) => {
    const isCompared = compareList.some(item => item.id === product.id);
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  // Shared filter panel JSX (used in both sidebar and mobile drawer)
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Search Timepieces</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 text-xs px-3 py-2 pl-8 focus:outline-none focus:border-primary-gold rounded"
          />
          <Search className="h-3.5 w-3.5 text-zinc-550 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500">
          <span>Max Price</span>
          <span className="text-primary-gold">₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min={3000}
          max={500000}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary-gold"
        />
        <div className="flex justify-between text-[9px] text-zinc-650 font-mono">
          <span>₹3,000</span>
          <span>₹5,00,000</span>
        </div>
      </div>

      {/* Movements Checkboxes */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Movement</label>
        <div className="space-y-1.5 text-xs text-zinc-455">
          {["Automatic", "Mechanical", "Quartz"].map(mov => (
            <label key={mov} className="flex items-center gap-2.5 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={selectedMovements.includes(mov)}
                onChange={() => handleToggleMovement(mov)}
                className="rounded border-zinc-800 accent-primary-gold bg-black"
              />
              <span>{mov}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Strap Material Checkboxes */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Strap Material</label>
        <div className="space-y-1.5 text-xs text-zinc-455">
          {["Leather", "Metal", "Rubber"].map(strap => (
            <label key={strap} className="flex items-center gap-2.5 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={selectedStraps.includes(strap)}
                onChange={() => handleToggleStrap(strap)}
                className="rounded border-zinc-800 accent-primary-gold bg-black"
              />
              <span>{strap}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Case Material Checkboxes */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Case Material</label>
        <div className="space-y-1.5 text-xs text-zinc-455">
          {["Stainless Steel", "Titanium", "18K Gold", "Platinum", "Metal"].map(mat => (
            <label key={mat} className="flex items-center gap-2.5 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={selectedCases.includes(mat)}
                onChange={() => handleToggleCase(mat)}
                className="rounded border-zinc-800 accent-primary-gold bg-black"
              />
              <span>{mat}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full py-2 border border-zinc-800 hover:border-primary-gold text-zinc-450 hover:text-primary-gold text-[10px] font-bold uppercase tracking-widest transition-colors rounded"
        >
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow">

      {/* Page Title */}
      <div className="text-center space-y-2 mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white tracking-widest uppercase">
          The Horology Vault
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-[#8C7853]">
          {isWishlistOnly ? "Your Curated Wishlist Portfolio" : "Explore our hand-crafted, high-precision calibers"}
        </p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#0E0E0E] border border-zinc-900 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-300"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary-gold" />
            Filters & Search
            {activeFiltersCount > 0 && (
              <span className="bg-primary-gold text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </span>
          {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Mobile Filter Drawer */}
        {filtersOpen && (
          <div className="mt-2 bg-[#0E0E0E] border border-zinc-900 rounded-lg p-5 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800 mb-4">
              <h3 className="font-serif text-white text-base tracking-wide">Refine Results</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel />
          </div>
        )}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">

        {/* FILTERS PANEL — Desktop sidebar only */}
        <aside className="hidden lg:block lg:col-span-1 bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 h-fit sticky top-[168px]">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-850 mb-6">
            <h3 className="font-serif text-white text-lg tracking-wide flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary-gold" />
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[10px] text-zinc-550 hover:text-white uppercase tracking-widest font-bold"
              >
                Reset
              </button>
            )}
          </div>
          <FilterPanel />
        </aside>

        {/* PRODUCTS GALLERY GRID */}
        <section className="lg:col-span-3 space-y-5">

          {/* Sorting / Results bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-[#0E0E0E] border border-zinc-900 rounded-lg px-4 sm:px-6 py-3 text-xs text-zinc-450">
            <span className="text-zinc-400">
              Showing <span className="text-white font-bold">{sortedProducts.length}</span> watch models
            </span>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold whitespace-nowrap">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "default" | "price-asc" | "price-desc" | "rating")}
                className="bg-[#070707] border border-zinc-800 text-zinc-300 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-primary-gold flex-1 sm:flex-none"
              >
                <option value="default">Default Catalog</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Expert Review Score</option>
              </select>
            </div>
          </div>

          {/* Watch Grid */}
          {sortedProducts.length === 0 ? (
            <div className="border border-dashed border-zinc-850 rounded-lg py-20 text-center space-y-4">
              <p className="text-sm text-zinc-500">No timepieces match your current selection parameters.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors rounded"
              >
                Reset Parameters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {sortedProducts.map((watch) => {
                const isInWishlist = wishlist.includes(watch.id);
                const isCompared = compareList.some(item => item.id === watch.id);
                return (
                  <div
                    key={watch.id}
                    className="group bg-transparent border-none p-0 flex flex-col transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(watch.id)}
                      className="absolute top-5 right-5 z-20 text-zinc-500 hover:text-red-400 p-1.5 rounded-full bg-black/60 backdrop-blur-xs transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-400 text-red-400" : ""}`} />
                    </button>

                    {/* Stock urgency */}
                    {watch.stock <= 2 && (
                      <span className="absolute top-5 left-5 z-20 bg-red-955/75 border border-red-500/20 text-red-400 font-mono text-[9px] font-semibold px-2 py-0.5 rounded">
                        Only {watch.stock} Left
                      </span>
                    )}

                    {/* Thumbnail — clicking the overlay eye icon goes to full product page */}
                    <Link href={`/product/${watch.id}`} className="block">
                      <div className="h-48 sm:h-56 lg:h-60 w-full relative overflow-hidden rounded mb-3 sm:mb-4 bg-zinc-950">
                        <Image
                          src={watch.imageUrl}
                          alt={watch.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Hover overlay with eye — navigates to full product page via Link parent */}
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <div
                            className="p-3 bg-white/10 backdrop-blur-xs rounded-full border border-white/20 text-white"
                            title="View Full Details"
                          >
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-zinc-600 tracking-widest">{watch.sku}</span>
                        <Link href={`/product/${watch.id}`}>
                          <h4 className="font-serif text-white text-sm sm:text-base leading-tight hover:text-primary-gold transition-colors line-clamp-2">
                            {watch.name}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-zinc-550 font-light truncate mt-0.5">{watch.tagline}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-900 mt-3">
                        <span className="text-primary-gold font-bold text-sm">₹{watch.price.toLocaleString("en-IN")}</span>

                        <div className="flex items-center gap-2">
                          {/* Add to Cart quick button */}
                          <button
                            onClick={() => addToCart(watch, 1)}
                            className="p-1.5 bg-zinc-900 hover:bg-primary-gold hover:text-black text-zinc-400 border border-zinc-800 rounded transition-all"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                          </button>

                          {/* Compare check */}
                          <label className="flex items-center gap-1 cursor-pointer text-[10px] text-zinc-500 hover:text-white select-none">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() => handleToggleCompare(watch)}
                              className="rounded border-zinc-800 accent-primary-gold bg-black scale-90"
                            />
                            <span className="hidden sm:inline">Compare</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-550 font-mono tracking-widest uppercase text-xs">Opening The vault...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
