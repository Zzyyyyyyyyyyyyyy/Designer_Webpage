import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  const [lastVisitTimestamps, setLastVisitTimestamps] = useState<Record<string, number>>({});

  // Mock designers data
  const allDesigners: Designer[] = [
    {
      id: "designer-1",
      name: "Elena Rossi",
      username: "elenarossi",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      bio: "Minimalist fashion designer based in Milan. Creating timeless pieces for the modern wardrobe.",
      followerCount: 245000,
      postCount: 432,
      isVerified: true,
    },
    {
      id: "designer-2",
      name: "Marcus Chen",
      username: "marcuschen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      bio: "Streetwear architect. Blending urban culture with high fashion.",
      followerCount: 189000,
      postCount: 267,
      isVerified: true,
    },
    {
      id: "designer-3",
      name: "Sofia Laurent",
      username: "sofialaurent",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      bio: "Parisian couture designer. Elegance meets contemporary style.",
      followerCount: 312000,
      postCount: 589,
      isVerified: true,
    },
    {
      id: "designer-4",
      name: "Kai Nakamura",
      username: "kainakamura",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      bio: "Japanese avant-garde fashion. Exploring the intersection of tradition and innovation.",
      followerCount: 156000,
      postCount: 198,
      isVerified: true,
    },
    {
      id: "designer-5",
      name: "Amara Johnson",
      username: "amarajohnson",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      bio: "Sustainable fashion advocate. Creating eco-conscious designs that inspire.",
      followerCount: 278000,
      postCount: 445,
      isVerified: true,
    },
    {
      id: "designer-6",
      name: "Lucas Schmidt",
      username: "lucasschmidt",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      bio: "Berlin-based designer. Bold patterns and experimental silhouettes.",
      followerCount: 134000,
      postCount: 312,
      isVerified: false,
    },
  ];

  // Load followed designers from localStorage on mount
  useEffect(() => {
    try {
      const storedFollowing = localStorage.getItem("designer_following");
      if (storedFollowing) {
        try {
          const parsed = JSON.parse(storedFollowing);
          setFollowedDesignerIds(new Set(parsed));
        } catch (error) {
          console.error("Failed to parse followed designers:", error);
          localStorage.removeItem("designer_following");
        }
      } else {
        // Initialize with a few followed designers for demo purposes
        const defaultFollowing = ["designer-1", "designer-3", "designer-5"];
        setFollowedDesignerIds(new Set(defaultFollowing));
        localStorage.setItem("designer_following", JSON.stringify(defaultFollowing));
      }

      // Load last visit timestamps
      const storedTimestamps = localStorage.getItem("designer_last_visits");
      if (storedTimestamps) {
        try {
          setLastVisitTimestamps(JSON.parse(storedTimestamps));
        } catch (error) {
          console.error("Failed to parse timestamps:", error);
        }
      }
    } catch (error) {
      // localStorage not available (e.g., Safari private browsing)
      console.warn("localStorage not available:", error);
      // Use default values
      const defaultFollowing = ["designer-1", "designer-3", "designer-5"];
      setFollowedDesignerIds(new Set(defaultFollowing));
    }
  }, []);

  // Save followed designers to localStorage whenever they change
  useEffect(() => {
    if (followedDesignerIds.size > 0) {
      try {
        localStorage.setItem("designer_following", JSON.stringify([...followedDesignerIds]));
      } catch (error) {
        console.warn("Failed to save to localStorage:", error);
      }
    }
  }, [followedDesignerIds]);

  const followDesigner = (designerId: string) => {
    setFollowedDesignerIds((prev) => new Set([...prev, designerId]));
  };

  const unfollowDesigner = (designerId: string) => {
    setFollowedDesignerIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(designerId);
      return newSet;
    });
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
    const lastVisit = lastVisitTimestamps[designerId] || 0;
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
