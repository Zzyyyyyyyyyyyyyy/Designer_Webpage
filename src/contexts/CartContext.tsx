import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

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
  addToCart: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  getTotalPrice: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        product_id,
        size,
        quantity,
        posts (
          id,
          caption,
          images,
          price,
          users (
            username
          )
        )
      `
      )
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
    } else if (data) {
      const formattedItems = data.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        title: item.posts?.caption || "",
        imageUrl: item.posts?.images[0] || "",
        price: item.posts?.price ? `$${item.posts.price}` : "$0",
        size: item.size,
        quantity: item.quantity,
        designerName: item.posts?.users?.username,
      }));
      setCartItems(formattedItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => {
    if (!user) throw new Error("Must be authenticated");

    const { error } = await supabase.from("cart_items").upsert({
      user_id: user.id,
      product_id: item.productId,
      size: item.size,
      quantity: item.quantity || 1,
    });

    if (error) {
      console.error("Error adding to cart:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw new Error(error.message || JSON.stringify(error));
    }

    await fetchCart();
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }

    await fetchCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);

    if (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }

    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id);

    if (error) {
      console.error("Error clearing cart:", error);
    } else {
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
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
        loading,
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
