"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { products, WatchProduct } from "@/data/products";
import { ArrowRight, ShieldCheck, Heart, ArrowLeftRight, Eye, Star, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubCategory {
  name: string;
  filter: (watch: WatchProduct) => boolean;
}

interface Section {
  name: string;
  subCategories: SubCategory[];
}

const sections: Section[] = [
  {
    name: "Home",
    subCategories: [
      { name: "Casual Watches", filter: (w) => w.style === "Casual" },
      { name: "Formal Watches", filter: (w) => w.style === "Formal" },
      { name: "Digital Watches", filter: (w) => w.style === "Digital" },
      { name: "Smart Watches", filter: (w) => w.style === "Smart" }
    ]
  },
  {
    name: "New Arrivals",
    subCategories: []
  },
  {
    name: "Summer Sales",
    subCategories: []
  }
];

const testimonials = [
  {
    id: "t1",
    name: "Aditya Singhania",
    role: "Managing Director, Singhania Heritage Fund",
    location: "Mumbai",
    text: "Fascinated by the caliber finishing of the Aero Tourbillon. The purchasing process was seamless, and the digital certificate of authenticity is a game-changer for Indian collectors who value transaction security.",
    rating: 5
  },
  {
    id: "t2",
    name: "Dr. Meera Iyer",
    role: "Neurosurgeon & Horology Enthusiast",
    location: "Bengaluru",
    text: "The Celestial Eclipse with its aventurine glass dial is sheer poetry. Understated luxury that sits elegantly. Pixel & Parcel has redefined trust in luxury acquisitions in India.",
    rating: 5
  },
  {
    id: "t3",
    name: "Vikram Malhotra",
    role: "Founder, Malhotra & Co. Ventures",
    location: "New Delhi",
    text: "Being a vintage collector, I was skeptical about modern verification, but the Caliber Registry Checker verified my Vanguard Classic instantly. Exemplary craftsmanship and service.",
    rating: 5
  },
  {
    id: "t4",
    name: "Kabir Sen",
    role: "Senior Horology Editor, India Timepieces",
    location: "Kolkata",
    text: "Unboxing the Quantum Stealth felt like an industrial masterpiece. Grade 5 titanium, mechanical balance, and a secure signature lock. Highly recommended for purists.",
    rating: 5
  },
  {
    id: "t5",
    name: "Priya Nair",
    role: "Head of Design, Atelier Kochi",
    location: "Kochi",
    text: "The rose gold finishing and opaline dial of the Chronos Horizon is stunning. It’s rare to find such precision delivered with physical wood-box craftsmanship.",
    rating: 5
  },
  {
    id: "t6",
    name: "Rohan Das",
    role: "Tech Entrepreneur & Collector",
    location: "Hyderabad",
    text: "Pixel & Parcel brings pixel-perfect digital ledgers to physical horology. Seamless Razorpay checkout, complimentary insured shipping, and supreme mechanics.",
    rating: 5
  }
];

interface ProductCardProps {
  watch: WatchProduct;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  addToCompare: (watch: WatchProduct) => void;
  addToCart: (watch: WatchProduct, qty: number) => void;
}

function ProductCard({ watch, wishlist, toggleWishlist, addToCompare, addToCart }: ProductCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Dynamically build image collection for auto change
  const getProductImages = (w: WatchProduct): string[] => {
    if (w.images && w.images.length > 0) {
      return w.images;
    }
    const list = [w.imageUrl];
    const fallbacks = [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000"
    ];
    fallbacks.forEach(f => {
      if (f !== w.imageUrl && list.length < 3) {
        list.push(f);
      }
    });
    return list;
  };

  const images = getProductImages(watch);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds swap
    return () => clearInterval(interval);
  }, [images.length]);

  const isInWishlist = wishlist.includes(watch.id);

  return (    <div className="group bg-transparent border-none p-0 flex flex-col justify-between transition-all duration-500 relative overflow-hidden animate-fade-in lg:w-[calc((100%-64px)/3)] lg:flex-shrink-0">
      
      {/* Heart / Wishlist Icon */}
      <button 
        onClick={() => toggleWishlist(watch.id)}
        className="absolute top-6 right-6 z-20 text-zinc-555 hover:text-red-400 p-2 rounded-full bg-black/60 backdrop-blur-xs transition-colors"
      >
        <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-400 text-red-400" : ""}`} />
      </button>

      {/* Stock counter */}
      {watch.stock <= 2 && (
        <span className="absolute top-6 left-6 z-20 bg-red-952/75 border border-red-500/20 text-red-400 font-mono text-[9px] font-semibold px-2 py-0.5 rounded">
          Only {watch.stock} Left
        </span>
      )}

      {/* Image container */}
      <div className="space-y-4">
        <Link href={`/product/${watch.id}`} className="h-64 lg:h-80 w-full relative overflow-hidden rounded bg-zinc-950 block">
          <div 
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translate3d(-${currentIdx * 100}%, 0, 0)` }}
          >            {images.map((img, idx) => (
              <div key={img + "-" + idx} className="w-full h-full flex-shrink-0 relative">
                <Image 
                  src={img} 
                  alt={watch.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-w-7xl) 25vw, 100vw"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-full border border-white/20 text-white hover:bg-primary-gold hover:text-black transition-all">
              <Eye className="h-5 w-5" />
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono uppercase text-zinc-650 tracking-widest">{watch.sku}</span>
          <Link href={`/product/${watch.id}`}>
            <h4 className="font-serif text-white text-base leading-tight hover:text-primary-gold transition-colors font-semibold">{watch.name}</h4>
          </Link>
          
          <div className="flex justify-between items-center pt-3 border-t border-zinc-950 mt-2">
            <span className="text-primary-gold font-bold text-sm">₹{watch.price.toLocaleString("en-IN")}</span>
            <button
              onClick={() => addToCompare(watch)}
              className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeftRight className="h-3 w-3" />
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Add to cart block commented out for home page */}
      {/*
      <button 
        onClick={() => addToCart(watch, 1)}
        className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-primary-gold hover:text-black text-zinc-350 hover:border-primary-gold text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded mt-4"
      >
        Acquire Timepiece
      </button>
      */}
    </div>
  );
}

function HomeContent() {
  const { addToCart, wishlist, toggleWishlist, addToCompare } = useStore();
  const [productsList, setProductsList] = useState<WatchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProductsList(data);
          localStorage.setItem("pp_products", JSON.stringify(data));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error loading products on homepage from API", err);
      }

      const local = localStorage.getItem("pp_products");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const isValidUrl = (url: any) => typeof url === "string" && (url.trim().startsWith("http://") || url.trim().startsWith("https://") || url.trim().startsWith("/"));
          const fallback = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000";
          const sanitized = parsed.map((p: any) => {
            const cleanImg = isValidUrl(p.imageUrl) ? p.imageUrl.trim() : fallback;
            const cleanImages = Array.isArray(p.images) ? p.images.filter(isValidUrl).map((img: string) => img.trim()) : [cleanImg];
            return {
              ...p,
              imageUrl: cleanImg,
              images: cleanImages.length > 0 ? cleanImages : [cleanImg]
            };
          });
          setProductsList(sanitized);
        } catch (e) {
          console.error("Error loading products on homepage from localStorage", e);
        }
      }
      setLoading(false);
    };

    loadProducts();
  }, []);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const [menActiveSection, setMenActiveSection] = useState(0);
  const [menActiveSub, setMenActiveSub] = useState<number | null>(null);
  const [womenActiveSection, setWomenActiveSection] = useState(0);
  const [womenActiveSub, setWomenActiveSub] = useState<number | null>(null);
  const [kidsActiveSection, setKidsActiveSection] = useState(0);
  const [kidsActiveSub, setKidsActiveSub] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get("section");
    const style = searchParams.get("style");

    if (section) {
      const element = document.getElementById(`${section.toLowerCase()}-section`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }

      if (section === "men") {
        setMenActiveSection(0);
        if (style) {
          const sIdx = ["Casual", "Formal", "Digital", "Smart"].findIndex(
            (s) => s.toLowerCase() === style.toLowerCase()
          );
          if (sIdx !== -1) setMenActiveSub(sIdx);
        } else {
          setMenActiveSub(null);
        }
      } else if (section === "women") {
        setWomenActiveSection(0);
        if (style) {
          const sIdx = ["Casual", "Formal", "Digital", "Smart"].findIndex(
            (s) => s.toLowerCase() === style.toLowerCase()
          );
          if (sIdx !== -1) setWomenActiveSub(sIdx);
        } else {
          setWomenActiveSub(null);
        }
      } else if (section === "kids") {
        setKidsActiveSection(0);
        setKidsActiveSub(null);
      }
    }
  }, [searchParams]);

  // Auto-slide testimonials every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Trigger micro-tour overlay for first-time visitors
  useEffect(() => {
    const tourSeen = localStorage.getItem("pp_tour_seen");
    if (!tourSeen) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTour = () => {
    setShowTour(false);
    localStorage.setItem("pp_tour_seen", "true");
  };

  // Canvas Escapement Wheel Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Gear drawing helper
    const drawGear = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      teeth: number,
      rotAngle: number,
      color: string,
      spokesCount = 5
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotAngle);

      c.fillStyle = color;
      c.strokeStyle = color;
      c.lineWidth = 4;

      // Draw Outer Rim
      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
      c.stroke();

      // Draw Teeth
      const toothHeight = radius * 0.12;
      const toothWidth = (Math.PI * 2 * radius) / teeth * 0.4;
      for (let i = 0; i < teeth; i++) {
        c.save();
        c.rotate((Math.PI * 2 * i) / teeth);
        c.beginPath();
        c.moveTo(-toothWidth / 2, -radius);
        c.lineTo(-toothWidth * 0.3 / 2, -radius - toothHeight);
        c.lineTo(toothWidth * 0.3 / 2, -radius - toothHeight);
        c.lineTo(toothWidth / 2, -radius);
        c.closePath();
        c.fill();
        c.restore();
      }

      // Draw Spokes
      for (let i = 0; i < spokesCount; i++) {
        c.save();
        c.rotate((Math.PI * 2 * i) / spokesCount);
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, -radius + 4);
        c.stroke();
        c.restore();
      }

      // Center cap
      c.beginPath();
      c.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
      c.fillStyle = "#0D0D0D";
      c.fill();
      c.stroke();

      // Brass center rivet
      c.beginPath();
      c.arc(0, 0, radius * 0.08, 0, Math.PI * 2);
      c.fillStyle = "#D4AF37";
      c.fill();

      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.005; // speed

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw three interconnected gears
      // Main Center gear
      drawGear(ctx, centerX, centerY, 150, 48, angle, "rgba(212, 175, 55, 0.08)", 5);
      
      // Secondary Gear Left
      drawGear(ctx, centerX - 198, centerY, 60, 20, -angle * 2.4 + 0.15, "rgba(197, 168, 128, 0.06)", 4);

      // Third Gear Upper Right
      drawGear(ctx, centerX + 155, centerY - 145, 100, 32, -angle * 1.5 - 0.05, "rgba(140, 120, 83, 0.06)", 6);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Filter sections
  const homeSections = sections;

  // Filter products by gender group helper (supports multi-selection)
  const getWatchGenders = (w: WatchProduct): string[] => {
    if (!w.gender) {
      // Fallback for static watches
      if (w.id === "chronos-horizon" || w.id === "vanguard-classic" || w.id === "apex-mariner" || w.id === "nt3099sl01" || w.id === "stealth-pulse") {
        return ["men"];
      }
      if (w.id === "celestial-eclipse" || w.id === "aura-rose") {
        return ["women"];
      }
      return ["kids"];
    }

    const gLower = w.gender.toLowerCase();
    const parts = gLower.split(/[,;\s]+/).map(p => p.trim()).filter(Boolean);
    const genders: string[] = [];

    parts.forEach(part => {
      if (part === "guys" || part === "men" || part === "gentlemen" || part === "mens") {
        if (!genders.includes("men")) genders.push("men");
      } else if (part === "ladies" || part === "women" || part === "womens") {
        if (!genders.includes("women")) genders.push("women");
      } else if (part === "kids" || part === "boys" || part === "girls" || part === "children") {
        if (!genders.includes("kids")) genders.push("kids");
      } else if (part === "unisex") {
        if (!genders.includes("men")) genders.push("men");
        if (!genders.includes("women")) genders.push("women");
      }
    });

    if (genders.length === 0) {
      return ["kids"];
    }
    return genders;
  };

  // Helper to filter watches based on active tab and style option
  const getFilteredProducts = (
    genderWatches: WatchProduct[],
    activeSectionIdx: number,
    activeSubIdx: number | null
  ) => {
    const section = homeSections[activeSectionIdx];
    if (!section) return genderWatches;

    if (section.name === "Home") {
      if (activeSubIdx === null) {
        return genderWatches;
      }
      const sub = section.subCategories[activeSubIdx];
      return sub ? genderWatches.filter(sub.filter) : genderWatches;
    } else if (section.name === "New Arrivals") {
      return genderWatches.filter((w) => w.isNewArrival === true);
    } else if (section.name === "Summer Sales") {
      return genderWatches.filter((w) => w.isSummerSale === true);
    }

    return genderWatches;
  };

  // Men
  const menWatches = productsList.filter((w) => getWatchGenders(w).includes("men"));
  const displayMenProducts = getFilteredProducts(menWatches, menActiveSection, menActiveSub).slice(0, 8);

  // Women
  const womenWatches = productsList.filter((w) => getWatchGenders(w).includes("women"));
  const displayWomenProducts = getFilteredProducts(womenWatches, womenActiveSection, womenActiveSub).slice(0, 8);

  // Kids
  const kidsWatches = productsList.filter((w) => getWatchGenders(w).includes("kids"));
  const displayKidsProducts = getFilteredProducts(kidsWatches, kidsActiveSection, kidsActiveSub).slice(0, 8);

  const renderWatchCard = (watch: WatchProduct) => {
    return (
      <ProductCard
        key={watch.id}
        watch={watch}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        addToCompare={addToCompare}
        addToCart={addToCart}
      />
    );
  };

  return (
    <div className="relative w-full flex-grow">
      
      {/* 1. FIRST-VISIT 5-SEC MICRO TOUR OVERLAY */}
      {showTour && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel-gold rounded-lg max-w-sm w-full p-6 text-center shadow-2xl relative">
            <h4 className="text-lg font-serif text-white tracking-wider mb-2">Welcome Tour</h4>
            
            {tourStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">
                  Every Pixel & Parcel timepiece is backed by a secure, tamper-proof certificate of authenticity downloadable directly from the product details.
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-zinc-500 font-mono">Step 1 of 3</span>
                  <button 
                    onClick={() => setTourStep(2)}
                    className="px-4 py-1.5 bg-primary-gold text-black text-[10px] font-bold uppercase tracking-wider rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {tourStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">
                  Enable the <strong>Mechanical Ticking Audio</strong> (sound icon in header) to immerse yourself in the automatic escapement caliber heartbeat.
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-zinc-500 font-mono">Step 2 of 3</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTourStep(1)}
                      className="px-2 py-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setTourStep(3)}
                      className="px-4 py-1.5 bg-primary-gold text-black text-[10px] font-bold uppercase tracking-wider rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tourStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">
                  Enjoy complimentary fully insured transit, original box & papers, and a 5-year escapement warranty on all acquisitions.
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-zinc-500 font-mono">Step 3 of 3</span>
                  <button 
                    onClick={dismissTour}
                    className="px-4 py-1.5 bg-primary-gold text-black text-[10px] font-bold uppercase tracking-wider rounded"
                  >
                    Start Exploring
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="dark-section relative min-h-[80vh] sm:h-[85vh] flex items-center justify-center overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-[#080808] to-[#121212]">
        
        {/* WebGL/Canvas gear movement in the background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Golden Ambient Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary-gold/5 blur-[120px] pointer-events-none" />

        {/* Hero text */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6 py-20">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-primary-gold animate-pulse-gold block">
            Haute Horlogerie Workshop
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white leading-tight tracking-wide">
            Fusing <span className="italic font-normal text-gold-gradient">Digital Precision</span>{" "}
            <br className="hidden sm:inline" />
            with Craftsmanship
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
            We design and curate ultra-premium mechanical timepieces for purists who demand micro-precision engineering and absolute security.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <Link 
              href="/shop"
              className="px-8 py-3.5 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded shadow-lg shadow-primary-gold/10 hover:shadow-primary-gold/20 w-full sm:w-auto max-w-xs text-center"
            >
              Acquire Timepiece
            </Link>
            <Link 
              href="/about"
              className="px-8 py-3.5 border border-zinc-850 hover:border-zinc-700 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded w-full sm:w-auto max-w-xs text-center"
            >
              The Atelier Story
            </Link>
          </div>
        </div>

      </section>

      {/* 3A. GENTLEMEN'S LUXURY TIMEPIECES */}
      <section id="men-section" className="py-24 bg-[#0A0A0A] border-b border-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          
          {/* Header & Categories Menu */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 pb-3 sm:pb-4 border-b border-zinc-900">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Gentlemen&apos;s Calibers</span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-wide">The Men&apos;s Collection</h3>
              <p className="text-xs text-zinc-400 max-w-lg font-light">Commanding presence, uncompromising engineering, and pure mechanical power.</p>
            </div>
            
            {/* Interactive Luxury Section Tabs — scrollable on mobile */}
            <div className="flex overflow-x-auto scrollbar-none gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-950 p-1.5 border border-zinc-900 rounded w-full lg:w-auto">
              {homeSections.map((sect, idx) => (
                <button
                  key={sect.name}
                  onMouseEnter={() => {
                    setMenActiveSection(idx);
                    setMenActiveSub(null);
                  }}
                  onClick={() => {
                    setMenActiveSection(idx);
                    setMenActiveSub(null);
                  }}
                  className={`px-3 sm:px-4 py-2 rounded transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
                    menActiveSection === idx 
                      ? "bg-primary-gold text-black" 
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {sect.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Category Bar */}
          {homeSections[menActiveSection].subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start animate-fade-in">
              {homeSections[menActiveSection].subCategories.map((sub, sIdx) => (
                <button
                  key={sub.name}
                  onMouseEnter={() => setMenActiveSub(sIdx)}
                  onClick={() => setMenActiveSub(sIdx)}
                  className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-full border transition-all duration-300 ${
                    menActiveSub === sIdx
                      ? "border-primary-gold bg-primary-gold/15 text-primary-gold"
                      : "border-zinc-900 bg-transparent text-zinc-500 hover:text-zinc-350 hover:border-zinc-800"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:overflow-x-auto lg:scrollbar-none lg:gap-8 lg:pb-4 min-h-[420px] lg:justify-start justify-center items-center">
            {loading ? (
              <div className="w-full flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-550 font-mono tracking-widest uppercase text-xs">Loading calibers...</p>
              </div>
            ) : displayMenProducts.length > 0 ? (
              displayMenProducts.map((watch) => renderWatchCard(watch))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-16 text-zinc-500 text-sm italic">
                No timepieces found in this category.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3B. LADIES' DIAMOND & COMPLICATIONS */}
      <section id="women-section" className="py-24 bg-[#080808] border-b border-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          
          {/* Header & Categories Menu */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 pb-3 sm:pb-4 border-b border-zinc-900">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Ladies&apos; Diamond &amp; Complications</span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-wide">The Women&apos;s Collection</h3>
              <p className="text-xs text-zinc-400 max-w-lg font-light">Celestial aventurine dials, soft rose gold proportions, and intricate dress complications.</p>
            </div>
            
            {/* Interactive Luxury Section Tabs — scrollable on mobile */}
            <div className="flex overflow-x-auto scrollbar-none gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-950 p-1.5 border border-zinc-900 rounded w-full lg:w-auto">
              {homeSections.map((sect, idx) => (
                <button
                  key={sect.name}
                  onMouseEnter={() => {
                    setWomenActiveSection(idx);
                    setWomenActiveSub(null);
                  }}
                  onClick={() => {
                    setWomenActiveSection(idx);
                    setWomenActiveSub(null);
                  }}
                  className={`px-3 sm:px-4 py-2 rounded transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
                    womenActiveSection === idx 
                      ? "bg-primary-gold text-black" 
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {sect.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Category Bar */}
          {homeSections[womenActiveSection].subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start animate-fade-in">
              {homeSections[womenActiveSection].subCategories.map((sub, sIdx) => (
                <button
                  key={sub.name}
                  onMouseEnter={() => setWomenActiveSub(sIdx)}
                  onClick={() => setWomenActiveSub(sIdx)}
                  className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-full border transition-all duration-300 ${
                    womenActiveSub === sIdx
                      ? "border-primary-gold bg-primary-gold/15 text-primary-gold"
                      : "border-zinc-900 bg-transparent text-zinc-500 hover:text-zinc-350 hover:border-zinc-800"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:overflow-x-auto lg:scrollbar-none lg:gap-8 lg:pb-4 min-h-[420px] lg:justify-start justify-center items-center">
            {loading ? (
              <div className="w-full flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-550 font-mono tracking-widest uppercase text-xs">Loading calibers...</p>
              </div>
            ) : displayWomenProducts.length > 0 ? (
              displayWomenProducts.map((watch) => renderWatchCard(watch))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-16 text-zinc-500 text-sm italic">
                No timepieces found in this category.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3C. MODERNIST HORIZON (KIDS) */}
      <section id="kids-section" className="py-24 bg-[#0A0A0A] border-b border-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          
          {/* Header & Categories Menu */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 pb-3 sm:pb-4 border-b border-zinc-900">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Youth Calibers</span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-wide">The Kids Collection</h3>
              <p className="text-xs text-zinc-400 max-w-lg font-light">Playful designs, robust casing, and premium timepieces designed specifically for children.</p>
            </div>
            
            {/* Interactive Luxury Section Tabs — scrollable on mobile */}
            <div className="flex overflow-x-auto scrollbar-none gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-950 p-1.5 border border-zinc-900 rounded w-full lg:w-auto">
              {homeSections.map((sect, idx) => (
                <button
                  key={sect.name}
                  onMouseEnter={() => {
                    setKidsActiveSection(idx);
                    setKidsActiveSub(null);
                  }}
                  onClick={() => {
                    setKidsActiveSection(idx);
                    setKidsActiveSub(null);
                  }}
                  className={`px-3 sm:px-4 py-2 rounded transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
                    kidsActiveSection === idx 
                      ? "bg-primary-gold text-black" 
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {sect.name}
                </button>
              ))}
            </div>
          </div>


          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:overflow-x-auto lg:scrollbar-none lg:gap-8 lg:pb-4 min-h-[420px] lg:justify-start justify-center items-center">
            {loading ? (
              <div className="w-full flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-550 font-mono tracking-widest uppercase text-xs">Loading calibers...</p>
              </div>
            ) : displayKidsProducts.length > 0 ? (
              displayKidsProducts.map((watch) => renderWatchCard(watch))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-16 text-zinc-500 text-sm italic">
                No timepieces found in this category.
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F5F5F7] hover:text-primary-gold transition-colors group"
            >
              View Full Watch Gallery
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. BRAND PHILOSOPHY */}
      <section className="py-16 sm:py-24 bg-[#080808] border-b border-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Photo Collage */}
          <div className="relative h-[300px] sm:h-[380px] lg:h-[480px] rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950">
            <Image 
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000" 
              alt="Artisanal Watchmaking Atelier"
              fill
              className="object-cover opacity-80"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
            
            {/* Authenticity Certificate Box */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 glass-panel-gold rounded-lg p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className="bg-primary-gold/10 p-2 sm:p-3 rounded-full text-primary-gold border border-primary-gold/20 flex-shrink-0">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
              </div>
              <div>
                <h5 className="font-serif text-white text-sm">Authenticity Certificate</h5>
                <p className="text-xs text-zinc-400 mt-0.5">Every timepiece is cataloged on a secure vault system with a unique downloadable signature certificate.</p>
              </div>
            </div>
          </div>

          {/* Narrative */}
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Our Manifesto</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-wide leading-tight">
              Where digital precision <br />
              meets physical parcel craftsmanship.
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              The modern age demands millisecond-perfect synchronization. Our name is a tribute to that duality: the **Pixel** represents the absolute digital accuracy of our verification networks, while the **Parcel** honors the physical, tactile, and raw artistry of mechanical watchmaking, safely delivered in a luxury lacquered wooden chest.
            </p>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-zinc-900">
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-serif text-primary-gold">28,800</span>
                <p className="text-[10px] text-zinc-550 uppercase tracking-wider">Vibrations Per Hour Calibers</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-serif text-primary-gold">100%</span>
                <p className="text-[10px] text-zinc-550 uppercase tracking-wider">Tamper-Proof Verification</p>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                href="/about" 
                className="px-6 py-3 border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-widest text-[#F5F5F7] transition-all rounded inline-block"
              >
                Explore The Atelier
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-zinc-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Verdicts of Connoisseurs</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-wide">Testimonials</h3>
          </div>

          <div className="relative min-h-[280px] sm:min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full glass-panel rounded-xl p-6 sm:p-8 md:p-12 relative overflow-hidden border border-zinc-900/60 flex flex-col justify-between hover:border-primary-gold/25 transition-all duration-300 shadow-xl"
              >
                <div className="space-y-6 relative">
                  {/* Large gold quote mark */}
                  <div className="absolute -top-4 -left-2 text-6xl sm:text-7xl font-serif text-primary-gold/15 select-none pointer-events-none leading-none">&ldquo;</div>
                  
                  <p className="text-sm sm:text-base text-zinc-350 italic font-light leading-relaxed pt-4 pl-4 relative z-10">
                    {testimonials[activeTestimonial].text}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-900/60 mt-8">
                  <div>
                    <h5 className="font-serif text-white text-base font-semibold tracking-wide">{testimonials[activeTestimonial].name}</h5>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-550 font-mono mt-1">
                      {testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].location}
                    </p>
                  </div>
                  <div className="flex gap-1 text-primary-gold">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary-gold text-primary-gold" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2.5 pt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? "w-8 bg-primary-gold" : "w-1.5 bg-zinc-800 hover:bg-zinc-700"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL COLLECTOR GRID (Commented out) */}
      {/*
      <section className="py-16 sm:py-24 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">The Collector&apos;s Eye</span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">A World of Precision</h3>
            <p className="text-xs text-zinc-550 max-w-md mx-auto">From atelier benches to wrist-worn masterpieces — stories told through the lens.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[220px] gap-2 sm:gap-3">

            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-xl border border-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1400"
                alt="Master watchmaker at bench"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-w-7xl) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold block mb-1">Atelier Stories</span>
                <p className="text-white font-serif text-lg leading-tight">The Art of Hand-Finished Calibers</p>
              </div>
              <div className="absolute inset-0 border-2 border-primary-gold/0 group-hover:border-primary-gold/30 rounded-xl transition-all duration-500" />
            </div>

            <div className="col-span-1 row-span-2 relative overflow-hidden rounded-xl border border-zinc-900 group hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800"
                alt="Close up dial macro"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold block mb-1">Macro Detail</span>
                <p className="text-white font-serif text-sm">Dial Perfection</p>
              </div>
              <div className="absolute inset-0 border-2 border-primary-gold/0 group-hover:border-primary-gold/30 rounded-xl transition-all duration-500" />
            </div>

            <div className="col-span-1 row-span-1 relative overflow-hidden rounded-xl border border-zinc-900 group hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"
                alt="Watch in luxury presentation box"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">Packaging</span>
              </div>
              <div className="absolute inset-0 border-2 border-primary-gold/0 group-hover:border-primary-gold/30 rounded-xl transition-all duration-500" />
            </div>

            <div className="col-span-1 row-span-1 relative overflow-hidden rounded-xl border border-zinc-900 group hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=600"
                alt="Movement parts layout"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">Movement</span>
              </div>
              <div className="absolute inset-0 border-2 border-primary-gold/0 group-hover:border-primary-gold/30 rounded-xl transition-all duration-500" />
            </div>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="col-span-2 sm:col-span-2 relative h-48 sm:h-56 overflow-hidden rounded-xl border border-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200"
                alt="Watch on wrist lifestyle"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-w-7xl) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold block mb-1">Lifestyle</span>
                <p className="text-white font-serif text-xl sm:text-2xl leading-tight max-w-[200px]">Worn by Those Who Value Time</p>
              </div>
              <div className="absolute inset-0 border-2 border-primary-gold/0 group-hover:border-primary-gold/30 rounded-xl transition-all duration-500" />
            </div>

            <div className="col-span-1 relative h-48 sm:h-56 overflow-hidden rounded-xl border border-zinc-900 group">
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"
                alt="Luxury watch close up"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-w-7xl) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold block mb-1">Crafted</span>
                <p className="text-white font-serif text-sm">Swiss Precision</p>
              </div>
              <div className="absolute inset-0 border-2 border-primary-gold/0 group-hover:border-primary-gold/30 rounded-xl transition-all duration-500" />
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-primary-gold hover:text-primary-gold text-zinc-300 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-full group"
            >
              Explore Full Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      */}

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
