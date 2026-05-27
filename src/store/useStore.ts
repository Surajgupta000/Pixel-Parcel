import { create } from 'zustand';
import { WatchProduct, coupons } from '@/data/products';

export interface CartItem {
  product: WatchProduct;
  quantity: number;
  engraving?: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: string[];
  compareList: WatchProduct[];
  appliedCoupon: { code: string; discountPercent: number } | null;
  isSoundEnabled: boolean;
  exitIntentSeen: boolean;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  
  // Cart Actions
  addToCart: (product: WatchProduct, quantity: number, engraving?: string) => void;
  removeFromCart: (productId: string, engraving?: string) => void;
  updateQuantity: (productId: string, quantity: number, engraving?: string) => void;
  clearCart: () => void;
  
  // Coupon Actions
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  
  // Compare Actions
  addToCompare: (product: WatchProduct) => { success: boolean; message: string };
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  
  // UI / Sound Actions
  toggleSound: () => void;
  setExitIntentSeen: (seen: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set, get) => {
  // Helper to load initial state safely in browser
  const isClient = typeof window !== 'undefined';
  
  const getLocalStorage = (key: string, defaultValue: any) => {
    if (!isClient) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setLocalStorage = (key: string, value: any) => {
    if (isClient) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error("Error writing to localStorage", e);
      }
    }
  };

  const initialCart = getLocalStorage('pp_cart', []);
  const initialWishlist = getLocalStorage('pp_wishlist', []);
  const initialSound = getLocalStorage('pp_sound', true);

  return {
    cart: initialCart,
    wishlist: initialWishlist,
    compareList: [],
    appliedCoupon: null,
    isSoundEnabled: initialSound,
    exitIntentSeen: false,
    isCartOpen: false,
    setCartOpen: (open) => set({ isCartOpen: open }),

    addToCart: (product, quantity, engraving) => {
      const { cart } = get();
      const existingIndex = cart.findIndex(
        item => item.product.id === product.id && item.engraving === engraving
      );

      let newCart = [...cart];
      if (existingIndex > -1) {
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart.push({ product, quantity, engraving });
      }

      set({ cart: newCart, isCartOpen: true });
      setLocalStorage('pp_cart', newCart);
    },

    removeFromCart: (productId, engraving) => {
      const { cart } = get();
      const newCart = cart.filter(
        item => !(item.product.id === productId && item.engraving === engraving)
      );
      set({ cart: newCart });
      setLocalStorage('pp_cart', newCart);
    },

    updateQuantity: (productId, quantity, engraving) => {
      if (quantity <= 0) {
        get().removeFromCart(productId, engraving);
        return;
      }
      const { cart } = get();
      const newCart = cart.map(item => {
        if (item.product.id === productId && item.engraving === engraving) {
          return { ...item, quantity };
        }
        return item;
      });
      set({ cart: newCart });
      setLocalStorage('pp_cart', newCart);
    },

    clearCart: () => {
      set({ cart: [], appliedCoupon: null });
      setLocalStorage('pp_cart', []);
    },

    applyCoupon: (code) => {
      const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      if (coupon) {
        set({ appliedCoupon: { code: coupon.code, discountPercent: coupon.discountPercent } });
        return { success: true, message: `Coupon ${coupon.code} applied! ${coupon.discountPercent}% discount.` };
      }
      return { success: false, message: "Invalid coupon code." };
    },

    removeCoupon: () => {
      set({ appliedCoupon: null });
    },

    toggleWishlist: (productId) => {
      const { wishlist } = get();
      const isAlreadyIn = wishlist.includes(productId);
      const newWishlist = isAlreadyIn
        ? wishlist.filter(id => id !== productId)
        : [...wishlist, productId];
      
      set({ wishlist: newWishlist });
      setLocalStorage('pp_wishlist', newWishlist);
    },

    addToCompare: (product) => {
      const { compareList } = get();
      if (compareList.some(item => item.id === product.id)) {
        return { success: false, message: `${product.name} is already in comparison.` };
      }
      if (compareList.length >= 3) {
        return { success: false, message: "You can compare a maximum of 3 watches." };
      }
      set({ compareList: [...compareList, product] });
      return { success: true, message: `${product.name} added to comparison.` };
    },

    removeFromCompare: (productId) => {
      const { compareList } = get();
      set({ compareList: compareList.filter(item => item.id !== productId) });
    },

    clearCompare: () => {
      set({ compareList: [] });
    },

    toggleSound: () => {
      const nextSound = !get().isSoundEnabled;
      set({ isSoundEnabled: nextSound });
      setLocalStorage('pp_sound', nextSound);
    },

    setExitIntentSeen: (seen) => {
      set({ exitIntentSeen: seen });
    },

    theme: 'dark',
    toggleTheme: () => {
      const nextTheme = get().theme === 'light' ? 'dark' : 'light';
      set({ theme: nextTheme });
      setLocalStorage('pp_theme', nextTheme);
      
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (nextTheme === 'light') {
          root.classList.add('light');
        } else {
          root.classList.remove('light');
        }
      }
    }
  };
});
