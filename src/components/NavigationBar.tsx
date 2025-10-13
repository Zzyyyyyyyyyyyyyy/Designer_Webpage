import { Search, Plus, MessageCircle, User, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NavigationBarProps {
  onSearchChange?: (query: string, isActive: boolean) => void;
  onFilterClick?: () => void;
  searchQuery?: string;
}

export function NavigationBar({ onSearchChange, onFilterClick, searchQuery = "" }: NavigationBarProps) {
  const [activeTab, setActiveTab] = useState<"following" | "discover">("discover");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        handleCloseSearch();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    onSearchChange?.(localSearchQuery, true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setLocalSearchQuery("");
    onSearchChange?.("", false);
  };

  const handleSearchInputChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange?.(value, true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Main Header Row */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="text-white tracking-wider">DESIGNER</div>

          {/* Center Toggle - Always visible */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("following")}
              className={`text-white transition-all ${
                activeTab === "following"
                  ? "border-b-2 border-white pb-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`text-white transition-all ${
                activeTab === "discover"
                  ? "border-b-2 border-white pb-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Discover
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {!isSearchOpen ? (
              <button
                onClick={handleOpenSearch}
                className="text-white hover:opacity-70 transition-opacity"
              >
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleCloseSearch}
                className="text-white hover:opacity-70 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button className="text-white hover:opacity-70 transition-opacity">
              <Plus className="w-5 h-5" />
            </button>
            <button className="text-white hover:opacity-70 transition-opacity">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="text-white hover:opacity-70 transition-opacity">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Row - Expands when search is open */}
        {isSearchOpen && (
          <div className="pb-4 flex items-center gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                ref={searchInputRef}
                type="text"
                value={localSearchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent border-b border-white/20 pb-2 px-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <button
              onClick={onFilterClick}
              className="p-2 border border-white/20 hover:border-white/40 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
