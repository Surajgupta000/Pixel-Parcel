export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface WatchProduct {
  id: string;
  name: string;
  tagline: string;
  price: number;
  movement: 'Automatic' | 'Quartz' | 'Mechanical' | string;
  caliber: string;
  caseMaterial: 'Stainless Steel' | 'Titanium' | '18K Gold' | 'Platinum' | string;
  strapMaterial: 'Leather' | 'Metal' | 'Rubber' | string;
  strapDetails: string;
  waterResistance: string;
  dialColor: string;
  caseDiameter: string;
  thickness: string;
  powerReserve: string;
  jewels: number;
  imageUrl: string;
  localImage: string;
  sku: string;
  stock: number;
  description: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];

  // Custom Specifications
  displayBrand?: string;
  gender?: string;
  glassMaterial?: string;
  strapColor?: string;
  function?: string;
  lockMechanism?: string;
  caseShape?: string;
  caseLength?: string;
  caseWidth?: string;
  images?: string[];

  // Categorization & Promotion Settings
  style?: 'Casual' | 'Formal' | 'Digital' | 'Smart' | string;
  isNewArrival?: boolean;
  isSummerSale?: boolean;
}

export const products: WatchProduct[] = [
  {
    id: "chronos-horizon",
    name: "Chronos Horizon",
    tagline: "Classic elegance for the modern voyager",
    price: 420000,
    movement: "Automatic",
    caliber: "Caliber PP-8921 (Self-winding)",
    caseMaterial: "18K Gold",
    strapMaterial: "Leather",
    strapDetails: "Hand-stitched brown Italian alligator leather",
    waterResistance: "50m (5 ATM)",
    dialColor: "Opaline Cream",
    caseDiameter: "40mm",
    thickness: "11.2mm",
    powerReserve: "68 Hours",
    jewels: 31,
    imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000",
    localImage: "/images/products/chronos_horizon.jpg",
    sku: "PP-CH-8921",
    stock: 2,
    description: "The Chronos Horizon is our flagship model, combining a sweeping automatic movement with a solid 18K yellow gold case. Every dial is hand-polished in our Geneva workshop to achieve an opaline luster that captures light at every angle. It features a sapphire crystal exhibition case back, showing the beautifully decorated gold rotor and bridge work.",
    rating: 4.9,
    reviewsCount: 14,
    reviews: [
      { id: "r1", name: "Aravind Sharma", rating: 5, text: "An absolute masterpiece. The weight of the 18k gold on the wrist is substantial yet comfortable. The movement sweeps beautifully.", date: "2026-04-12", verified: true },
      { id: "r2", name: "Helena Rostova", rating: 5, text: "Understated luxury. The opaline cream dial is gorgeous in daylight. Truly where time meets trust.", date: "2026-05-01", verified: true },
      { id: "r3", name: "Vikram Seth", rating: 4, text: "Stunning timepiece. Power reserve is excellent, holds time perfectly. Packaging was immaculate.", date: "2026-05-18", verified: true }
    ],
    gender: "Guys",
    style: "Formal",
    isNewArrival: true,
    isSummerSale: true
  },
  {
    id: "quantum-stealth",
    name: "Quantum Stealth",
    tagline: "Industrial mechanics in titanium",
    price: 280000,
    movement: "Mechanical",
    caliber: "Caliber PP-M104 (Manual-wind)",
    caseMaterial: "Titanium",
    strapMaterial: "Rubber",
    strapDetails: "FKM vulcanized black rubber strap with titanium buckle",
    waterResistance: "100m (10 ATM)",
    dialColor: "Skeleton Matte Grey",
    caseDiameter: "42mm",
    thickness: "12.5mm",
    powerReserve: "72 Hours",
    jewels: 28,
    imageUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1000",
    localImage: "/images/products/quantum_stealth.jpg",
    sku: "PP-QS-M104",
    stock: 3,
    description: "Crafted from Grade 5 sandblasted titanium, the Quantum Stealth is a statement of modern engineering. The openwork skeleton dial exposes the manual-wind mechanical heart of the timepiece. Featuring a balance wheel ticking at 28,800 vibrations per hour, it is as rugged as it is precise, wrapped in a high-grade FKM rubber strap designed for active luxury.",
    rating: 4.8,
    reviewsCount: 9,
    reviews: [
      { id: "r4", name: "Rohan Das", rating: 5, text: "The skeleton dial is mesmerizing. The titanium makes it incredibly light despite the 42mm size. The rubber strap is high quality.", date: "2026-02-28", verified: true },
      { id: "r5", name: "Marcus Aurelius", rating: 4, text: "Excellent daily sports watch. Rugged, scratches don't show easily on the titanium. Keeps precise time.", date: "2026-03-15", verified: true }
    ],
    gender: "Guys",
    style: "Casual",
    isNewArrival: false,
    isSummerSale: true
  },
  {
    id: "vanguard-classic",
    name: "Vanguard Classic",
    tagline: "The essence of timeless steel",
    price: 150000,
    movement: "Automatic",
    caliber: "Caliber PP-8100 (Self-winding)",
    caseMaterial: "Stainless Steel",
    strapMaterial: "Metal",
    strapDetails: "Brushed & polished 316L stainless steel bracelet",
    waterResistance: "100m (10 ATM)",
    dialColor: "Emerald Green",
    caseDiameter: "39mm",
    thickness: "10.8mm",
    powerReserve: "48 Hours",
    jewels: 25,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000",
    localImage: "/images/products/vanguard_classic.jpg",
    sku: "PP-VC-8100",
    stock: 7,
    description: "The Vanguard Classic is a homage to the golden era of steel sports watches. Its 39mm case is meticulously finished with alternating brushed and mirror-polished facets. The vibrant emerald green dial features a sunburst pattern that morphs from deep forest green to bright jade depending on the light, accompanied by faceted white-gold hands.",
    rating: 4.7,
    reviewsCount: 22,
    reviews: [
      { id: "r6", name: "Kabir Mehta", rating: 5, text: "The green sunburst dial is unbelievable. Looks much more expensive than it is. Fits perfectly on a 6.5 inch wrist.", date: "2026-04-20", verified: true },
      { id: "r7", name: "Sarah Jenkins", rating: 5, text: "My first luxury automatic watch and I couldn't be happier. Elegant, versatile, goes with a suit or a t-shirt.", date: "2026-05-10", verified: true }
    ],
    gender: "Guys",
    style: "Formal",
    isNewArrival: true,
    isSummerSale: false
  },
  {
    id: "onyx-spectre",
    name: "Onyx Spectre",
    tagline: "Stealth design, unmatched presence",
    price: 195000,
    movement: "Automatic",
    caliber: "Caliber PP-8150 (Self-winding)",
    caseMaterial: "Stainless Steel",
    strapMaterial: "Metal",
    strapDetails: "Matte black DLC-coated stainless steel bracelet",
    waterResistance: "200m (20 ATM)",
    dialColor: "Stealth Black",
    caseDiameter: "41mm",
    thickness: "12.0mm",
    powerReserve: "50 Hours",
    jewels: 26,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000",
    localImage: "/images/products/onyx_spectre.jpg",
    sku: "PP-OS-8150",
    stock: 5,
    description: "Coated in Diamond-Like Carbon (DLC), the Onyx Spectre is a stealthy, high-durability diver watch. The deep matte black finish is accented with subtle polished highlights. The hands and markers are coated in a custom dark-grey Super-LumiNova that glows a vibrant blue in darkness, offering perfect legibility with a covert daytime look.",
    rating: 4.6,
    reviewsCount: 11,
    reviews: [
      { id: "r8", name: "David Miller", rating: 4, text: "Very cool stealth look. The lume is extremely bright. The black DLC coating is holding up perfectly against scratches.", date: "2026-03-10", verified: true },
      { id: "r9", name: "Sameer Verma", rating: 5, text: "A rugged luxury watch. The screw-down crown feels solid. Love the matte black bracelet.", date: "2026-04-05", verified: true }
    ],
    gender: "Unisex",
    style: "Casual",
    isNewArrival: true,
    isSummerSale: false
  },
  {
    id: "celestial-eclipse",
    name: "Celestial Eclipse",
    tagline: "Complication of the stars",
    price: 480000,
    movement: "Mechanical",
    caliber: "Caliber PP-MP302 (Manual-wind Moonphase)",
    caseMaterial: "18K Gold",
    strapMaterial: "Leather",
    strapDetails: "Midnight blue hand-rolled alligator leather strap",
    waterResistance: "30m (3 ATM)",
    dialColor: "Midnight Aventurine",
    caseDiameter: "38.5mm",
    thickness: "10.5mm",
    powerReserve: "65 Hours",
    jewels: 35,
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000",
    localImage: "/images/products/celestial_eclipse.jpg",
    sku: "PP-CE-M302",
    stock: 1,
    description: "The Celestial Eclipse features an aventurine glass dial that mimics a starry night sky. At 6 o'clock sits an integrated high-precision moonphase indicator that requires adjustment only once every 122 years. Encased in 18K rose gold and measuring a slim 10.5mm, this manual-wind dress watch represents the pinnacle of watchmaking artistry.",
    rating: 5.0,
    reviewsCount: 6,
    reviews: [
      { id: "r10", name: "Jean-Pierre", rating: 5, text: "Simply breathtaking. The aventurine dial looks like a galaxy. A true collector's item.", date: "2026-01-15", verified: true },
      { id: "r11", name: "Priya Nair", rating: 5, text: "The moonphase complication is fluid and accurate. The 18k rose gold is soft and warm. Best watch in my collection.", date: "2026-03-22", verified: true }
    ],
    gender: "Ladies",
    style: "Formal",
    isNewArrival: false,
    isSummerSale: true
  },
  {
    id: "apex-mariner",
    name: "Apex Mariner",
    tagline: "Uncompromising exploration in the deep",
    price: 310000,
    movement: "Automatic",
    caliber: "Caliber PP-D900 (Self-winding diver)",
    caseMaterial: "Titanium",
    strapMaterial: "Metal",
    strapDetails: "Grade 5 titanium bracelet with micro-adjust clasp",
    waterResistance: "300m (30 ATM)",
    dialColor: "Abyssal Blue",
    caseDiameter: "43mm",
    thickness: "13.2mm",
    powerReserve: "70 Hours",
    jewels: 29,
    imageUrl: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1000",
    localImage: "/images/products/apex_mariner.jpg",
    sku: "PP-AM-D900",
    stock: 4,
    description: "Built for professional saturation divers, the Apex Mariner is made from Grade 5 titanium, offering twice the strength of steel at half the weight. Equipped with a helium escape valve, ceramic unidirectional bezel, and 300 meters of water resistance, it is powered by our chronometer-certified automatic movement with a 70-hour power reserve.",
    rating: 4.8,
    reviewsCount: 18,
    reviews: [
      { id: "r12", name: "Christian Vance", rating: 5, text: "Excellent dive watch. The titanium band feels premium and light. Ceramic bezel click action is crisp and alignment is perfect.", date: "2026-03-30", verified: true },
      { id: "r13", name: "Aditya Roy", rating: 4, text: "Incredibly tough. I've taken it diving twice, holds up perfectly. Highly recommended for watch purists.", date: "2026-05-05", verified: true }
    ],
    gender: "Guys",
    style: "Casual",
    isNewArrival: true,
    isSummerSale: true
  },
  {
    id: "aero-tourbillon",
    name: "Aero Tourbillon",
    tagline: "Gravity-defying mechanical precision",
    price: 495000,
    movement: "Mechanical",
    caliber: "Caliber PP-TB01 (Manual-wind Flying Tourbillon)",
    caseMaterial: "Platinum",
    strapMaterial: "Leather",
    strapDetails: "Matte black hand-stitched Mississippiensis alligator leather",
    waterResistance: "30m (3 ATM)",
    dialColor: "Rhodium Openwork",
    caseDiameter: "41mm",
    thickness: "11.8mm",
    powerReserve: "60 Hours",
    jewels: 38,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000",
    localImage: "/images/products/aero_tourbillon.jpg",
    sku: "PP-AT-TB01",
    stock: 2,
    description: "A tour de force in haute horlogerie, the Aero Tourbillon features a flying tourbillon at 6 o'clock that completes one rotation every 60 seconds, counteracting the effects of gravity on the escapement. Housed in a dense, solid platinum case and fully skeletonized by hand, it showcases our finest movement decoration.",
    rating: 5.0,
    reviewsCount: 4,
    reviews: [
      { id: "r14", name: "Sir Richard", rating: 5, text: "A masterpiece of watchmaking. The flying tourbillon is hypnotizing to watch. Exceptional quality from Pixel & Parcel.", date: "2026-04-10", verified: true },
      { id: "r15", name: "Mei-Ling Chen", rating: 5, text: "The finishings on the bridges and plates are exquisite. Platinum weight is substantial. Beautifully presented in a piano wood box.", date: "2026-05-15", verified: true }
    ],
    gender: "Guys",
    style: "Formal",
    isNewArrival: true,
    isSummerSale: false
  },
  {
    id: "nomad-gmt",
    name: "Nomad GMT",
    tagline: "Track dual time zones on the go",
    price: 85000,
    movement: "Quartz",
    caliber: "Caliber PP-Q500 (High-accuracy Quartz GMT)",
    caseMaterial: "Stainless Steel",
    strapMaterial: "Rubber",
    strapDetails: "Textured burgundy red rubber strap with folding clasp",
    waterResistance: "100m (10 ATM)",
    dialColor: "Slate Grey",
    caseDiameter: "40mm",
    thickness: "9.8mm",
    powerReserve: "3 Year Battery Life",
    jewels: 7,
    imageUrl: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1000",
    localImage: "/images/products/nomad_gmt.jpg",
    sku: "PP-NG-Q500",
    stock: 8,
    description: "Designed for the global traveler, the Nomad GMT houses a high-accuracy quartz movement capable of tracking two time zones simultaneously via the dedicated GMT hand and 24-hour bezel. Measuring a sleek 9.8mm thin, it is built with a stainless steel case and a textured, comfort-fit rubber strap, ready for any timezone.",
    rating: 4.5,
    reviewsCount: 25,
    reviews: [
      { id: "r16", name: "Aman Gupta", rating: 4, text: "Perfect travel companion. Extremely thin and lightweight. The dual time zone is easy to set.", date: "2026-02-15", verified: true },
      { id: "r17", name: "Sophia Martinez", rating: 5, text: "Simple, accurate, and very stylish. The burgundy strap gets a lot of compliments. Outstanding build quality.", date: "2026-03-25", verified: true }
    ],
    gender: "Unisex",
    style: "Casual",
    isNewArrival: false,
    isSummerSale: true
  },
  {
    id: "nt3099sl01",
    name: "Fastrack Quartz Analog Silver Dial Leather Strap Watch for Guys",
    tagline: "Sleek and robust contemporary style",
    price: 3995,
    movement: "Quartz",
    caliber: "NT3099SL01",
    caseMaterial: "Metal",
    strapMaterial: "Leather",
    strapDetails: "Brown leather strap with buckle lock",
    waterResistance: "30m (3 ATM)",
    dialColor: "Silver (White with Red Accents)",
    caseDiameter: "44.80mm",
    thickness: "13.30mm",
    powerReserve: "2 Years (Battery)",
    jewels: 0,
    imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000",
    localImage: "/images/products/fastrack_quartz.jpg",
    sku: "NT3099SL01",
    stock: 15,
    description: "Beef up your look with this watch. The white dial with red accents gives the watch a robust look. The brown leather strap provides a sleek finish to the watch. Pair this timepiece with a fitted t-shirt and a pair of jeans and set out in pursuit of a hunky affair!",
    rating: 4.8,
    reviewsCount: 1,
    reviews: [
      { id: "ft-rev-1", name: "Suraj", rating: 5, text: "Extremely robust and premium feel. Perfect daily wear.", date: "2026-05-26", verified: true }
    ],
    displayBrand: "Fastrack",
    gender: "Guys",
    glassMaterial: "Mineral Glass",
    strapColor: "Brown",
    function: "Analog",
    lockMechanism: "Buckle",
    caseShape: "Round",
    caseLength: "51.80 Mm",
    caseWidth: "44.80 Mm",
    images: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000"
    ],
    style: "Casual",
    isNewArrival: false,
    isSummerSale: false
  },
  
  // 3 PREMIUM MOCK SMARTWATCHES FOR ALL SECTIONS
  {
    id: "stealth-pulse",
    name: "Stealth Pulse Smartwatch",
    tagline: "Rugged Grade-5 Titanium connected caliper",
    price: 45000,
    movement: "Quartz",
    caliber: "Caliber PP-S101",
    caseMaterial: "Titanium",
    strapMaterial: "Rubber",
    strapDetails: "Sandblasted black rubber strap with titanium buckle",
    waterResistance: "50m (5 ATM)",
    dialColor: "Onyx Black",
    caseDiameter: "43mm",
    thickness: "11.5mm",
    powerReserve: "5 Days (AMOLED Screen)",
    jewels: 0,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000",
    localImage: "",
    sku: "PP-SP-S101",
    stock: 6,
    description: "Designed for rugged elegance. Made from sandblasted Grade 5 titanium, featuring a high-resolution AMOLED display with a mechanical balance wheel ticking graphic screen simulator.",
    rating: 4.8,
    reviewsCount: 3,
    reviews: [],
    displayBrand: "Pixel & Parcel",
    gender: "Guys",
    style: "Smart",
    isNewArrival: true,
    isSummerSale: true
  },
  {
    id: "aura-rose",
    name: "Aura Rose Smartwatch",
    tagline: "Elegant rose gold connected timepiece",
    price: 55000,
    movement: "Quartz",
    caliber: "Caliber PP-S102",
    caseMaterial: "18K Gold",
    strapMaterial: "Leather",
    strapDetails: "Sleek midnight blue Italian leather strap",
    waterResistance: "30m (3 ATM)",
    dialColor: "Midnight Aventurine",
    caseDiameter: "39mm",
    thickness: "10.5mm",
    powerReserve: "4 Days (AOD Mode)",
    jewels: 0,
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000",
    localImage: "",
    sku: "PP-AR-S102",
    stock: 4,
    description: "A luxury connected timepiece encased in 18K rose gold. Adorned with a custom aventurine watchface, heart rate monitor, sleep tracking, and a premium leather strap.",
    rating: 4.9,
    reviewsCount: 5,
    reviews: [],
    displayBrand: "Pixel & Parcel",
    gender: "Ladies",
    style: "Smart",
    isNewArrival: true,
    isSummerSale: false
  },
  {
    id: "quantum-smart",
    name: "Quantum Digital Smartwatch",
    tagline: "Digital mechanical simulation connected",
    price: 95000,
    movement: "Quartz",
    caliber: "Caliber PP-S100",
    caseMaterial: "Titanium",
    strapMaterial: "Rubber",
    strapDetails: "Comfort black rubber strap with folding clasp",
    waterResistance: "50m (5 ATM)",
    dialColor: "Onyx Black",
    caseDiameter: "42mm",
    thickness: "11.0mm",
    powerReserve: "7 Days (Rechargeable)",
    jewels: 0,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000",
    localImage: "",
    sku: "PP-QS-S100",
    stock: 8,
    description: "Connected digital horology with a sandblasted titanium case, tactile push buttons, and a textured rubber strap. Seamless luxury smart notifications combined with physical casing.",
    rating: 4.8,
    reviewsCount: 2,
    reviews: [],
    displayBrand: "Pixel & Parcel",
    gender: "Unisex",
    style: "Digital",
    isNewArrival: true,
    isSummerSale: true
  }
];

export const coupons = [
  { code: "LUXURY10", discountPercent: 10, description: "10% off for first order" },
  { code: "WELCOME15", discountPercent: 15, description: "15% off for newsletter subscribers" },
  { code: "TRUSTTIME", discountPercent: 20, description: "Special 20% off promotion" }
];
