import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  imageUrl: string;
  price: string;
  size: string;
  quantity: number;
  designerName?: string;
  designerUsername?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "shopping_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse cart from storage:", error);
      }
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => {
    setCartItems((prev) => {
      // Check if item with same productId and size already exists
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + (item.quantity || 1),
        };
        return updated;
      }

      // Add new item
      const newItem: CartItem = {
        ...item,
        id: `${item.productId}-${item.size}-${Date.now()}`,
        quantity: item.quantity || 1,
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Parse price string (e.g., "$425" -> 425)
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
