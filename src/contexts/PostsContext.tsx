import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface UserPost {
  id: string;
  user_id: string;
  imageUrl: string;
  caption: string;
  images: string[];
  price: string;
  tags: string[];
  isProduct: boolean;
  userName?: string;
  sizes?: string[];
  description?: string;
  details?: string;
  createdAt: number;
  likes_count: number;
  saves_count: number;
}

interface PostsContextType {
  posts: UserPost[];
  addPost: (post: Omit<UserPost, "id" | "createdAt" | "user_id" | "likes_count" | "saves_count">) => Promise<void>;
  getPosts: () => UserPost[];
  clearPosts: () => Promise<void>;
  loading: boolean;
  refetch: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        user_id,
        caption,
        description,
        details,
        images,
        price,
        sizes,
        tags,
        is_product,
        created_at,
        likes_count,
        saves_count,
        users (
          username,
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else if (data) {
      const formattedPosts = data.map((post: any) => ({
        id: post.id,
        user_id: post.user_id,
        imageUrl: post.images[0] || "",
        caption: post.caption,
        images: post.images,
        price: post.price ? `$${post.price}` : "$0",
        tags: post.tags || [],
        isProduct: post.is_product,
        userName: post.users?.username || post.users?.email,
        sizes: post.sizes,
        description: post.description || undefined,
        details: post.details || undefined,
        createdAt: new Date(post.created_at).getTime(),
        likes_count: post.likes_count,
        saves_count: post.saves_count,
      }));
      setPosts(formattedPosts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (
    post: Omit<UserPost, "id" | "createdAt" | "user_id" | "likes_count" | "saves_count">
  ) => {
    if (!user) throw new Error("Must be authenticated to create posts");

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        caption: post.caption,
        description: post.description,
        details: post.details,
        images: post.images,
        is_product: post.isProduct,
        price: parseFloat(post.price.replace("$", "")),
        sizes: post.sizes,
        tags: post.tags,
      })
      .select();

    if (error) {
      console.error("Error creating post:", error);
      throw error;
    }

    await fetchPosts();
  };

  const getPosts = () => {
    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  };

  const clearPosts = async () => {
    if (!user) return;

    const { error } = await supabase.from("posts").delete().eq("user_id", user.id);

    if (error) {
      console.error("Error clearing posts:", error);
    } else {
      setPosts([]);
    }
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, getPosts, clearPosts, loading, refetch: fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
