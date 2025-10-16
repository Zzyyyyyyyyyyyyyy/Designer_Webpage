import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  sizes?: string[];
  description?: string;
  material?: string;
  careInstructions?: string;
  category?: string;
}

interface ComparisonContextType {
  comparisonList: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 4;
const STORAGE_KEY = "product_comparison";

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonList, setComparisonList] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setComparisonList(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse comparison list from storage:", error);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonList));
  }, [comparisonList]);

  const addToComparison = (product: Product) => {
    setComparisonList((prev) => {
      // Check if already in comparison
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }

      // Check if limit reached
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        console.warn(`Maximum ${MAX_COMPARISON_ITEMS} products can be compared`);
        return prev;
      }

      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (productId: string) => {
    return comparisonList.some((p) => p.id === productId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
