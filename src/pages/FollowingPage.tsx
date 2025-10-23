import { NavigationBar } from "@/components/NavigationBar";
import { DesignerAvatarBar } from "@/components/DesignerAvatarBar";
import { DesignerPostCard } from "@/components/DesignerPostCard";
import { FollowingEmptyState } from "@/components/FollowingEmptyState";
import { RecommendedDesigners } from "@/components/RecommendedDesigners";
import { FilterPanel } from "@/components/FilterPanel";
import { EmptyState } from "@/components/EmptyState";
import { ItemDetail } from "@/components/ItemDetail";
import { ComparisonBar, ProductComparison } from "@/components/ProductComparison";
import { useComparison } from "@/contexts/ComparisonContext";
import { useFollowing, DesignerPost } from "@/contexts/FollowingContext";
import { designerPosts, getFollowingPosts } from "@/constants/designerPosts";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Masonry from "react-responsive-masonry";

type SortOption = "recent" | "popular";

export function FollowingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedDesignerId, setSelectedDesignerId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filteredPosts, setFilteredPosts] = useState<DesignerPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DesignerPost | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const {
    followedDesigners,
    followedDesignerIds,
    allDesigners,
    followDesigner,
    unfollowDesigner,
    getNewPostCount,
  } = useFollowing();

  // Get posts from followed designers
  const followingPosts = getFollowingPosts(followedDesignerIds);

  // Get recommended designers (not followed)
  const recommendedDesigners = allDesigners.filter((d) => !followedDesignerIds.has(d.id));

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (!isSearchActive && !selectedDesignerId) {
      setFilteredPosts(followingPosts);
      return;
    }

    // Simulate search/filter delay
    setIsSearching(true);
    const timer = setTimeout(() => {
      let results = followingPosts;

      // Filter by selected designer
      if (selectedDesignerId) {
        results = results.filter((post) => post.designerId === selectedDesignerId);
      }

      // Filter by search query
      if (isSearchActive && searchQuery.trim()) {
        results = results.filter((post) =>
          post.caption.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by selected categories
      if (selectedFilters.length > 0) {
        results = results.filter((post) => {
          if (post.tags !== undefined && post.tags.length > 0) {
            return selectedFilters.some((filter) => post.tags!.includes(filter));
          }
          const lowerCaption = post.caption.toLowerCase();
          return selectedFilters.some((filter) => lowerCaption.includes(filter.toLowerCase()));
        });
      }

      // Apply sorting
      if (sortBy === "popular") {
        results = [...results].sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves));
      } else {
        // Default is recent (already sorted by timestamp in getFollowingPosts)
        results = [...results].sort((a, b) => b.timestamp - a.timestamp);
      }

      setFilteredPosts(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedFilters,
    selectedDesignerId,
    sortBy,
    followingPosts,
    isSearchActive,
  ]);

  const handleSearchChange = (query: string, active: boolean) => {
    setSearchQuery(query);
    setIsSearchActive(active);
    if (!active) {
      setSelectedFilters([]);
    }
    // Close ItemDetail when search is activated
    if (active && selectedItem) {
      setSelectedItem(null);
    }
  };

  const handleFilterChange = (filters: string[]) => {
    const hasChanges =
      filters.length !== selectedFilters.length ||
      filters.some((f) => !selectedFilters.includes(f));

    setSelectedFilters(filters);

    if (hasChanges) {
      setIsFilterOpen(false);
      if (selectedItem) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAllFilters = () => {
    setSelectedFilters([]);
    setSelectedDesignerId(null);
  };

  const handleItemClick = (item: DesignerPost) => {
    setSelectedItem(item);
  };

  const handleBackToFeed = () => {
    setSelectedItem(null);
  };

  const handleDesignerClick = (designerId: string | null) => {
    setSelectedDesignerId(designerId);
  };

  const handleFollowToggle = (designerId: string) => {
    if (followedDesignerIds.has(designerId)) {
      unfollowDesigner(designerId);
    } else {
      followDesigner(designerId);
    }
  };

  const handleDiscoverClick = () => {
    // Scroll to recommended designers section
    const element = document.getElementById("recommended-designers");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      // In a real app, this would fetch new posts from the API
    }, 1000);
  };

  // Get related items for detail view
  const getRelatedItems = (currentItem: DesignerPost) => {
    return followingPosts.filter((post) => post.id !== currentItem.id).slice(0, 6);
  };

  // If item is selected, show detail view
  if (selectedItem) {
    return (
      <div className="min-h-screen bg-black overflow-x-hidden">
        <NavigationBar
          onSearchChange={handleSearchChange}
          onFilterClick={() => setIsFilterOpen(true)}
          searchQuery={searchQuery}
        />

        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          resultCount={isSearchActive ? filteredPosts.length : undefined}
        />

        <main className="pt-16 bg-black">
          <ItemDetail
            item={selectedItem}
            relatedItems={getRelatedItems(selectedItem)}
            onBack={handleBackToFeed}
            onItemClick={handleItemClick}
          />
        </main>
      </div>
    );
  }

  // Show empty state if no designers are followed
  if (!isLoading && followedDesigners.length === 0) {
    return (
      <div className="min-h-screen bg-black overflow-x-hidden">
        <NavigationBar
          onSearchChange={handleSearchChange}
          onFilterClick={() => setIsFilterOpen(true)}
          searchQuery={searchQuery}
        />

        <main className="pt-16">
          <FollowingEmptyState onDiscoverClick={handleDiscoverClick} />

          {/* Recommended Designers */}
          <div id="recommended-designers">
            <RecommendedDesigners
              designers={recommendedDesigners}
              followedIds={followedDesignerIds}
              onFollowToggle={handleFollowToggle}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <NavigationBar
        onSearchChange={handleSearchChange}
        onFilterClick={() => setIsFilterOpen(true)}
        searchQuery={searchQuery}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        resultCount={isSearchActive ? filteredPosts.length : undefined}
      />

      {/* Main Content */}
      <main className="pt-16">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Designer Avatar Bar */}
            <DesignerAvatarBar
              designers={followedDesigners}
              selectedDesignerId={selectedDesignerId}
              onDesignerClick={handleDesignerClick}
              getNewPostCount={getNewPostCount}
            />

            {/* Sort Options and Refresh Button */}
            {!isSearchActive && (
              <div className="max-w-[1600px] mx-auto px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Sort by:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy("recent")}
                        className={`px-4 py-1.5 text-sm transition-colors ${
                          sortBy === "recent"
                            ? "bg-white text-black"
                            : "bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        Recent
                      </button>
                      <button
                        onClick={() => setSortBy("popular")}
                        className={`px-4 py-1.5 text-sm transition-colors ${
                          sortBy === "popular"
                            ? "bg-white text-black"
                            : "bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        Popular
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-1.5 text-sm bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    <svg
                      className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            {isSearching ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="w-full max-w-[1600px] mx-auto px-6 py-6">
                <Masonry columnsCount={3} gutter="16px">
                  {filteredPosts.map((post) => (
                    <DesignerPostCard
                      key={post.id}
                      {...post}
                      onClick={() => handleItemClick(post)}
                    />
                  ))}
                </Masonry>
              </div>
            ) : (
              <EmptyState
                message={
                  searchQuery.trim() || selectedFilters.length > 0 || selectedDesignerId
                    ? "No posts match your filters."
                    : "No posts from designers you follow."
                }
                onClearFilters={
                  selectedFilters.length > 0 || selectedDesignerId
                    ? handleClearAllFilters
                    : undefined
                }
              />
            )}

            {/* Recommended Designers (shown at bottom) */}
            {!isSearchActive && recommendedDesigners.length > 0 && (
              <div id="recommended-designers" className="border-t border-white/10 mt-12">
                <RecommendedDesigners
                  designers={recommendedDesigners.slice(0, 3)}
                  followedIds={followedDesignerIds}
                  onFollowToggle={handleFollowToggle}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Comparison Bar and Modal */}
      <ComparisonBar
        count={comparisonList.length}
        onOpen={() => setIsComparisonOpen(true)}
        onClear={clearComparison}
      />
      <ProductComparison
        products={comparisonList}
        onRemove={removeFromComparison}
        onClear={clearComparison}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />
    </div>
  );
}
