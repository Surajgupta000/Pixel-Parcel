import Image from "next/image";
import { Compass, Eye, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-20">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Our Heritage</span>
        <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-widest uppercase">The Atelier Story</h1>
        <p className="text-xs uppercase tracking-[0.3em] text-[#8C7853]">Fusing micro-level pixels with hand-rolled physical parcels</p>
      </div>

      {/* Grid 1: Narrative and Big Image */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-wide leading-tight">
            We believe that time is the ultimate canvas of luxury.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            Founded in Geneva with deep roots in modern cryptographic verification, **Pixel & Parcel** emerged as a response to a changing luxury landscape. Collectors faced an epidemic of counterfeit mechanical models and untrustworthy gray markets.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            We asked ourselves: how can we bridge the gap between digital signature trust and physical mechanical soul? The answer lay in our name. We calibrate each escapement and package it inside a lacquer chest (**The Parcel**) and register its unique metadata hash on a secure verification network (**The Pixel**).
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            When you purchase a Pixel & Parcel, you do not just acquire a movement; you secure a verified, certified legacy.
          </p>
        </div>

        <div className="relative h-[400px] rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950">
          <Image 
            src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000" 
            alt="Master watchmaker assembly under loupe"
            fill
            className="object-cover opacity-75"
            sizes="(max-w-7xl) 50vw, 100vw"
          />
        </div>
      </section>

      {/* Grid 2: Three pillars of watchmaking */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-[#0E0E0E] border border-zinc-900 p-6 rounded space-y-4">
          <div className="inline-flex p-3 bg-primary-gold/10 border border-primary-gold/20 rounded-full text-primary-gold">
            <Compass className="h-5 w-5" />
          </div>
          <h4 className="font-serif text-white text-base">Atelier Calibration</h4>
          <p className="text-xs text-zinc-450 leading-relaxed font-light">
            Our workshop regulates every movement across temperature spikes and gravitational angles, guaranteeing chronometer sweeps.
          </p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-900 p-6 rounded space-y-4">
          <div className="inline-flex p-3 bg-primary-gold/10 border border-primary-gold/20 rounded-full text-primary-gold">
            <Eye className="h-5 w-5" />
          </div>
          <h4 className="font-serif text-white text-base">Finishing Detail</h4>
          <p className="text-xs text-zinc-455 leading-relaxed font-light">
            We mirror-polish chamfers and hand-apply Perlage graining. The sapphire caseback exhibits a stunning visual spectacle of rotating gears.
          </p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-900 p-6 rounded space-y-4">
          <div className="inline-flex p-3 bg-primary-gold/10 border border-primary-gold/20 rounded-full text-primary-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="font-serif text-white text-base">Private Security</h4>
          <p className="text-xs text-zinc-455 leading-relaxed font-light">
            Each timepiece includes physical micro-prints and digital serial hashes, protecting ownership assets indefinitely.
          </p>
        </div>

      </section>

      {/* Grid 3: The Watchmakers Atelier */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-zinc-900 pt-16">
        
        <div className="relative h-[360px] rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950 lg:order-last">
          <Image 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000" 
            alt="Hand-polishing watch details"
            fill
            className="object-cover opacity-75"
            sizes="(max-w-7xl) 50vw, 100vw"
          />
        </div>

        <div className="space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-gold block">Our Watchmakers</span>
          <h3 className="text-3xl font-serif text-white tracking-wide">The Artisanal Team</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            At the heart of Pixel & Parcel are our master watchmakers. Headed by **Master Watchmaker Marc-Antoine Vacheron**, a veteran with over three decades of complication development, and **Lead Technical Director Sarah Chen**, a specialist in digital-physical interface engineering.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            From our design boards in Geneva to our testing rooms, each team member is united by a single vision: that time is precious, and trust must be absolute.
          </p>
        </div>

      </section>

    </div>
  );
}
