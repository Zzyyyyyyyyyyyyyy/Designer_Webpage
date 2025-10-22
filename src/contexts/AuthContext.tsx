import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  interests: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveInterests: (interests: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("designer_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
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
          interests: [], // Will be empty for login, populated during signup
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
          interests: [], // Will be populated in the interests selection step
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    saveInterests,
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
