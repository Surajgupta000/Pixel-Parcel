"use client";

import { useParams, useRouter } from "next/navigation";
import { products, WatchProduct } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, ArrowLeftRight, ShoppingCart, ShieldCheck, Download, 
  ChevronRight, ArrowLeft, Star, Clock, Compass, Box, UserCheck, X 
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const watchId = params.id as string;
  const { addToCart, wishlist, toggleWishlist, addToCompare } = useStore();

  const [watch, setWatch] = useState<WatchProduct | undefined>(() => {
    const decodedWatchId = decodeURIComponent(watchId).toLowerCase();
    return products.find(p => decodeURIComponent(p.id).toLowerCase() === decodedWatchId);
  });
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const list: WatchProduct[] = await res.json();
          const decoded = decodeURIComponent(watchId).toLowerCase();
          const found = list.find(p => decodeURIComponent(p.id).toLowerCase() === decoded);
          if (found) {
            const isValidUrl = (url: any) => typeof url === "string" && (url.trim().startsWith("http://") || url.trim().startsWith("https://") || url.trim().startsWith("/"));
            const fallback = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000";
            const cleanImg = isValidUrl(found.imageUrl) ? found.imageUrl.trim() : fallback;
            const cleanImages = Array.isArray(found.images) ? found.images.filter(isValidUrl).map((img: string) => img.trim()) : [cleanImg];
            setWatch({
              ...found,
              imageUrl: cleanImg,
              images: cleanImages.length > 0 ? cleanImages : [cleanImg]
            });
            return;
          }
        }
      } catch (err) {
        console.error("Error loading products on detail page from API", err);
      }

      const local = localStorage.getItem("pp_products");
      if (local) {
        try {
          const list: WatchProduct[] = JSON.parse(local);
          const isValidUrl = (url: any) => typeof url === "string" && (url.trim().startsWith("http://") || url.trim().startsWith("https://") || url.trim().startsWith("/"));
          const fallback = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000";
          const decoded = decodeURIComponent(watchId).toLowerCase();
          const found = list.find(p => decodeURIComponent(p.id).toLowerCase() === decoded);
          if (found) {
            const cleanImg = isValidUrl(found.imageUrl) ? found.imageUrl.trim() : fallback;
            const cleanImages = Array.isArray(found.images) ? found.images.filter(isValidUrl).map((img: string) => img.trim()) : [cleanImg];
            setWatch({
              ...found,
              imageUrl: cleanImg,
              images: cleanImages.length > 0 ? cleanImages : [cleanImg]
            });
          }
        } catch (e) {
          console.error("Error parsing products in detail page from localStorage", e);
        }
      }
    };

    loadProduct();
  }, [watchId]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [engravingText, setEngravingText] = useState("");
  const [showEngraving, setShowEngraving] = useState(false);
  const [qty, setQty] = useState(1);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isCertificateDownloaded, setIsCertificateDownloaded] = useState(false);

  if (!watch) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6 flex-grow flex flex-col justify-center">
        <h2 className="text-3xl font-serif text-white uppercase">Timepiece Not Found</h2>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">The requested caliber does not exist in our historical archive.</p>
        <Link 
          href="/shop" 
          className="px-6 py-2.5 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors rounded inline-block w-fit mx-auto"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(watch.id);

  // Use custom gallery images if available, otherwise fall back to simulated ones
  const galleryImages = watch.images && watch.images.length > 0
    ? watch.images
    : [
        watch.imageUrl,
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000", // Movement gears close-up
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000", // Side crown angle
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000"  // Presentation case view
      ];

  const handleAddToCart = () => {
    const text = showEngraving ? engravingText : undefined;
    addToCart(watch, qty, text);
    setEngravingText("");
    setShowEngraving(false);
    setQty(1);
  };

  const handleDownloadCertificate = () => {
    setIsCertificateDownloaded(true);
    // Simulate file generation delay
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([
        `PIXEL & PARCEL - ATELIER GENÈVE
AUTHENTICITY CERTIFICATE
-----------------------------------
Watch model: ${watch.name}
SKU: ${watch.sku}
Serial Number: PP-${watch.sku.replace(/-/g, "")}-9826
Case Material: ${watch.caseMaterial}
Movement type: ${watch.movement}
Caliber ID: ${watch.caliber}
Strap configuration: ${watch.strapMaterial} (${watch.strapDetails})
Dial Colorway: ${watch.dialColor}

STATEMENTS OF VERIFICATION:
- This is to certify that this timepiece has been thoroughly inspected by our master watchmakers.
- Certified chronometer sweep and gear amplitude compliance.
- 5-year escapement warranty activated.
- Secured and timestamped signature: P&P Blockchain Core.
-----------------------------------
Where time meets trust.`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${watch.id}_authenticity_certificate.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsCertificateDownloaded(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      
      {/* Breadcrumb / Back button */}
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-550 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
        
        <div className="flex gap-2 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-white">Gallery</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-400">{watch.name}</span>
        </div>
      </div>

      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: MULTI-ANGLE IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="h-[480px] w-full relative overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950">
            <Image 
              src={galleryImages[activeImageIndex]} 
              alt={`${watch.name} view ${activeImageIndex + 1}`} 
              fill
              className="object-contain p-6 transition-all duration-500"
              priority
              sizes="(max-w-7xl) 50vw, 100vw"
            />

            {/* Quick angle tag */}
            <span className="absolute bottom-4 left-4 z-10 bg-black/75 px-3 py-1 text-[9px] uppercase tracking-widest text-primary-gold rounded font-mono">
              Angle: {watch.images && watch.images.length > 0 
                ? `Perspective ${activeImageIndex + 1}` 
                : ["Face Dial", "Caliber Caseback", "Crown Profile", "Exquisite Box"][activeImageIndex] || `View ${activeImageIndex + 1}`}
            </span>
          </div>

          {/* Thumbnails grid for 360 degree simulator */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${galleryImages.length}, minmax(0, 1fr))` }}>
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-24 relative overflow-hidden rounded border transition-all ${
                  activeImageIndex === idx 
                    ? "border-primary-gold" 
                    : "border-zinc-900 opacity-60 hover:opacity-100"
                }`}
              >
                <Image 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  fill 
                  className="object-contain p-2" 
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL SPECS & PURCHASING */}
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-550 tracking-wider">{watch.sku}</span>
                <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">{watch.name}</h1>
                <p className="text-xs text-primary-gold font-serif italic mt-0.5">{watch.tagline}</p>
              </div>
              <button 
                onClick={() => toggleWishlist(watch.id)}
                className="p-2.5 rounded-full border border-zinc-900 bg-[#0E0E0E] text-zinc-500 hover:text-red-400 transition-colors"
                title="Add to wishlist"
              >
                <Heart className={`h-4.5 w-4.5 ${isInWishlist ? "fill-red-400 text-red-400" : ""}`} />
              </button>
            </div>
            
            {/* Price tag */}
            <div className="flex items-baseline gap-4 pt-3">
              <span className="text-2xl font-bold text-white">₹{watch.price.toLocaleString("en-IN")}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c7853]">GST and Free Shipping Included</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-zinc-900" />

          {/* Description */}
          <p className="text-xs text-zinc-400 leading-relaxed font-light">{watch.description}</p>

          {/* Technical Specs Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 py-4 bg-[#0E0E0E] border border-zinc-900 p-4 rounded text-xs">
            <div>
              <span className="text-zinc-550 block text-[9px] uppercase tracking-wider">Caliber</span>
              <span className="text-white font-mono">{watch.caliber.split(" ")[1] || watch.caliber}</span>
            </div>
            <div>
              <span className="text-zinc-550 block text-[9px] uppercase tracking-wider">Movement</span>
              <span className="text-white">{watch.movement}</span>
            </div>
            <div>
              <span className="text-zinc-550 block text-[9px] uppercase tracking-wider">Reserve</span>
              <span className="text-white">{watch.powerReserve}</span>
            </div>
            <div>
              <span className="text-zinc-550 block text-[9px] uppercase tracking-wider">Water Rating</span>
              <span className="text-white">{watch.waterResistance}</span>
            </div>
            <div>
              <span className="text-zinc-550 block text-[9px] uppercase tracking-wider">Case Thickness</span>
              <span className="text-white">{watch.thickness}</span>
            </div>
            <div>
              <span className="text-zinc-550 block text-[9px] uppercase tracking-wider">Jewel Count</span>
              <span className="text-white">{watch.jewels} jewels</span>
            </div>
          </div>

          {/* Engraving personalization */}
          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-400 hover:text-white select-none">
              <input 
                type="checkbox"
                checked={showEngraving}
                onChange={(e) => setShowEngraving(e.target.checked)}
                className="accent-primary-gold rounded border-zinc-800"
              />
              <span>Add custom laser engraving (Caseback) - <span className="text-primary-gold uppercase text-[9px] font-bold">Complimentary</span></span>
            </label>
            {showEngraving && (
              <input 
                type="text"
                maxLength={24}
                placeholder="e.g. D.S. WITH LOVE 2026"
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                className="w-full bg-[#070707] border border-zinc-850 text-zinc-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono uppercase"
              />
            )}
          </div>

          {/* Quantity and Cart button */}
          <div className="flex gap-4 items-end pt-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Qty</label>
              <div className="flex items-center border border-zinc-900 rounded bg-[#070707] h-11 px-3">
                <button 
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-mono text-white">{qty}</span>
                <button 
                  onClick={() => setQty(prev => prev + 1)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-grow h-11 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded shadow-lg shadow-primary-gold/5"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              Acquire Timepiece
            </button>
          </div>

          {/* Authenticity Certificate button */}
          <div className="pt-4">
            <button 
              onClick={() => setShowCertificate(true)}
              className="w-full py-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded"
            >
              <ShieldCheck className="h-4.5 w-4.5 text-primary-gold" />
              Inspect Authenticity Certificate
            </button>
          </div>

        </div>
      </div>

      {/* SPECS & DETAILS ACCORDIONS */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-900 pt-16">
        
        {/* Spec details list */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-white tracking-wide">Movement & Caliber Details</h3>
          <p className="text-xs text-zinc-500 font-light leading-relaxed">
            Each movement is built and decorated entirely by hand. The bridges are chamfered, and the plates are decorated with circular graining (Perlage) and Côtes de Genève stripes. The self-winding rotor is constructed from a solid block of gold/tungsten for optimal winding efficiency.
          </p>

          <table className="w-full text-xs text-zinc-400 border-collapse">
            <tbody>
              {watch.displayBrand && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Display Brand</td>
                  <td className="py-2.5 text-zinc-300">{watch.displayBrand}</td>
                </tr>
              )}
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Escapement Caliber</td>
                <td className="py-2.5 font-mono text-zinc-300">{watch.caliber}</td>
              </tr>
              {watch.gender && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Gender</td>
                  <td className="py-2.5 text-zinc-300">{watch.gender}</td>
                </tr>
              )}
              {watch.glassMaterial && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Glass Material</td>
                  <td className="py-2.5 text-zinc-300">{watch.glassMaterial}</td>
                </tr>
              )}
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Strap Spec</td>
                <td className="py-2.5 text-zinc-300">{watch.strapDetails} ({watch.strapMaterial})</td>
              </tr>
              {watch.strapColor && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Strap Color</td>
                  <td className="py-2.5 text-zinc-300">{watch.strapColor}</td>
                </tr>
              )}
              {watch.function && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Function</td>
                  <td className="py-2.5 text-zinc-300">{watch.function}</td>
                </tr>
              )}
              {watch.lockMechanism && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Lock Mechanism</td>
                  <td className="py-2.5 text-zinc-300">{watch.lockMechanism}</td>
                </tr>
              )}
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Casing Specs</td>
                <td className="py-2.5 text-zinc-300">{watch.caseMaterial} Case, {watch.caseDiameter} Diameter</td>
              </tr>
              {watch.caseShape && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Case Shape</td>
                  <td className="py-2.5 text-zinc-300">{watch.caseShape}</td>
                </tr>
              )}
              {watch.caseLength && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Case Length</td>
                  <td className="py-2.5 text-zinc-300">{watch.caseLength}</td>
                </tr>
              )}
              {watch.caseWidth && (
                <tr className="border-b border-zinc-900">
                  <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Case Width</td>
                  <td className="py-2.5 text-zinc-300">{watch.caseWidth}</td>
                </tr>
              )}
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 font-bold uppercase tracking-wider text-[9px] text-zinc-550">Crystal Guard</td>
                <td className="py-2.5 text-zinc-300">Scratch-resistant Sapphire Crystal with Double Anti-reflective coating</td>
              </tr>
            </tbody>
          </table>
        </div>        {/* Unboxing Experience */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-white tracking-wide">The Unboxing Ritual</h3>
          <p className="text-xs text-zinc-500 font-light leading-relaxed">
            The parcel delivery contains a heavy, piano-lacquered wooden presentation chest. The interior is lined with soft cream suede, and contains a hidden drawer holding the physical micro-printed warranty card, leather pouch, watchmaker microfiber cleaning cloth, and original user documentation.
          </p>

          <div className="h-44 w-full relative rounded overflow-hidden border border-zinc-900 bg-zinc-950 flex items-center justify-center group cursor-pointer">
            <Image 
              src="https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1000" 
              alt="Lacquered wooden box"
              fill
              className="object-cover opacity-35 group-hover:scale-102 transition-transform duration-500"
              sizes="500px"
            />
            <div className="relative text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary-gold block">Experience Video</span>
              <span className="text-xs text-zinc-400 font-medium">Watch Unboxing Ceremony</span>
            </div>
          </div>
        </div>

      </section>

      {/* REVIEWS SECTION */}
      <section className="mt-20 border-t border-zinc-900 pt-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif text-white tracking-wide">Collector Appraisals</h3>
            <p className="text-xs text-zinc-500">Appreciations shared by verified owners of this timepiece.</p>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 p-3 rounded h-fit">
            <span className="text-3xl font-serif text-primary-gold font-bold">{watch.rating.toFixed(1)}</span>
            <div className="space-y-0.5">
              <div className="flex text-primary-gold">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 fill-primary-gold text-primary-gold ${
                      i >= Math.floor(watch.rating) ? "opacity-30 fill-transparent" : ""
                    }`} 
                  />
                ))}
              </div>
              <p className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold">{watch.reviewsCount} Appraisals Total</p>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watch.reviews.map((rev) => (
            <div key={rev.id} className="bg-[#0E0E0E] border border-zinc-900 p-5 rounded space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-serif text-white text-sm">{rev.name}</h5>
                  <span className="text-[9px] font-mono text-zinc-550">{rev.date}</span>
                </div>
                
                <div className="flex gap-0.5 text-primary-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 fill-primary-gold text-primary-gold ${
                        i >= rev.rating ? "opacity-20 fill-transparent text-zinc-700" : ""
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-400 font-light leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
              
              {rev.verified && (
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-primary-gold/80">
                  <UserCheck className="h-3 w-3" />
                  <span>Verified Acquisition</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AUTHENTICITY CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090909] border border-zinc-800 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden relative p-8 md:p-10 space-y-8">
            
            <button 
              onClick={() => {
                setShowCertificate(false);
                setIsCertificateDownloaded(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary-gold p-1"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Certificate content representation */}
            <div className="border border-double border-primary-gold/45 p-6 md:p-8 space-y-6 text-center bg-[#0C0C0C]">
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8c7853] block">Atelier de Haute Horlogerie</span>
                <h4 className="text-2xl font-serif text-white tracking-[0.2em] uppercase">Pixel & Parcel</h4>
                <p className="text-[8px] font-mono uppercase text-zinc-550 tracking-wider">Blockchain Ledger Certificate #PP-{watch.sku.replace(/-/g, "")}-9826</p>
              </div>

              <div className="h-[1px] w-12 bg-primary-gold/30 mx-auto" />

              <div className="space-y-2 text-xs">
                <p className="text-zinc-400 uppercase tracking-widest text-[9px]">Verified Authentic Caliber</p>
                <div className="space-y-1 text-zinc-300 font-mono">
                  <p>Model: {watch.name}</p>
                  <p>SKU: {watch.sku}</p>
                  <p>Caliber: {watch.caliber.split(" (")[0]}</p>
                  <p>Case: {watch.caseMaterial} | {watch.caseDiameter}</p>
                </div>
              </div>

              <div className="relative h-20 w-20 mx-auto opacity-80 mt-4">
                <Image 
                  src="/favicon.ico" 
                  alt="Hologram Signature" 
                  fill 
                  className="object-contain grayscale contrast-150 scale-120 animate-spin-reverse opacity-15"
                />
                <ShieldCheck className="h-10 w-10 text-primary-gold absolute inset-0 m-auto animate-pulse" />
              </div>

              <p className="text-[9px] text-[#8C7853] leading-relaxed uppercase tracking-wider max-w-xs mx-auto">
                Validated and registered under legal escorts. Tamper-proof certificate signature active.
              </p>
            </div>

            <button 
              onClick={handleDownloadCertificate}
              disabled={isCertificateDownloaded}
              className="w-full py-3 bg-primary-gold hover:bg-gold-light disabled:bg-zinc-800 text-black disabled:text-zinc-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded font-sans"
            >
              <Download className="h-4 w-4" />
              {isCertificateDownloaded ? "Generating Ledger Certificate..." : "Download PDF Certificate"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
