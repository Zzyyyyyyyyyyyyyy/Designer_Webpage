import { Search, Plus, MessageCircle, User, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface NavigationBarProps {
  onSearchChange?: (query: string, isActive: boolean) => void;
  onFilterClick?: () => void;
  searchQuery?: string;
}

export function NavigationBar({ onSearchChange, onFilterClick, searchQuery = "" }: NavigationBarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Determine active tab based on current route
  const activeTab = location.pathname === "/following" ? "following" : "discover";

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
      if (e.key === "Escape" && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, isUserMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isUserMenuOpen]);

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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Main Header Row */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-white tracking-wider hover:opacity-70 transition-opacity">
            DESIGNER
          </Link>

          {/* Center Toggle - Always visible */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/following")}
              className={`text-white transition-all ${
                activeTab === "following"
                  ? "border-b-2 border-white pb-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Following
            </button>
            <button
              onClick={() => navigate("/")}
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
            <Link
              to="/upload"
              className="text-white hover:opacity-70 transition-opacity"
              title="Upload new post"
            >
              <Plus className="w-5 h-5" />
            </Link>
            <Link to="/messages" className="text-white hover:opacity-70 transition-opacity">
              <MessageCircle className="w-5 h-5" />
            </Link>
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative flex items-center">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-white hover:opacity-70 transition-opacity"
                  title="Account"
                >
                  <User className="w-5 h-5" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white/20 shadow-lg">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white text-sm font-medium truncate">
                        {user?.email}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {user?.interests.length || 0} interests selected
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-white text-sm hover:bg-white/5 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:opacity-70 transition-opacity"
                title="Log in"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
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
