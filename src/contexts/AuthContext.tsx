import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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

interface EmailNotifications {
  newFollower: boolean;
  likes: boolean;
  comments: boolean;
  messages: boolean;
  systemUpdates: boolean;
  marketing: boolean;
}

interface PushNotifications {
  enabled: boolean;
  newFollower: boolean;
  likes: boolean;
  comments: boolean;
  messages: boolean;
}

interface UserSettings {
  // Privacy
  profileVisibility: "public" | "followers" | "private";
  showEmail: boolean;
  showStats: boolean;
  indexable: boolean;

  // Notifications
  emailNotifications: EmailNotifications;
  pushNotifications: PushNotifications;
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
  id: string;
  email: string;
  profile: UserProfile;
  settings: UserSettings;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user profile (unused - constructed inline instead)
/* eslint-disable @typescript-eslint/no-unused-vars */
const _createDefaultProfile = (): UserProfile => ({
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

  // Fetch user data from Supabase
  const fetchUserData = async (supabaseUser: SupabaseUser) => {
    try {
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (userError && userError.code !== "PGRST116") throw userError;

      // Fetch user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .single();

      if (settingsError && settingsError.code !== "PGRST116") throw settingsError;

      // Combine data
      const profile: UserProfile = {
        fullName: userData?.full_name ?? undefined,
        username: userData?.username ?? undefined,
        avatar: userData?.avatar_url ?? undefined,
        profession: userData?.profession ?? undefined,
        bio: userData?.bio ?? undefined,
        about: userData?.about ?? undefined,
        location: userData?.location ?? undefined,
        skills: userData?.skills || [],
        experience: [], // TODO: Store experience in separate table
        education: [], // TODO: Store education in separate table
        certifications: userData?.certifications || [],
        services: userData?.services ?? undefined,
        priceRange: userData?.price_range ?? undefined,
        isAvailable: userData?.is_available ?? true,
        socialLinks: (userData?.social_links as SocialLinks) || {},
        followers: userData?.followers_count || 0,
        following: userData?.following_count || 0,
        likes: 0,
      };

      const settings: UserSettings = settingsData
        ? {
            profileVisibility: (settingsData.profile_visibility as "public" | "followers" | "private") || "public",
            showEmail: settingsData.show_email ?? false,
            showStats: settingsData.show_stats ?? true,
            indexable: settingsData.indexable ?? true,
            emailNotifications: (settingsData.email_notifications as unknown as EmailNotifications) || createDefaultSettings().emailNotifications,
            pushNotifications: (settingsData.push_notifications as unknown as PushNotifications) || createDefaultSettings().pushNotifications,
            notificationFrequency: (settingsData.notification_frequency as "realtime" | "daily" | "weekly") || "realtime",
            language: settingsData.language || "en",
            timezone: settingsData.timezone || "UTC",
            currency: settingsData.currency || "USD",
            theme: settingsData.theme || "dark",
            viewMode: settingsData.view_mode || "grid",
            twoFactorEnabled: settingsData.two_factor_enabled ?? false,
          }
        : createDefaultSettings();

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        profile,
        settings,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    // Create user profile
    if (data.user && data.user.email) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
      });

      // Create user settings
      await supabase.from("user_settings").insert({
        user_id: data.user.id,
      });
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  // Removed saveInterests - no longer needed as interests are not stored

  const updateProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;

    // Map frontend fields to database fields
    const dbUpdates: any = {};
    if (profileUpdates.fullName !== undefined) dbUpdates.full_name = profileUpdates.fullName;
    if (profileUpdates.username !== undefined) dbUpdates.username = profileUpdates.username;
    if (profileUpdates.avatar !== undefined) dbUpdates.avatar_url = profileUpdates.avatar;
    if (profileUpdates.profession !== undefined) dbUpdates.profession = profileUpdates.profession;
    if (profileUpdates.bio !== undefined) dbUpdates.bio = profileUpdates.bio;
    if (profileUpdates.about !== undefined) dbUpdates.about = profileUpdates.about;
    if (profileUpdates.location !== undefined) dbUpdates.location = profileUpdates.location;
    if (profileUpdates.skills !== undefined) dbUpdates.skills = profileUpdates.skills;
    if (profileUpdates.experience !== undefined) dbUpdates.experience = profileUpdates.experience;
    if (profileUpdates.education !== undefined) dbUpdates.education = profileUpdates.education;
    if (profileUpdates.certifications !== undefined) dbUpdates.certifications = profileUpdates.certifications;
    if (profileUpdates.services !== undefined) dbUpdates.services = profileUpdates.services;
    if (profileUpdates.priceRange !== undefined) dbUpdates.price_range = profileUpdates.priceRange;
    if (profileUpdates.isAvailable !== undefined) dbUpdates.is_available = profileUpdates.isAvailable;
    if (profileUpdates.socialLinks !== undefined) dbUpdates.social_links = profileUpdates.socialLinks;

    const { error } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq("id", user.id);

    if (error) throw error;

    setUser({
      ...user,
      profile: {
        ...user.profile,
        ...profileUpdates,
      },
    });
  };

  const updateSettings = async (settingsUpdates: Partial<UserSettings>) => {
    if (!user) return;

    // Map frontend fields to database fields
    const dbUpdates: any = {};
    if (settingsUpdates.profileVisibility !== undefined)
      dbUpdates.profile_visibility = settingsUpdates.profileVisibility;
    if (settingsUpdates.showEmail !== undefined) dbUpdates.show_email = settingsUpdates.showEmail;
    if (settingsUpdates.showStats !== undefined) dbUpdates.show_stats = settingsUpdates.showStats;
    if (settingsUpdates.indexable !== undefined) dbUpdates.indexable = settingsUpdates.indexable;
    if (settingsUpdates.emailNotifications !== undefined)
      dbUpdates.email_notifications = settingsUpdates.emailNotifications;
    if (settingsUpdates.pushNotifications !== undefined)
      dbUpdates.push_notifications = settingsUpdates.pushNotifications;
    if (settingsUpdates.notificationFrequency !== undefined)
      dbUpdates.notification_frequency = settingsUpdates.notificationFrequency;
    if (settingsUpdates.language !== undefined) dbUpdates.language = settingsUpdates.language;
    if (settingsUpdates.timezone !== undefined) dbUpdates.timezone = settingsUpdates.timezone;
    if (settingsUpdates.currency !== undefined) dbUpdates.currency = settingsUpdates.currency;
    if (settingsUpdates.theme !== undefined) dbUpdates.theme = settingsUpdates.theme;
    if (settingsUpdates.viewMode !== undefined) dbUpdates.view_mode = settingsUpdates.viewMode;
    if (settingsUpdates.twoFactorEnabled !== undefined)
      dbUpdates.two_factor_enabled = settingsUpdates.twoFactorEnabled;

    const { error } = await supabase
      .from("user_settings")
      .update(dbUpdates)
      .eq("user_id", user.id);

    if (error) throw error;

    setUser({
      ...user,
      settings: {
        ...user.settings,
        ...settingsUpdates,
      },
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
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
