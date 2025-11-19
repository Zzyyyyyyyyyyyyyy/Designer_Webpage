import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface WishlistItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  designer: string;
  addedAt: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  wishlistCount: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("wishlist_items")
      .select(
        `
        product_id,
        created_at,
        posts (
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
      console.error("Error fetching wishlist:", error);
    } else if (data) {
      const formattedItems = data.map((item: any) => ({
        productId: item.product_id,
        title: item.posts?.caption || "",
        imageUrl: item.posts?.images[0] || "",
        price: item.posts?.price || 0,
        designer: item.posts?.users?.username || "Unknown",
        addedAt: item.created_at,
      }));
      setWishlistItems(formattedItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (item: WishlistItem) => {
    if (!user) throw new Error("Must be authenticated");

    const { error } = await supabase.from("wishlist_items").insert({
      user_id: user.id,
      product_id: item.productId,
    });

    if (error && error.code !== "23505") {
      // Ignore duplicate errors
      console.error("Error adding to wishlist:", error);
      throw error;
    }

    await fetchWishlist();
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }

    await fetchWishlist();
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const toggleWishlist = async (item: WishlistItem) => {
    if (isInWishlist(item.productId)) {
      await removeFromWishlist(item.productId);
    } else {
      await addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
