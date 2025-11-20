import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

interface LikesContextType {
  likedPosts: Set<string>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  isLiked: (postId: string) => boolean;
  toggleLike: (postId: string) => Promise<void>;
  loading: boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user's liked posts
  const fetchLikes = useCallback(async () => {
    if (!user) {
      setLikedPosts(new Set());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching likes:", error);
    } else if (data) {
      const postIds = data.map((like) => like.post_id).filter((id): id is string => id !== null);
      setLikedPosts(new Set(postIds));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  // Subscribe to realtime like changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("likes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newLike = payload.new as { post_id: string | null };
            if (newLike.post_id) {
              setLikedPosts((prev) => new Set([...prev, newLike.post_id!]));
            }
          } else if (payload.eventType === "DELETE") {
            const deletedLike = payload.old as { post_id: string | null };
            if (deletedLike.post_id) {
              setLikedPosts((prev) => {
                const newSet = new Set(prev);
                newSet.delete(deletedLike.post_id!);
                return newSet;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const likePost = useCallback(
    async (postId: string) => {
      if (!user) {
        console.error("Must be authenticated to like posts");
        return;
      }

      const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        post_id: postId,
      });

      if (error && error.code !== "23505") {
        // Ignore duplicate errors
        console.error("Error liking post:", error);
      } else {
        setLikedPosts((prev) => new Set([...prev, postId]));
      }
    },
    [user]
  );

  const unlikePost = useCallback(
    async (postId: string) => {
      if (!user) return;

      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (error) {
        console.error("Error unliking post:", error);
      } else {
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    },
    [user]
  );

  const isLiked = useCallback(
    (postId: string) => {
      return likedPosts.has(postId);
    },
    [likedPosts]
  );

  const toggleLike = useCallback(
    async (postId: string) => {
      if (isLiked(postId)) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    },
    [isLiked, likePost, unlikePost]
  );

  const value: LikesContextType = {
    likedPosts,
    likePost,
    unlikePost,
    isLiked,
    toggleLike,
    loading,
  };

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error("useLikes must be used within a LikesProvider");
  }
  return context;
}
