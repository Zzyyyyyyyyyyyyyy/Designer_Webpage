import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

// Designer interface
export interface Designer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followerCount: number;
  postCount: number;
  isVerified: boolean;
}

// Designer Post interface - extends the basic FashionPost
export interface DesignerPost {
  id: string;
  imageUrl: string;
  caption: string;
  designerId: string;
  designerName: string;
  designerAvatar: string;
  designerUsername: string;
  timestamp: number; // Unix timestamp
  likes: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  isProduct?: boolean;
  price?: string;
  sizes?: string[];
  description?: string;
  details?: string;
  images?: string[];
  tags?: string[];
}

// Context type definition
interface FollowingContextType {
  followedDesigners: Designer[];
  followedDesignerIds: Set<string>;
  allDesigners: Designer[];
  followDesigner: (designerId: string) => void;
  unfollowDesigner: (designerId: string) => void;
  isFollowing: (designerId: string) => boolean;
  getDesignerById: (designerId: string) => Designer | undefined;
  getNewPostCount: (designerId: string) => number;
}

const FollowingContext = createContext<FollowingContextType | undefined>(undefined);

export function FollowingProvider({ children }: { children: ReactNode }) {
  const [followedDesignerIds, setFollowedDesignerIds] = useState<Set<string>>(new Set());
  const [allDesigners, setAllDesigners] = useState<Designer[]>([]);
  const [_lastVisitTimestamps, _setLastVisitTimestamps] = useState<Record<string, number>>({});
  const [_loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all designers from Supabase
  const fetchDesigners = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, full_name, bio, avatar_url, followers_count, posts_count, is_verified")
      .order("followers_count", { ascending: false });

    if (error) {
      console.error("Error fetching designers:", error);
    } else if (data) {
      const formattedDesigners = data.map((designer: any) => ({
        id: designer.id,
        name: designer.full_name || designer.username || "Unknown",
        username: designer.username || "unknown",
        avatar: designer.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
        bio: designer.bio || "",
        followerCount: designer.followers_count || 0,
        postCount: designer.posts_count || 0,
        isVerified: designer.is_verified || false,
      }));
      setAllDesigners(formattedDesigners);
    }
  };

  // Fetch followed designers from Supabase
  const fetchFollows = async () => {
    if (!user) {
      setFollowedDesignerIds(new Set());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);

    if (error) {
      console.error("Error fetching follows:", error);
    } else if (data) {
      const followedIds = data.map((follow: any) => follow.following_id);
      setFollowedDesignerIds(new Set(followedIds));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDesigners();
  }, []);

  useEffect(() => {
    fetchFollows();
  }, [user]);

  const followDesigner = async (designerId: string) => {
    if (!user) {
      console.error("Must be authenticated to follow designers");
      return;
    }

    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: designerId,
    });

    if (error && error.code !== "23505") {
      // Ignore duplicate errors
      console.error("Error following designer:", error);
    } else {
      setFollowedDesignerIds((prev) => new Set([...prev, designerId]));
    }
  };

  const unfollowDesigner = async (designerId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", designerId);

    if (error) {
      console.error("Error unfollowing designer:", error);
    } else {
      setFollowedDesignerIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(designerId);
        return newSet;
      });
    }
  };

  const isFollowing = (designerId: string) => {
    return followedDesignerIds.has(designerId);
  };

  const getDesignerById = (designerId: string) => {
    return allDesigners.find((d) => d.id === designerId);
  };

  const getNewPostCount = (designerId: string) => {
    // In a real app, this would check against actual post timestamps
    // For now, return a mock count based on designer ID
    const lastVisit = _lastVisitTimestamps[designerId] || 0;
    const now = Date.now();
    const daysSinceVisit = (now - lastVisit) / (1000 * 60 * 60 * 24);

    // Simulate new posts: ~2 posts per day per designer
    return Math.min(Math.floor(daysSinceVisit * 2), 9);
  };

  const followedDesigners = allDesigners.filter((d) => followedDesignerIds.has(d.id));

  const value: FollowingContextType = {
    followedDesigners,
    followedDesignerIds,
    allDesigners,
    followDesigner,
    unfollowDesigner,
    isFollowing,
    getDesignerById,
    getNewPostCount,
  };

  return <FollowingContext.Provider value={value}>{children}</FollowingContext.Provider>;
}

export function useFollowing() {
  const context = useContext(FollowingContext);
  if (context === undefined) {
    throw new Error("useFollowing must be used within a FollowingProvider");
  }
  return context;
}
