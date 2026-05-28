"use client";

import { useState, useEffect } from "react";
import { products as initialProducts, WatchProduct } from "@/data/products";
import { Plus, Trash2, Edit2, ShieldCheck, DollarSign, Calendar, ShoppingBag, Eye, RefreshCw, BarChart2 } from "lucide-react";
import Image from "next/image";

interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: "Processing" | "Calibrating" | "Shipped" | "Delivered";
  items: { name: string; qty: number; engraving?: string; price: number }[];
}

export default function AdminPage() {
  const [productsList, setProductsList] = useState<WatchProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"stats" | "products" | "addProduct" | "orders">("stats");

  // Selection states for catalog management
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Cloudinary image upload loading states
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingPrimary, setUploadingPrimary] = useState<boolean>(false);

  // Secure admin authorization state
  const [userIdInput, setUserIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form State for Adding/Editing Watch
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formWatch, setFormWatch] = useState<Partial<WatchProduct>>({
    name: "",
    tagline: "",
    price: 0,
    movement: "Quartz",
    caliber: "",
    caseMaterial: "Metal",
    strapMaterial: "Leather",
    strapDetails: "",
    waterResistance: "30m (3 ATM)",
    dialColor: "Silver",
    caseDiameter: "44.80mm",
    thickness: "13.30mm",
    powerReserve: "2 Years (Battery)",
    jewels: 0,
    imageUrl: "",
    sku: "",
    stock: 1,
    description: "",
    displayBrand: "",
    gender: "Men",
    glassMaterial: "Mineral Glass",
    strapColor: "Brown",
    function: "Analog",
    lockMechanism: "Buckle",
    caseShape: "Round",
    caseLength: "",
    caseWidth: "",
    images: ["", "", "", "", "", ""],
    style: "Casual",
    isNewArrival: false,
    isSummerSale: false
  });

  // Load from local storage or fall back
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProductsList(data);
          localStorage.setItem("pp_products", JSON.stringify(data));
          return;
        }
      } catch (err) {
        console.error("Error fetching products from API, falling back to localStorage", err);
      }

      const localProds = localStorage.getItem("pp_products");
      if (localProds) {
        try {
          const parsed = JSON.parse(localProds);
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
          localStorage.setItem("pp_products", JSON.stringify(sanitized));
        } catch (err) {
          console.error("Error loading/sanitizing products in admin", err);
          setProductsList(initialProducts);
        }
      } else {
        setProductsList(initialProducts);
        localStorage.setItem("pp_products", JSON.stringify(initialProducts));
      }
    };

    loadProducts();

    const localOrders = localStorage.getItem("pp_orders");
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    } else {
      const mockOrders: Order[] = [
        {
          id: "mock_ord_h12j93",
          date: new Date(Date.now() - 3600000 * 24).toISOString(),
          customerName: "Ananya Deshmukh",
          customerEmail: "ananya@deshmukh.in",
          total: 495600,
          status: "Calibrating",
          items: [{ name: "Chronos Horizon", qty: 1, engraving: "A & D 2026", price: 420000 }]
        },
        {
          id: "mock_ord_a098h2",
          date: new Date(Date.now() - 3600000 * 72).toISOString(),
          customerName: "Robert Sterling",
          customerEmail: "robert@sterling.co.uk",
          total: 177000,
          status: "Delivered",
          items: [{ name: "Vanguard Classic", qty: 1, price: 150000 }]
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem("pp_orders", JSON.stringify(mockOrders));
    }
  }, []);

  const saveProductsToStorage = async (updatedList: WatchProduct[]) => {
    setProductsList(updatedList);
    localStorage.setItem("pp_products", JSON.stringify(updatedList));
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList)
      });
    } catch (err) {
      console.error("Error writing products database on server", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormWatch({
      ...formWatch,
      [e.target.name]: value
    });
  };

  const isGenderChecked = (genderVal: string) => {
    if (!formWatch.gender) return false;
    return formWatch.gender.split(/[,;\s]+/).map(g => g.trim().toLowerCase()).includes(genderVal.toLowerCase());
  };

  const handleGenderCheckboxChange = (genderVal: string, checked: boolean) => {
    let currentGenders = formWatch.gender 
      ? formWatch.gender.split(/[,;\s]+/).map(g => g.trim()).filter(Boolean) 
      : [];
    
    const matchVal = genderVal.charAt(0).toUpperCase() + genderVal.slice(1).toLowerCase();

    if (checked) {
      if (!currentGenders.includes(matchVal)) {
        currentGenders.push(matchVal);
      }
    } else {
      currentGenders = currentGenders.filter(g => g.toLowerCase() !== genderVal.toLowerCase());
    }

    setFormWatch({
      ...formWatch,
      gender: currentGenders.join(", ")
    });
  };

  const handleImageChange = (index: number, val: string) => {
    const newImages = [...(formWatch.images || ["", "", "", "", "", ""])];
    newImages[index] = val;
    setFormWatch({
      ...formWatch,
      images: newImages
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userIdInput === "8651576301" && passwordInput === "sur123") {
      setIsAuthorized(true);
      setLoginError("");
    } else {
      setLoginError("Access Denied: Invalid User ID or Password credentials.");
    }
  };

  const handleAddOrEditWatch = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate minimum required fields
      if (!formWatch.name || formWatch.name.trim() === "") {
        alert("Please enter a Watch Name before submitting.");
        return;
      }

      const derivedSku = formWatch.sku && formWatch.sku.trim() !== ""
        ? formWatch.sku.trim().toUpperCase()
        : `PP-${(formWatch.name || "WATCH").trim().toUpperCase().replace(/\s+/g, "-")}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Clean up empty images
      const cleanedImages = (formWatch.images || []).filter(img => img && img.trim() !== "");
      const primaryImage =
        cleanedImages[0] ||
        formWatch.imageUrl ||
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000";

      // Build a fully-typed WatchProduct object
      const baseData: WatchProduct = {
        id: "",                                       // will be overwritten below
        name: (formWatch.name || "").trim(),
        tagline: (formWatch.tagline || "").trim(),
        price: Number(formWatch.price) || 0,
        movement: formWatch.movement || "Automatic",
        caliber: (formWatch.caliber || derivedSku).trim(),
        caseMaterial: formWatch.caseMaterial || "Stainless Steel",
        strapMaterial: formWatch.strapMaterial || "Leather",
        strapDetails: (formWatch.strapDetails || "").trim(),
        waterResistance: formWatch.waterResistance || "30m (3 ATM)",
        dialColor: formWatch.dialColor || "Silver",
        caseDiameter: formWatch.caseDiameter || "40mm",
        thickness: formWatch.thickness || "11mm",
        powerReserve: formWatch.powerReserve || "2 Years (Battery)",
        jewels: Number(formWatch.jewels) || 0,
        imageUrl: primaryImage,
        localImage: "",                              // required field — always set
        sku: derivedSku,
        stock: Number(formWatch.stock) || 0,
        description: (formWatch.description || "").trim(),
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        // Optional extended specifications
        displayBrand: formWatch.displayBrand || "",
        gender: formWatch.gender || "",
        glassMaterial: formWatch.glassMaterial || "",
        strapColor: formWatch.strapColor || "",
        function: formWatch.function || "",
        lockMechanism: formWatch.lockMechanism || "",
        caseShape: formWatch.caseShape || "",
        caseLength: formWatch.caseLength || "",
        caseWidth: formWatch.caseWidth || "",
        images: cleanedImages.length > 0 ? cleanedImages : [primaryImage],
        style: formWatch.style || "Casual",
        isNewArrival: !!formWatch.isNewArrival,
        isSummerSale: !!formWatch.isSummerSale,
      };

      if (editingId) {
        // Update existing watch — preserve its original rating/reviews
        const updated = productsList.map(p => {
          if (p.id === editingId) {
            return {
              ...baseData,
              id: editingId,
              rating: p.rating,
              reviewsCount: p.reviewsCount,
              reviews: p.reviews,
            } as WatchProduct;
          }
          return p;
        });
        saveProductsToStorage(updated);
        setEditingId(null);
        alert(`✅ "${baseData.name}" updated successfully!`);
      } else {
        // Create new watch — derive id from SKU
        const newId = baseData.sku
          ? baseData.sku.trim().toLowerCase().replace(/\s+/g, "-")
          : baseData.name.toLowerCase().replace(/\s+/g, "-");

        // Check for duplicate id
        if (productsList.some(p => p.id === newId)) {
          const override = confirm(
            `A product with SKU "${baseData.sku}" already exists.\n\nClick OK to overwrite it, or Cancel to keep both.`
          );
          if (override) {
            const updated = productsList.map(p =>
              p.id === newId ? { ...baseData, id: newId } : p
            );
            saveProductsToStorage(updated);
            alert(`✅ "${baseData.name}" overwritten in the vault!`);
          } else {
            // Add with a unique suffix
            const uniqueId = `${newId}-${Date.now()}`;
            saveProductsToStorage([...productsList, { ...baseData, id: uniqueId }]);
            alert(`✅ "${baseData.name}" added to the vault!`);
          }
        } else {
          saveProductsToStorage([...productsList, { ...baseData, id: newId }]);
          alert(`✅ "${baseData.name}" added to the vault!`);
        }
      }

      // Reset form to blank state
      setFormWatch({
        name: "",
        tagline: "",
        price: 0,
        movement: "Quartz",
        caliber: "",
        caseMaterial: "Metal",
        strapMaterial: "Leather",
        strapDetails: "",
        waterResistance: "30m (3 ATM)",
        dialColor: "Silver",
        caseDiameter: "44.80mm",
        thickness: "13.30mm",
        powerReserve: "2 Years (Battery)",
        jewels: 0,
        imageUrl: "",
        sku: "",
        stock: 1,
        description: "",
        displayBrand: "",
        gender: "Men",
        glassMaterial: "Mineral Glass",
        strapColor: "Brown",
        function: "Analog",
        lockMechanism: "Buckle",
        caseShape: "Round",
        caseLength: "",
        caseWidth: "",
        images: ["", "", "", "", "", ""],
        style: "Casual",
        isNewArrival: false,
        isSummerSale: false
      });
      setActiveTab("products");
    } catch (err) {
      console.error("Error adding/editing watch:", err);
      alert("❌ An error occurred while saving the watch. Please check the console for details.");
    }
  };

  const exportSampleCSV = () => {
    const headers = [
      "Name",
      "Tagline",
      "Price",
      "Movement",
      "Caliber",
      "Case Material",
      "Strap Type",
      "Strap Details",
      "Water Resistance",
      "Dial Color",
      "Case Diameter",
      "Thickness",
      "Power Reserve",
      "Jewels",
      "Image URL",
      "SKU",
      "Stock",
      "Description",
      "Display Brand",
      "Gender",
      "Glass Material",
      "Strap Color",
      "Function",
      "Lock Mechanism",
      "Case Shape",
      "Case Length",
      "Case Width",
      "Gallery Images",
      "Style",
      "Is New Arrival",
      "Is Summer Sale"
    ];
    
    const sampleRow1 = [
      "Fastrack Quartz Analog Silver Dial Leather Strap Watch for Guys",
      "Sleek and robust contemporary style",
      "3995",
      "Quartz",
      "NT3099SL01",
      "Metal",
      "Leather",
      "Brown leather strap with buckle lock",
      "30m (3 ATM)",
      "Silver",
      "44.80mm",
      "13.30mm",
      "2 Years (Battery)",
      "0",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000",
      "NT3099SL01",
      "15",
      "Beef up your look with this watch. The white dial with red accents gives the watch a robust look. The brown leather strap provides a sleek finish to the watch. Pair this timepiece with a fitted t-shirt and a pair of jeans and set out in pursuit of a hunky affair!",
      "Fastrack",
      "Guys",
      "Mineral Glass",
      "Brown",
      "Analog",
      "Buckle",
      "Round",
      "51.80 Mm",
      "44.80 Mm",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000;https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000;https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000",
      "Casual",
      "false",
      "false"
    ];

    const sampleRow2 = [
      "Chronos Horizon",
      "Classic elegance for the modern voyager",
      "420000",
      "Automatic",
      "Caliber PP-8921 (Self-winding)",
      "18K Gold",
      "Leather",
      "Hand-stitched brown Italian alligator leather",
      "50m (5 ATM)",
      "Opaline Cream",
      "40mm",
      "11.2mm",
      "68 Hours",
      "31",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000",
      "PP-CH-8921",
      "2",
      "The Chronos Horizon is our flagship model, combining a sweeping automatic movement with a solid 18K yellow gold case.",
      "Pixel & Parcel",
      "Guys",
      "Sapphire",
      "Brown",
      "Analog",
      "Clasp",
      "Round",
      "40mm",
      "40mm",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000",
      "Formal",
      "true",
      "true"
    ];
    
    const escapeCSV = (str: string) => {
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const csvContent = [
      headers.map(escapeCSV).join(","),
      sampleRow1.map(escapeCSV).join(","),
      sampleRow2.map(escapeCSV).join(",")
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "timepieces_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportActiveProductsCSV = () => {
    const headers = [
      "Name",
      "Tagline",
      "Price",
      "Movement",
      "Caliber",
      "Case Material",
      "Strap Type",
      "Strap Details",
      "Water Resistance",
      "Dial Color",
      "Case Diameter",
      "Thickness",
      "Power Reserve",
      "Jewels",
      "Image URL",
      "SKU",
      "Stock",
      "Description",
      "Display Brand",
      "Gender",
      "Glass Material",
      "Strap Color",
      "Function",
      "Lock Mechanism",
      "Case Shape",
      "Case Length",
      "Case Width",
      "Gallery Images",
      "Style",
      "Is New Arrival",
      "Is Summer Sale"
    ];

    const escapeCSV = (val: any) => {
      const str = val === undefined || val === null ? "" : String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = productsList.map(p => [
      p.name || "",
      p.tagline || "",
      p.price || 0,
      p.movement || "",
      p.caliber || "",
      p.caseMaterial || "",
      p.strapMaterial || "",
      p.strapDetails || "",
      p.waterResistance || "",
      p.dialColor || "",
      p.caseDiameter || "",
      p.thickness || "",
      p.powerReserve || "",
      p.jewels || 0,
      p.imageUrl || "",
      p.sku || "",
      p.stock || 0,
      p.description || "",
      p.displayBrand || "",
      p.gender || "",
      p.glassMaterial || "",
      p.strapColor || "",
      p.function || "",
      p.lockMechanism || "",
      p.caseShape || "",
      p.caseLength || "",
      p.caseWidth || "",
      (p.images || []).join(";"),
      p.style || "",
      p.isNewArrival ? "true" : "false",
      p.isSummerSale ? "true" : "false"
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "timepieces_catalog.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text: string) => {
    const lines: string[][] = [];
    const cleanText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    let i = 0;
    const len = cleanText.length;

    while (i < len) {
      const row: string[] = [];
      
      // Parse a row
      while (i < len) {
        // Skip leading whitespace before field
        while (i < len && (cleanText[i] === ' ' || cleanText[i] === '\t')) {
          i++;
        }
        
        let field = "";
        if (i < len && (cleanText[i] === '"' || cleanText[i] === '“' || cleanText[i] === '”')) {
          // Quoted field (supporting standard and smart quotes)
          const quoteChar = cleanText[i];
          i++; // skip opening quote
          while (i < len) {
            const c = cleanText[i];
            if (c === quoteChar) {
              if (i + 1 < len && cleanText[i + 1] === quoteChar) {
                // Escaped quote
                field += quoteChar;
                i += 2;
              } else {
                // Lookahead check: true closing quote if followed by delimiter, newline, or EOF
                let lookAheadIdx = i + 1;
                while (lookAheadIdx < len && (cleanText[lookAheadIdx] === ' ' || cleanText[lookAheadIdx] === '\t')) {
                  lookAheadIdx++;
                }
                const nextChar = lookAheadIdx < len ? cleanText[lookAheadIdx] : '\n';
                if (nextChar === ',' || nextChar === '\n') {
                  i = lookAheadIdx; // skip past quote and any whitespace
                  break;
                } else {
                  // Treat as literal quote inside the field
                  field += quoteChar;
                  i++;
                }
              }
            } else {
              field += c;
              i++;
            }
          }
          // After closing quote, skip until comma or newline (handles trailing characters safely)
          while (i < len && cleanText[i] !== ',' && cleanText[i] !== '\n') {
            i++;
          }
        } else {
          // Unquoted field
          while (i < len && cleanText[i] !== ',' && cleanText[i] !== '\n') {
            field += cleanText[i];
            i++;
          }
        }
        
        row.push(field);
        
        if (i < len && cleanText[i] === ',') {
          i++; // skip comma
          if (i === len || cleanText[i] === '\n') {
            row.push("");
          }
        } else if (i < len && cleanText[i] === '\n') {
          i++; // skip newline
          break; // end of row
        }
      }
      lines.push(row);
    }
    
    // Clean up empty lines at the end
    while (lines.length > 0) {
      const last = lines[lines.length - 1];
      if (last.length === 0 || (last.length === 1 && last[0].trim() === "")) {
        lines.pop();
      } else {
        break;
      }
    }
    
    return lines;
  };

  const importCSV = (fileText: string) => {
    try {
      const rows = parseCSV(fileText);
      if (rows.length < 2) {
        alert("CSV file is empty or has no data rows.");
        return;
      }
      const csvHeaders = rows[0].map(h => h.trim().toLowerCase());

      const newProducts: WatchProduct[] = [];
      const skippedRows: { rowNum: number; reason: string; rowData: string[] }[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        // Skip completely empty rows
        if (row.length === 0 || (row.length === 1 && row[0].trim() === "")) continue;

        const watch: Partial<WatchProduct> = {};
        const galleryUrls: string[] = [];
        let primaryImg: string = "";

        csvHeaders.forEach((header, index) => {
          const val = (row[index] || "").trim();
          if (!val) return;

          switch (header) {
            case "name": watch.name = val; break;
            case "tagline": watch.tagline = val; break;
            case "price": watch.price = Number(val) || 0; break;
            case "movement": watch.movement = val; break;
            case "caliber": watch.caliber = val; break;
            case "case material": watch.caseMaterial = val; break;
            case "strap type": watch.strapMaterial = val; break;
            case "strap detail":
            case "strap details": watch.strapDetails = val; break;
            case "water resistance": watch.waterResistance = val; break;
            case "dial color": watch.dialColor = val; break;
            case "case diameter": watch.caseDiameter = val; break;
            case "thickness": watch.thickness = val; break;
            case "power reserve": watch.powerReserve = val; break;
            case "jewels": watch.jewels = Number(val) || 0; break;
            case "primary image url":
            case "image url":
              watch.imageUrl = val;
              primaryImg = val;
              break;
            case "image url-2":
            case "image url-3":
            case "image url-4":
            case "image url-5":
              galleryUrls.push(val);
              break;
            case "id":
            case "sku":
              watch.sku = val;
              break;
            case "stock": watch.stock = Number(val) || 0; break;
            case "description": watch.description = val; break;
            case "display brand": watch.displayBrand = val; break;
            case "gender": watch.gender = val; break;
            case "glass material": watch.glassMaterial = val; break;
            case "strap color": watch.strapColor = val; break;
            case "function": watch.function = val; break;
            case "lock mechanism": watch.lockMechanism = val; break;
            case "case shape": watch.caseShape = val; break;
            case "case length": watch.caseLength = val; break;
            case "case width": watch.caseWidth = val; break;
            case "gallery images":
              watch.images = val.split(";").map(img => img.trim()).filter(img => img !== "");
              break;
            case "style": watch.style = val; break;
            case "is new arrival": watch.isNewArrival = val.toLowerCase() === "true" || val === "1"; break;
            case "is summer sale": watch.isSummerSale = val.toLowerCase() === "true" || val === "1"; break;
          }
        });

        // Resolve images list from all available columns/fields
        const collectedImages: string[] = [];
        if (primaryImg) {
          collectedImages.push(primaryImg);
        }

        // Add images from the "gallery images" semicolon-separated field if any
        if (watch.images) {
          watch.images.forEach(img => {
            if (img && !collectedImages.includes(img)) {
              collectedImages.push(img);
            }
          });
        }

        // Add images from the individual "image url-2", "image url-3", etc. columns if any
        galleryUrls.forEach(url => {
          if (url && !collectedImages.includes(url)) {
            collectedImages.push(url);
          }
        });

        // If primary image is blank, default to the first image found in gallery
        if (!primaryImg && collectedImages.length > 0) {
          primaryImg = collectedImages[0];
          watch.imageUrl = primaryImg;
        }

        watch.images = collectedImages;

        if (!watch.name || watch.name.trim() === "") {
          skippedRows.push({ rowNum: i + 1, reason: "Product Name is missing or empty", rowData: row });
          continue;
        }

        const isValidUrl = (url: any) => {
          if (typeof url !== "string") return false;
          const u = url.trim();
          return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/");
        };

        const fallbackImageUrl = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000";
        let resolvedImageUrl = watch.imageUrl && watch.imageUrl.trim() !== "" ? watch.imageUrl.trim() : "";

        // Validate the main image URL; if invalid, attempt fallback to gallery or default
        if (resolvedImageUrl && !isValidUrl(resolvedImageUrl)) {
          let firstValidGallery = "";
          if (watch.images) {
            const found = watch.images.find(img => isValidUrl(img));
            if (found) firstValidGallery = found;
          }

          skippedRows.push({
            rowNum: i + 1,
            reason: `Invalid main image URL discarded ("${resolvedImageUrl.substring(0, 30)}...")`,
            rowData: row
          });

          resolvedImageUrl = firstValidGallery;
        }

        if (!resolvedImageUrl) {
          resolvedImageUrl = fallbackImageUrl;
        }

        // Validate gallery images
        let resolvedImages = (watch.images || []).filter(img => isValidUrl(img));
        if (resolvedImages.length === 0) {
          resolvedImages = [resolvedImageUrl];
        } else if (!resolvedImages.includes(resolvedImageUrl) && resolvedImageUrl !== fallbackImageUrl) {
          resolvedImages.unshift(resolvedImageUrl);
        }

        const newId = watch.sku
          ? watch.sku.trim().toLowerCase().replace(/\s+/g, "-")
          : (watch.name || "temp").toLowerCase().replace(/\s+/g, "-");

        const finalWatch: WatchProduct = {
          id: newId,
          name: (watch.name || "").trim(),
          tagline: (watch.tagline || "").trim(),
          price: watch.price || 0,
          movement: watch.movement || "Quartz",
          caliber: (watch.caliber || watch.sku || "Unknown").trim(),
          caseMaterial: watch.caseMaterial || "Metal",
          strapMaterial: watch.strapMaterial || "Leather",
          strapDetails: (watch.strapDetails || "").trim(),
          waterResistance: watch.waterResistance || "30m (3 ATM)",
          dialColor: watch.dialColor || "Silver",
          caseDiameter: watch.caseDiameter || "40mm",
          thickness: watch.thickness || "11mm",
          powerReserve: watch.powerReserve || "2 Years (Battery)",
          jewels: Number(watch.jewels) || 0,
          imageUrl: resolvedImageUrl,
          localImage: "",
          sku: (watch.sku || "").trim().toUpperCase(),
          stock: Number(watch.stock) || 0,
          description: (watch.description || "").trim(),
          displayBrand: watch.displayBrand || "",
          gender: watch.gender || "",
          glassMaterial: watch.glassMaterial || "",
          strapColor: watch.strapColor || "",
          function: watch.function || "",
          lockMechanism: watch.lockMechanism || "",
          caseShape: watch.caseShape || "",
          caseLength: watch.caseLength || "",
          caseWidth: watch.caseWidth || "",
          images: resolvedImages,
          rating: 5.0,
          reviewsCount: 0,
          reviews: [],
          style: watch.style || "Casual",
          isNewArrival: !!watch.isNewArrival,
          isSummerSale: !!watch.isSummerSale,
        };

        newProducts.push(finalWatch);
      }

      if (newProducts.length > 0) {
        const merged = [...productsList];
        newProducts.forEach(newP => {
          const idx = merged.findIndex(p => p.id === newP.id);
          if (idx > -1) {
            merged[idx] = newP; // overwrite existing with same SKU/id
          } else {
            merged.push(newP);
          }
        });
        saveProductsToStorage(merged);
        
        let msg = `✅ Successfully imported ${newProducts.length} product(s) into the catalog!`;
        if (skippedRows.length > 0) {
          msg += `\n\n⚠️ Note: ${skippedRows.length} row(s) were skipped:`;
          skippedRows.forEach(sr => {
            msg += `\n- Row ${sr.rowNum}: ${sr.reason} (First values: ${sr.rowData.slice(0, 3).join(", ")})`;
          });
        }
        alert(msg);
        setActiveTab("products"); // show the updated inventory immediately
      } else {
        let msg = "⚠️ No valid products found in the CSV. Make sure the 'Name' column is filled.";
        if (skippedRows.length > 0) {
          msg += `\n\nSkipped Row Details:`;
          skippedRows.forEach(sr => {
            msg += `\n- Row ${sr.rowNum}: ${sr.reason}`;
          });
        }
        alert(msg);
      }
    } catch (error) {
      console.error("CSV import error:", error);
      alert("❌ Error parsing CSV file. Please check the format and try again.");
    }
  };

  const handleEditClick = (watch: WatchProduct) => {
    setEditingId(watch.id);
    const watchImages = watch.images && watch.images.length > 0
      ? [...watch.images, ...Array(6).fill("")].slice(0, 6)
      : [watch.imageUrl, ...Array(5).fill("")];
    setFormWatch({
      ...watch,
      images: watchImages
    });
    setActiveTab("addProduct");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to retire this timepiece from the active catalog?")) {
      const filtered = productsList.filter(p => p.id !== id);
      saveProductsToStorage(filtered);
      setSelectedProductIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === productsList.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(productsList.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    if (confirm(`Are you sure you want to retire the ${count} selected timepiece(s) from the active catalog?`)) {
      const filtered = productsList.filter(p => !selectedProductIds.includes(p.id));
      saveProductsToStorage(filtered);
      setSelectedProductIds([]);
      alert(`✅ Successfully removed ${count} timepiece(s) from the catalog.`);
    }
  };

  const handleDeleteAllProducts = () => {
    if (confirm("⚠️ WARNING: This will permanently delete ALL products in the catalog! This action cannot be undone.\n\nAre you sure you want to proceed?")) {
      const confirmationText = prompt("Type 'DELETE ALL' to confirm:");
      if (confirmationText === "DELETE ALL") {
        saveProductsToStorage([]);
        setSelectedProductIds([]);
        alert("✅ All products have been retired from the catalog.");
      } else {
        alert("❌ Deletion cancelled. Confirmation code was incorrect.");
      }
    }
  };

  const handleBulkExport = () => {
    if (selectedProductIds.length === 0) return;
    
    const headers = [
      "Name",
      "Tagline",
      "Price",
      "Movement",
      "Caliber",
      "Case Material",
      "Strap Type",
      "Strap Details",
      "Water Resistance",
      "Dial Color",
      "Case Diameter",
      "Thickness",
      "Power Reserve",
      "Jewels",
      "Image URL",
      "SKU",
      "Stock",
      "Description",
      "Display Brand",
      "Gender",
      "Glass Material",
      "Strap Color",
      "Function",
      "Lock Mechanism",
      "Case Shape",
      "Case Length",
      "Case Width",
      "Gallery Images",
      "Style",
      "Is New Arrival",
      "Is Summer Sale"
    ];

    const escapeCSV = (val: any) => {
      const str = val === undefined || val === null ? "" : String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const selectedProducts = productsList.filter(p => selectedProductIds.includes(p.id));
    const rows = selectedProducts.map(p => [
      p.name || "",
      p.tagline || "",
      p.price || 0,
      p.movement || "",
      p.caliber || "",
      p.caseMaterial || "",
      p.strapMaterial || "",
      p.strapDetails || "",
      p.waterResistance || "",
      p.dialColor || "",
      p.caseDiameter || "",
      p.thickness || "",
      p.powerReserve || "",
      p.jewels || 0,
      p.imageUrl || "",
      p.sku || "",
      p.stock || 0,
      p.description || "",
      p.displayBrand || "",
      p.gender || "",
      p.glassMaterial || "",
      p.strapColor || "",
      p.function || "",
      p.lockMechanism || "",
      p.caseShape || "",
      p.caseLength || "",
      p.caseWidth || "",
      (p.images || []).join(";"),
      p.style || "",
      p.isNewArrival ? "true" : "false",
      p.isSummerSale ? "true" : "false"
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `timepieces_selected_export_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updated);
    localStorage.setItem("pp_orders", JSON.stringify(updated));
  };

  // Calculations
  const grossRevenue = orders
    .filter(o => o.status !== "Processing")
    .reduce((sum, o) => sum + o.total, 0) + 1285000; // Adding historical base revenue

  const pendingCalibrations = orders.filter(o => o.status === "Calibrating" || o.status === "Processing").length;

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-[#0E0E0E] border border-zinc-900 rounded-lg shadow-2xl space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8C7853] block">Admin Security</span>
          <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Admin Login</h2>
          <p className="text-xs text-zinc-555">Enter credentials to access the admin panel</p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs text-center rounded animate-shake">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Username</label>
            <input 
              type="text" 
              required
              placeholder="e.g. 8651576301"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3.5 py-3 rounded focus:outline-none focus:border-primary-gold font-mono text-center tracking-widest"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3.5 py-3 rounded focus:outline-none focus:border-primary-gold text-center tracking-widest"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-primary-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-widest transition-colors rounded shadow-lg shadow-primary-gold/5"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow space-y-8 sm:space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wider uppercase">Merchant Dashboard</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8C7853]">Manage product catalog and order list</p>
        </div>

        {/* Tab Controls — scrollable on mobile */}
        <div className="flex overflow-x-auto scrollbar-none gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-zinc-950 p-1.5 border border-zinc-900 rounded w-full sm:w-fit">
          <button 
            onClick={() => setActiveTab("stats")} 
            className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === "stats" ? "bg-primary-gold text-black" : "text-zinc-550 hover:text-white"
            }`}
          >
            Metrics
          </button>
          <button 
            onClick={() => setActiveTab("products")} 
            className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === "products" ? "bg-primary-gold text-black" : "text-zinc-550 hover:text-white"
            }`}
          >
            Product
          </button>
          <button 
            onClick={() => setActiveTab("addProduct")} 
            className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === "addProduct" ? "bg-primary-gold text-black" : "text-zinc-550 hover:text-white"
            }`}
          >
            Add Product
          </button>
          <button 
            onClick={() => setActiveTab("orders")} 
            className={`px-3 sm:px-4 py-2 rounded transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === "orders" ? "bg-primary-gold text-black" : "text-zinc-550 hover:text-white"
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* 1. METRICS DASHBOARD TAB */}
      {activeTab === "stats" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1 */}
            <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Gross Revenue</span>
                <span className="text-xl font-bold text-white">₹{grossRevenue.toLocaleString("en-IN")}</span>
              </div>
              <div className="bg-primary-gold/10 p-3 rounded-full border border-primary-gold/20 text-primary-gold">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Total Sales</span>
                <span className="text-xl font-bold text-white">{orders.length + 14} orders</span>
              </div>
              <div className="bg-primary-gold/10 p-3 rounded-full border border-primary-gold/20 text-primary-gold">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Pending Orders</span>
                <span className="text-xl font-bold text-white">{pendingCalibrations} active</span>
              </div>
              <div className="bg-primary-gold/10 p-3 rounded-full border border-primary-gold/20 text-primary-gold">
                <RefreshCw className="h-5 w-5 animate-spin-slow" />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Low Stock Warning</span>
                <span className="text-xl font-bold text-red-400">
                  {productsList.filter(p => p.stock <= 2).length} Models
                </span>
              </div>
              <div className="bg-red-500/10 p-3 rounded-full border border-red-500/20 text-red-400">
                <BarChart2 className="h-5 w-5" />
              </div>
            </div>

          </div>

          {/* Quick Analytics overview */}
          <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-serif text-white tracking-wide">Dashboard Information</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              This dashboard operates in simulation mode. Live order records from the sandbox Razorpay payments are saved to local storage database memory.
            </p>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS CATALOG TAB */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
            <div>
              <h3 className="text-lg font-serif text-white tracking-wide">Product Inventory</h3>
              <p className="text-[11px] text-zinc-500 font-light mt-0.5">Manage, edit, or bulk export/delete active products</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total: {productsList.length} Models</span>
              {productsList.length > 0 && (
                <button
                  onClick={handleDeleteAllProducts}
                  className="px-3 py-1.5 bg-red-950/20 border border-red-900/30 hover:bg-red-900/40 hover:border-red-900 text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded"
                >
                  Delete All Products
                </button>
              )}
            </div>
          </div>

          {/* BULK ACTION BAR */}
          {selectedProductIds.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0E0E0E] border border-primary-gold/30 p-4 rounded-lg gap-4 animate-fade-in shadow-md">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary-gold animate-pulse"></span>
                <span className="text-xs text-zinc-300 font-medium">
                  <strong className="text-white">{selectedProductIds.length}</strong> product(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSelectedProductIds([])}
                  className="px-3.5 py-1.5 border border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkExport}
                  className="px-3.5 py-1.5 bg-primary-gold hover:bg-gold-light text-black text-[10px] font-bold uppercase tracking-widest transition-colors rounded flex items-center gap-1.5 shadow-sm"
                >
                  Export Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded shadow-sm"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#0E0E0E] border border-zinc-900 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[768px] text-xs text-[#F5F5F7]">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-900 text-left text-[9px] uppercase font-bold text-zinc-550 tracking-wider">
                  <th className="p-4 text-center w-12">
                    <input 
                      type="checkbox"
                      checked={productsList.length > 0 && selectedProductIds.length === productsList.length}
                      onChange={handleSelectAll}
                      className="rounded border-zinc-800 accent-primary-gold bg-black cursor-pointer scale-110"
                    />
                  </th>
                  <th className="p-4 text-center w-12">S.No.</th>
                  <th className="p-4">Watch / Brand</th>
                  <th className="p-4">SKU / Caliber</th>
                  <th className="p-4">Specifications</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status & Stock</th>
                  <th className="p-4 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {productsList.map((prod, index) => {
                  const isSelected = selectedProductIds.includes(prod.id);
                  const isLowStock = prod.stock <= 2 && prod.stock > 0;
                  const isOutOfStock = prod.stock === 0;
                  
                  return (
                    <tr 
                      key={prod.id} 
                      className={`transition-colors duration-250 ${
                        isSelected 
                          ? "bg-primary-gold/[0.02] hover:bg-primary-gold/[0.04]" 
                          : "hover:bg-zinc-950/40"
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(prod.id)}
                          className="rounded border-zinc-800 accent-primary-gold bg-black cursor-pointer scale-110"
                        />
                      </td>
                      <td className="p-4 text-center font-mono text-zinc-550">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 relative overflow-hidden rounded border border-zinc-900 flex-shrink-0 bg-zinc-950">
                            <Image 
                              src={prod.imageUrl} 
                              alt={prod.name} 
                              fill 
                              className="object-cover" 
                              sizes="40px"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-serif text-white text-sm font-semibold block leading-tight">{prod.name}</span>
                            <span className="text-[10px] text-primary-gold/80 font-mono tracking-wider block">
                              {prod.displayBrand || "Pixel & Parcel"} • {prod.style || "Casual"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-zinc-500">
                        <span className="text-zinc-400 block">{prod.sku}</span>
                        <span className="text-zinc-600 block text-[9px] truncate max-w-[120px]">{prod.caliber || "N/A"}</span>
                      </td>
                      <td className="p-4 text-zinc-450 leading-relaxed space-y-0.5">
                        <p>{prod.movement} ({prod.jewels || 0} Jewels)</p>
                        <p className="text-[10px] text-zinc-550">
                          {prod.dialColor} • {prod.caseDiameter} • {prod.thickness}
                        </p>
                      </td>
                      <td className="p-4 text-primary-gold font-bold text-sm">
                        ₹{prod.price.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 bg-red-950/20 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wider rounded w-fit">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 bg-amber-950/20 border border-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider rounded w-fit">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider rounded w-fit">
                              In Stock
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500 pl-1">
                            {prod.stock} piece(s) available
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2.5 justify-center">
                          <button 
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-primary-gold hover:border-primary-gold/30 rounded transition-all duration-200"
                            title="Edit product"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-red-400 hover:border-red-950 rounded transition-all duration-200"
                            title="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2.5. ADD/EDIT PRODUCT TAB */}
      {activeTab === "addProduct" && (
        <div className="max-w-2xl mx-auto bg-[#0E0E0E] border border-zinc-900 p-6 md:p-8 rounded-lg space-y-6 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
            <h3 className="text-lg font-serif text-white tracking-wide">
              {editingId ? "Edit Product Specs" : "Add Product"}
            </h3>
          </div>

          {/* CSV Import/Export Section */}
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded space-y-3">
            <span className="text-[10px] uppercase font-bold text-primary-gold block tracking-wider font-mono">CSV Import / Export</span>
            <p className="text-[11px] text-zinc-555 font-light leading-relaxed">
              Manage product inventory using CSV sheets. Export the template, edit the file, and upload it to import products.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button 
                type="button"
                onClick={exportSampleCSV}
                className="px-4 py-2 border border-zinc-800 hover:border-primary-gold text-zinc-400 hover:text-primary-gold text-[10px] font-bold uppercase tracking-widest transition-colors rounded"
              >
                Export CSV Template
              </button>
              <button 
                type="button"
                onClick={exportActiveProductsCSV}
                className="px-4 py-2 border border-zinc-800 hover:border-primary-gold text-zinc-400 hover:text-primary-gold text-[10px] font-bold uppercase tracking-widest transition-colors rounded"
              >
                Export Active Catalog
              </button>
              <label className="px-4 py-2 bg-primary-gold hover:bg-gold-light text-black text-[10px] font-bold uppercase tracking-widest transition-colors rounded cursor-pointer text-center select-none">
                Import CSV File
                <input 
                  type="file" 
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const buffer = event.target?.result as ArrayBuffer;
                        if (buffer) {
                          const bytes = new Uint8Array(buffer);
                          let text = "";
                          try {
                            const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
                            text = utf8Decoder.decode(bytes);
                          } catch (err) {
                            // Fallback to Windows-1252 (standard Excel ANSI encoding) to preserve em-dashes and smart quotes
                            const winDecoder = new TextDecoder("windows-1252");
                            text = winDecoder.decode(bytes);
                          }
                          if (text) {
                            importCSV(text);
                          }
                        }
                      };
                      reader.readAsArrayBuffer(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleAddOrEditWatch} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-500 block">Watch Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formWatch.name || ""}
                onChange={handleInputChange}
                className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-500 block">Tagline</label>
              <input 
                type="text" 
                name="tagline"
                value={formWatch.tagline || ""}
                onChange={handleInputChange}
                className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Price (INR)</label>
                <input 
                  type="number" 
                  name="price"
                  required
                  value={formWatch.price !== undefined ? formWatch.price : ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Stock Qty</label>
                <input 
                  type="number" 
                  name="stock"
                  required
                  value={formWatch.stock !== undefined ? formWatch.stock : ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Movement</label>
                <select 
                  name="movement"
                  value={formWatch.movement || "Automatic"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Quartz">Quartz</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Case Material</label>
                <select 
                  name="caseMaterial"
                  value={formWatch.caseMaterial || "Stainless Steel"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                >
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Titanium">Titanium</option>
                  <option value="18K Gold">18K Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Metal">Metal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Strap Type</label>
                <select 
                  name="strapMaterial"
                  value={formWatch.strapMaterial || "Leather"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                >
                  <option value="Leather">Leather</option>
                  <option value="Metal">Metal</option>
                  <option value="Rubber">Rubber</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Strap Detail</label>
                <input 
                  type="text" 
                  name="strapDetails"
                  placeholder="e.g. Brown leather strap with buckle lock"
                  value={formWatch.strapDetails || ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Caliber Signature <span className="text-zinc-600 normal-case font-normal">(optional — uses SKU if blank)</span></label>
                <input 
                  type="text" 
                  name="caliber"
                  placeholder="e.g. NT3099SL01 or Caliber PP-8921"
                  value={formWatch.caliber || ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">SKU Code <span className="text-zinc-600 normal-case font-normal">(optional — auto-generated if blank)</span></label>
                <input 
                  type="text" 
                  name="sku"
                  value={formWatch.sku || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. PP-CH-8921"
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Dial Color</label>
                <select 
                  name="dialColor"
                  value={formWatch.dialColor || "Onyx Black"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                >
                  <option value="Onyx Black">Onyx Black</option>
                  <option value="Silver">Silver</option>
                  <option value="Opaline Cream">Opaline Cream</option>
                  <option value="Skeleton Matte Grey">Skeleton Matte Grey</option>
                  <option value="Emerald Green">Emerald Green</option>
                  <option value="Stealth Black">Stealth Black</option>
                  <option value="Midnight Aventurine">Midnight Aventurine</option>
                  <option value="Abyssal Blue">Abyssal Blue</option>
                  <option value="Rhodium Openwork">Rhodium Openwork</option>
                  <option value="Slate Grey">Slate Grey</option>
                  <option value="White">White</option>
                  <option value="Gold">Gold</option>
                  <option value="Blue">Blue</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Water Resistance</label>
                <select 
                  name="waterResistance"
                  value={formWatch.waterResistance || "100m (10 ATM)"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                >
                  <option value="30m (3 ATM)">30m (3 ATM)</option>
                  <option value="50m (5 ATM)">50m (5 ATM)</option>
                  <option value="100m (10 ATM)">100m (10 ATM)</option>
                  <option value="200m (20 ATM)">200m (20 ATM)</option>
                  <option value="300m (30 ATM)">300m (30 ATM)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Case Diameter</label>
                <select 
                  name="caseDiameter"
                  value={formWatch.caseDiameter || "40mm"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono"
                >
                  <option value="38.5mm">38.5mm</option>
                  <option value="39mm">39mm</option>
                  <option value="40mm">40mm</option>
                  <option value="41mm">41mm</option>
                  <option value="42mm">42mm</option>
                  <option value="43mm">43mm</option>
                  <option value="44.80mm">44.80mm</option>
                  <option value="45mm">45mm</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Thickness</label>
                <select 
                  name="thickness"
                  value={formWatch.thickness || "11mm"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono"
                >
                  <option value="9.8mm">9.8mm</option>
                  <option value="10.5mm">10.5mm</option>
                  <option value="10.8mm">10.8mm</option>
                  <option value="11mm">11mm</option>
                  <option value="11.2mm">11.2mm</option>
                  <option value="11.8mm">11.8mm</option>
                  <option value="12.0mm">12.0mm</option>
                  <option value="12.5mm">12.5mm</option>
                  <option value="13.2mm">13.2mm</option>
                  <option value="13.30mm">13.30mm</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Power Reserve</label>
                <select 
                  name="powerReserve"
                  value={formWatch.powerReserve || "48 Hours"}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                >
                  <option value="2 Years (Battery)">2 Years (Battery)</option>
                  <option value="3 Year Battery Life">3 Year Battery Life</option>
                  <option value="48 Hours">48 Hours</option>
                  <option value="50 Hours">50 Hours</option>
                  <option value="60 Hours">60 Hours</option>
                  <option value="65 Hours">65 Hours</option>
                  <option value="68 Hours">68 Hours</option>
                  <option value="70 Hours">70 Hours</option>
                  <option value="72 Hours">72 Hours</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Jewels Count</label>
                <select 
                  name="jewels"
                  value={formWatch.jewels !== undefined ? formWatch.jewels : 25}
                  onChange={handleInputChange}
                  className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono"
                >
                  <option value="0">0 jewels (Quartz)</option>
                  <option value="7">7 jewels</option>
                  <option value="25">25 jewels</option>
                  <option value="26">26 jewels</option>
                  <option value="28">28 jewels</option>
                  <option value="29">29 jewels</option>
                  <option value="31">31 jewels</option>
                  <option value="35">35 jewels</option>
                  <option value="38">38 jewels</option>
                </select>
              </div>
            </div>

            {/* Custom Technical Specifications */}
            <div className="border-t border-zinc-900 pt-4 mt-2 space-y-4">
              <span className="text-[10px] uppercase font-bold text-primary-gold block tracking-wider">Custom Specifications</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 block">Display Brand</label>
                  <select 
                    name="displayBrand"
                    value={formWatch.displayBrand || "Pixel & Parcel"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Pixel & Parcel">Pixel & Parcel</option>
                    <option value="Fastrack">Fastrack</option>
                    <option value="Rolex">Rolex</option>
                    <option value="Omega">Omega</option>
                    <option value="Seiko">Seiko</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Casio">Casio</option>
                    <option value="Tissot">Tissot</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 block">Show in Sections (Select Multiple)</label>
                  <div className="flex items-center gap-4 pt-2.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isGenderChecked("Men")}
                        onChange={(e) => handleGenderCheckboxChange("Men", e.target.checked)}
                        className="rounded border-zinc-800 accent-primary-gold bg-black scale-110"
                      />
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Men</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isGenderChecked("Women")}
                        onChange={(e) => handleGenderCheckboxChange("Women", e.target.checked)}
                        className="rounded border-zinc-800 accent-primary-gold bg-black scale-110"
                      />
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Women</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isGenderChecked("Kids")}
                        onChange={(e) => handleGenderCheckboxChange("Kids", e.target.checked)}
                        className="rounded border-zinc-800 accent-primary-gold bg-black scale-110"
                      />
                      <span className="text-[10px] font-bold uppercase text-zinc-400">Kids</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 block">Watch Style / Category</label>
                  <select 
                    name="style"
                    value={formWatch.style || "Casual"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Casual">Casual Watches</option>
                    <option value="Formal">Formal Watches</option>
                    <option value="Digital">Digital Watches</option>
                    <option value="Smart">Smart Watches</option>
                  </select>
                </div>
                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      name="isNewArrival"
                      checked={!!formWatch.isNewArrival}
                      onChange={(e) => {
                        setFormWatch({
                          ...formWatch,
                          isNewArrival: e.target.checked
                        });
                      }}
                      className="rounded border-zinc-850 accent-primary-gold bg-black scale-110"
                    />
                    <span className="text-[10px] font-bold uppercase text-zinc-400">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      name="isSummerSale"
                      checked={!!formWatch.isSummerSale}
                      onChange={(e) => {
                        setFormWatch({
                          ...formWatch,
                          isSummerSale: e.target.checked
                        });
                      }}
                      className="rounded border-zinc-850 accent-primary-gold bg-black scale-110"
                    />
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Summer Sale</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 block">Glass Material</label>
                  <select 
                    name="glassMaterial"
                    value={formWatch.glassMaterial || "Sapphire"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Sapphire">Sapphire</option>
                    <option value="Mineral Glass">Mineral Glass</option>
                    <option value="Acrylic">Acrylic</option>
                    <option value="Hardlex">Hardlex</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 block">Strap Color</label>
                  <select 
                    name="strapColor"
                    value={formWatch.strapColor || "Black"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Black">Black</option>
                    <option value="Brown">Brown</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Grey">Grey</option>
                    <option value="White">White</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-550 block">Function Type</label>
                  <select 
                    name="function"
                    value={formWatch.function || "Analog"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Analog">Analog</option>
                    <option value="Chronograph">Chronograph</option>
                    <option value="GMT">GMT</option>
                    <option value="Digital">Digital</option>
                    <option value="Smart">Smart</option>
                    <option value="Analog-Digital">Analog-Digital</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-550 block">Lock Mechanism</label>
                  <select 
                    name="lockMechanism"
                    value={formWatch.lockMechanism || "Clasp"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Clasp">Clasp</option>
                    <option value="Buckle">Buckle</option>
                    <option value="Folding Clasp">Folding Clasp</option>
                    <option value="Butterfly Clasp">Butterfly Clasp</option>
                    <option value="Deployment Clasp">Deployment Clasp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-555 block">Case Shape</label>
                  <select 
                    name="caseShape"
                    value={formWatch.caseShape || "Round"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Round">Round</option>
                    <option value="Square">Square</option>
                    <option value="Rectangular">Rectangular</option>
                    <option value="Tonneau">Tonneau</option>
                    <option value="Oval">Oval</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-555 block">Case Length</label>
                  <select 
                    name="caseLength"
                    value={formWatch.caseLength || "40mm"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono"
                  >
                    <option value="38.5mm">38.5mm</option>
                    <option value="39mm">39mm</option>
                    <option value="40mm">40mm</option>
                    <option value="41mm">41mm</option>
                    <option value="42mm">42mm</option>
                    <option value="43mm">43mm</option>
                    <option value="44.80mm">44.80mm</option>
                    <option value="45mm">45mm</option>
                    <option value="50mm">50mm</option>
                    <option value="51.80 Mm">51.80 Mm</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-555 block">Case Width</label>
                  <select 
                    name="caseWidth"
                    value={formWatch.caseWidth || "40mm"}
                    onChange={handleInputChange}
                    className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono"
                  >
                    <option value="38.5mm">38.5mm</option>
                    <option value="39mm">39mm</option>
                    <option value="40mm">40mm</option>
                    <option value="41mm">41mm</option>
                    <option value="42mm">42mm</option>
                    <option value="43mm">43mm</option>
                    <option value="44.80mm">44.80mm</option>
                    <option value="45mm">45mm</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Multi-angle Gallery Images */}
            <div className="border-t border-zinc-900 pt-4 mt-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-primary-gold block tracking-wider">Multi-Angle Image Gallery (5-6 URLs)</span>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[8px] uppercase font-bold text-zinc-650 block">Gallery Image URL {i + 1} {i === 0 ? "(Primary)" : ""}</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        id={`file-upload-${i}`}
                        className="hidden"
                        disabled={uploadingIndex !== null}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setUploadingIndex(i);
                          const formData = new FormData();
                          formData.append("file", file);
                          
                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData
                            });
                            const data = await res.json();
                            if (data.url) {
                              handleImageChange(i, data.url);
                              alert("✅ Image uploaded to Cloudinary successfully!");
                            } else {
                              alert(`❌ Upload failed: ${data.error || "Unknown error"}`);
                            }
                          } catch (err: any) {
                            alert(`❌ Upload error: ${err.message}`);
                          } finally {
                            setUploadingIndex(null);
                          }
                        }}
                      />
                      <label 
                        htmlFor={`file-upload-${i}`}
                        className={`cursor-pointer text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all duration-300 ${
                          uploadingIndex === i
                            ? "bg-zinc-800 text-zinc-500 border border-zinc-700 animate-pulse cursor-not-allowed"
                            : "text-primary-gold border border-primary-gold/20 hover:border-primary-gold bg-primary-gold/5"
                        }`}
                      >
                        {uploadingIndex === i ? "Uploading..." : "Upload to Cloudinary"}
                      </label>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder={`e.g. https://images.unsplash.com/photo-...`}
                    value={(formWatch.images || [])[i] || ""}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    className="w-full bg-[#070707] border border-zinc-850 text-zinc-400 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono text-[10px]"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase font-bold text-zinc-500 block">Primary Photo URL <span className="text-zinc-600 normal-case font-normal">(auto-uses Gallery Image 1 if blank)</span></label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    id="file-upload-primary"
                    className="hidden"
                    disabled={uploadingPrimary}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      setUploadingPrimary(true);
                      const formData = new FormData();
                      formData.append("file", file);
                      
                      try {
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: formData
                        });
                        const data = await res.json();
                        if (data.url) {
                          setFormWatch({
                            ...formWatch,
                            imageUrl: data.url
                          });
                          alert("✅ Primary image uploaded to Cloudinary successfully!");
                        } else {
                          alert(`❌ Upload failed: ${data.error || "Unknown error"}`);
                        }
                      } catch (err: any) {
                        alert(`❌ Upload error: ${err.message}`);
                      } finally {
                        setUploadingPrimary(false);
                      }
                    }}
                  />
                  <label 
                    htmlFor="file-upload-primary"
                    className={`cursor-pointer text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all duration-300 ${
                      uploadingPrimary
                        ? "bg-zinc-800 text-zinc-500 border border-zinc-700 animate-pulse cursor-not-allowed"
                        : "text-primary-gold border border-primary-gold/20 hover:border-primary-gold bg-primary-gold/5"
                    }`}
                  >
                    {uploadingPrimary ? "Uploading..." : "Upload to Cloudinary"}
                  </label>
                </div>
              </div>
              <input 
                type="text" 
                name="imageUrl"
                placeholder="https://images.unsplash.com/photo-..."
                value={formWatch.imageUrl || ""}
                onChange={handleInputChange}
                className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-500 block">Product Narrative</label>
              <textarea 
                name="description"
                rows={3}
                placeholder="Describe the watch — style, look, feel, occasion..."
                value={formWatch.description || ""}
                onChange={handleInputChange}
                className="w-full bg-[#070707] border border-zinc-800 text-zinc-300 px-3 py-2 rounded focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormWatch({
                      name: "",
                      tagline: "",
                      price: 0,
                      movement: "Quartz",
                      caliber: "",
                      caseMaterial: "Metal",
                      strapMaterial: "Leather",
                      strapDetails: "",
                      waterResistance: "30m (3 ATM)",
                      dialColor: "Silver",
                      caseDiameter: "44.80mm",
                      thickness: "13.30mm",
                      powerReserve: "2 Years (Battery)",
                      jewels: 0,
                      imageUrl: "",
                      sku: "",
                      stock: 1,
                      description: "",
                      displayBrand: "",
                      gender: "Men",
                      glassMaterial: "Mineral Glass",
                      strapColor: "Brown",
                      function: "Analog",
                      lockMechanism: "Buckle",
                      caseShape: "Round",
                      caseLength: "",
                      caseWidth: "",
                      images: ["", "", "", "", "", ""]
                    });
                    setActiveTab("products");
                  }}
                  className="flex-1 py-2.5 border border-zinc-800 text-zinc-450 hover:text-white uppercase tracking-widest text-[10px] font-bold rounded"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="flex-grow-[1.5] py-2.5 bg-primary-gold hover:bg-gold-light text-black uppercase tracking-widest text-[10px] font-bold rounded shadow-md shadow-primary-gold/5"
              >
                {editingId ? "Save Specs" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. ORDERS LEDGER TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-serif text-white tracking-wide">Order History</h3>

          {orders.length === 0 ? (
            <div className="border border-dashed border-zinc-850 rounded-lg py-20 text-center text-zinc-500">
              No orders found in database.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-[#0E0E0E] border border-zinc-900 rounded-lg p-6 space-y-4">
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-3">
                    <div>
                      <p className="text-xs text-zinc-550 font-mono">Reference: <span className="text-white font-bold">{ord.id}</span></p>
                      <p className="text-[10px] text-zinc-600 font-mono">Timestamp: {new Date(ord.date).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Status</label>
                      <select 
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                        className={`bg-[#070707] border border-zinc-800 text-xs px-2 py-1 rounded focus:outline-none ${
                          ord.status === "Delivered" ? "text-green-400 border-green-500/20" :
                          ord.status === "Shipped" ? "text-blue-400 border-blue-500/20" :
                          ord.status === "Calibrating" ? "text-yellow-450 border-yellow-500/20" :
                          "text-zinc-400"
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Calibrating">Calibrating</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-zinc-555 tracking-wider block">Customer Details</span>
                      <p className="text-white font-semibold">{ord.customerName}</p>
                      <p className="text-zinc-500">{ord.customerEmail}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-zinc-555 tracking-wider block">Order Total</span>
                      <p className="text-primary-gold font-bold text-base">₹{ord.total.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="bg-[#070707] border border-zinc-950 p-4 rounded text-xs space-y-2">
                    <span className="text-[9px] uppercase font-bold text-zinc-650 tracking-wider block">Purchased Items</span>
                    <div className="divide-y divide-zinc-900">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex justify-between">
                          <div>
                            <p className="text-white font-serif">{item.name} <span className="text-zinc-500 font-mono text-[10px]">x{item.qty}</span></p>
                            {item.engraving && (
                              <p className="text-[10px] text-zinc-500 italic mt-0.5">Laser Engraved: &ldquo;{item.engraving}&rdquo;</p>
                            )}
                          </div>
                          <span className="text-zinc-400">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
