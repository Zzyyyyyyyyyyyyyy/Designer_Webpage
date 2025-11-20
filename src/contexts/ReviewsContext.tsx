import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  content: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
}

interface ReviewsContextType {
  getProductReviews: (productId: string) => Promise<Review[]>;
  addReview: (review: {
    product_id: string;
    rating: number;
    title?: string;
    content: string;
  }) => Promise<void>;
  updateReview: (reviewId: string, updates: { rating?: number; title?: string; content?: string }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  markHelpful: (reviewId: string) => Promise<void>;
  getUserReview: (productId: string) => Promise<Review | null>;
  loading: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getProductReviews = useCallback(async (productId: string): Promise<Review[]> => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        users:user_id (
          username,
          avatar_url
        )
      `
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return (data || []).map((review: any) => ({
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      verified_purchase: review.verified_purchase,
      helpful_count: review.helpful_count,
      created_at: review.created_at,
      updated_at: review.updated_at,
      user: review.users
        ? {
            username: review.users.username,
            avatar_url: review.users.avatar_url,
          }
        : undefined,
    }));
  }, []);

  const getUserReview = useCallback(
    async (productId: string): Promise<Review | null> => {
      if (!user) return null;

      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
        *,
        users:user_id (
          username,
          avatar_url
        )
      `
        )
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .single();

      setLoading(false);

      if (error) {
        if (error.code === "PGRST116") return null; // No review found
        console.error("Error fetching user review:", error);
        return null;
      }

      return {
        id: data.id,
        product_id: data.product_id,
        user_id: data.user_id,
        rating: data.rating,
        title: data.title,
        content: data.content,
        verified_purchase: data.verified_purchase,
        helpful_count: data.helpful_count,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user: data.users
          ? {
              username: data.users.username,
              avatar_url: data.users.avatar_url,
            }
          : undefined,
      };
    },
    [user]
  );

  const addReview = useCallback(
    async (review: { product_id: string; rating: number; title?: string; content: string }) => {
      if (!user) {
        console.error("Must be authenticated to add reviews");
        return;
      }

      setLoading(true);
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        product_id: review.product_id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        verified_purchase: false, // TODO: Check if user purchased the product
      });

      setLoading(false);

      if (error) {
        console.error("Error adding review:", error);
        throw error;
      }
    },
    [user]
  );

  const updateReview = useCallback(
    async (reviewId: string, updates: { rating?: number; title?: string; content?: string }) => {
      if (!user) return;

      setLoading(true);
      const { error } = await supabase
        .from("reviews")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reviewId)
        .eq("user_id", user.id);

      setLoading(false);

      if (error) {
        console.error("Error updating review:", error);
        throw error;
      }
    },
    [user]
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      if (!user) return;

      setLoading(true);
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId).eq("user_id", user.id);

      setLoading(false);

      if (error) {
        console.error("Error deleting review:", error);
        throw error;
      }
    },
    [user]
  );

  const markHelpful = useCallback(async (reviewId: string) => {
    // Increment helpful count
    setLoading(true);
    const { error } = await supabase.rpc("increment_review_helpful", {
      review_id: reviewId,
    });

    setLoading(false);

    if (error) {
      console.error("Error marking review as helpful:", error);
    }
  }, []);

  const value: ReviewsContextType = {
    getProductReviews,
    addReview,
    updateReview,
    deleteReview,
    markHelpful,
    getUserReview,
    loading,
  };

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
