import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// User post interface matching FeedPage's ExtendedFashionPost structure
export interface UserPost {
  id: string;
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
  createdAt: number; // timestamp for sorting
}

interface PostsContextType {
  posts: UserPost[];
  addPost: (post: Omit<UserPost, "id" | "createdAt">) => void;
  getPosts: () => UserPost[];
  clearPosts: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const STORAGE_KEY = "designer_user_posts";

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load posts from localStorage on mount
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(STORAGE_KEY);
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        setPosts(parsedPosts);
      }
    } catch (error) {
      console.error("Failed to load posts from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      } catch (error) {
        console.error("Failed to save posts to localStorage:", error);
      }
    }
  }, [posts, isLoaded]);

  const addPost = (post: Omit<UserPost, "id" | "createdAt">) => {
    const newPost: UserPost = {
      ...post,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
    };

    // Add new post at the beginning (most recent first)
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const getPosts = () => {
    // Return posts sorted by most recent first
    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  };

  const clearPosts = () => {
    setPosts([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, getPosts, clearPosts }}>
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
