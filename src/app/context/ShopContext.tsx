import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product } from '../api/client';

interface CartItem {
  product: Product;
  qty: number;
}

interface ShopContextValue {
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  addToCart: (product: Product, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  toast: { message: string; type: 'success' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'info') => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = 'dosugem-cart';
const WISHLIST_KEY = 'dosugem-wishlist';

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      return ex
        ? prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { product, qty }];
    });
    showToast(`Đã thêm "${product.name.slice(0, 30)}..." vào giỏ hàng`);
  }, [showToast]);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) { setCart(prev => prev.filter(i => i.product.id !== id)); return; }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.product.id !== id));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) { showToast('Đã xóa khỏi yêu thích', 'info'); return prev.filter(p => p.id !== product.id); }
      showToast('Đã thêm vào danh sách yêu thích');
      return [...prev, product];
    });
  }, [showToast]);

  const isWishlisted = useCallback((id: string) => wishlist.some(p => p.id === id), [wishlist]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <ShopContext.Provider value={{
      cart, wishlist, cartCount,
      addToCart, updateQty, removeFromCart, clearCart,
      toggleWishlist, isWishlisted,
      toast, showToast,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
