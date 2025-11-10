import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// User profile interfaces
interface SocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
}

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface UserProfile {
  // Basic Info
  fullName?: string;
  username?: string;
  avatar?: string;
  profession?: string;
  bio?: string;
  about?: string;
  location?: string;

  // Professional Info
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  services?: string;
  priceRange?: string;
  isAvailable: boolean;

  // Social & Contact
  socialLinks: SocialLinks;

  // Stats
  followers: number;
  following: number;
  likes: number;
}

interface UserSettings {
  // Privacy
  profileVisibility: "public" | "followers" | "private";
  showEmail: boolean;
  showStats: boolean;
  indexable: boolean;

  // Notifications
  emailNotifications: {
    newFollower: boolean;
    likes: boolean;
    comments: boolean;
    messages: boolean;
    systemUpdates: boolean;
    marketing: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    newFollower: boolean;
    likes: boolean;
    comments: boolean;
    messages: boolean;
  };
  notificationFrequency: "realtime" | "daily" | "weekly";

  // Preferences
  language: string;
  timezone: string;
  currency: string;
  theme: "light" | "dark" | "auto";
  viewMode: "grid" | "list";

  // Security
  twoFactorEnabled: boolean;
}

interface User {
  email: string;
  interests: string[];
  profile: UserProfile;
  settings: UserSettings;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveInterests: (interests: string[]) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user profile
const createDefaultProfile = (): UserProfile => ({
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  isAvailable: true,
  socialLinks: {},
  followers: 0,
  following: 0,
  likes: 0,
});

// Default user settings
const createDefaultSettings = (): UserSettings => ({
  profileVisibility: "public",
  showEmail: false,
  showStats: true,
  indexable: true,
  emailNotifications: {
    newFollower: true,
    likes: true,
    comments: true,
    messages: true,
    systemUpdates: true,
    marketing: false,
  },
  pushNotifications: {
    enabled: false,
    newFollower: true,
    likes: true,
    comments: true,
    messages: true,
  },
  notificationFrequency: "realtime",
  language: "en",
  timezone: "UTC",
  currency: "USD",
  theme: "dark",
  viewMode: "grid",
  twoFactorEnabled: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("designer_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure user has profile and settings with defaults
        setUser({
          ...parsedUser,
          profile: { ...createDefaultProfile(), ...parsedUser.profile },
          settings: { ...createDefaultSettings(), ...parsedUser.settings },
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("designer_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("designer_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("designer_user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, this would validate credentials with a backend
        const newUser: User = {
          email,
          interests: [],
          profile: createDefaultProfile(),
          settings: createDefaultSettings(),
        };
        setUser(newUser);
        resolve();
      }, 500);
    });
  };

  const signup = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, this would create a new user in the backend
        const newUser: User = {
          email,
          interests: [],
          profile: createDefaultProfile(),
          settings: createDefaultSettings(),
        };
        setUser(newUser);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const saveInterests = (interests: string[]) => {
    if (user) {
      setUser({
        ...user,
        interests,
      });
    }
  };

  const updateProfile = (profileUpdates: Partial<UserProfile>) => {
    if (user) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          ...profileUpdates,
        },
      });
    }
  };

  const updateSettings = (settingsUpdates: Partial<UserSettings>) => {
    if (user) {
      setUser({
        ...user,
        settings: {
          ...user.settings,
          ...settingsUpdates,
        },
      });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    saveInterests,
    updateProfile,
    updateSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export types for use in other components
export type { User, UserProfile, UserSettings, SocialLinks, WorkExperience, Education };
