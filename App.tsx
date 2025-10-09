import { NavigationBar } from "./components/NavigationBar";
import { MasonryFeed, FashionPost } from "./components/MasonryFeed";
import { FilterPanel } from "./components/FilterPanel";
import { EmptyState } from "./components/EmptyState";
import { ItemDetail } from "./components/ItemDetail";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Extended FashionPost type for detail view
interface ExtendedFashionPost extends FashionPost {
  images?: string[];
  price?: string;
  sizes?: string[];
  description?: string;
  details?: string;
  userName?: string;
  isProduct?: boolean;
}

// Mock fashion posts data with extended details
const mockPosts: ExtendedFashionPost[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1653875842174-429c1b467548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDAxMzY1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Minimal Monochrome: Structured silhouettes in black",
    isProduct: true,
    price: "$425",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A minimalist approach to contemporary fashion. This structured piece features clean lines and a timeless silhouette.",
    details: "Material: 100% Wool\nMade in Italy\nDry clean only\nModel is 5'10\" and wears size S",
    images: [
      "https://images.unsplash.com/photo-1653875842174-429c1b467548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDAxMzY1NHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5OTQ3NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5OTQ3NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Luxury tailored coat with refined details",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwc3R5bGV8ZW58MXx8fHwxNzYwMDE0MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Urban streetwear: Oversized hoodies and clean lines",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc2MDA0NTE0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Designer accessories for the modern minimalist",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3V0Zml0fGVufDF8fHx8MTc2MDA0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Essential minimalist outfit: Less is more",
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1704208316515-a32f81e373ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU5OTc1MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "High fashion editorial: Bold statement pieces",
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3N8ZW58MXx8fHwxNzU5OTUwNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Elegant evening dress with timeless appeal",
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1727686679920-79be3ffe07d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MDA0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Modern fashion editorial with architectural lines",
  },
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1664851449299-cc7db4ea9858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMHJ1bndheXxlbnwxfHx8fDE3NTk5OTY3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Runway ready: Avant-garde meets wearable",
  },
  {
    id: "10",
    imageUrl: "https://images.unsplash.com/photo-1641926362132-f820c474acfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzdHlsZXxlbnwxfHx8fDE3NjAwNDUxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Contemporary style for the creative soul",
  },
  {
    id: "11",
    imageUrl: "https://images.unsplash.com/photo-1625622176700-1ad9e716c8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNob2VzfGVufDF8fHx8MTc2MDAxMTUzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Designer footwear: Every step is a statement",
  },
  {
    id: "12",
    imageUrl: "https://images.unsplash.com/photo-1526632503813-6f479409d7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGljJTIwb3V0Zml0fGVufDF8fHx8MTc1OTk1MTIyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Chic everyday outfit: Effortless elegance",
  },
];

export default function App() {
  const [posts, setPosts] = useState<ExtendedFashionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ExtendedFashionPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExtendedFashionPost | null>(null);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (!isSearchActive) {
      setFilteredPosts(posts);
      return;
    }

    // Simulate search delay
    setIsSearching(true);
    const timer = setTimeout(() => {
      let results = posts;

      // Filter by search query
      if (searchQuery.trim()) {
        results = results.filter((post) =>
          post.caption.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by selected categories
      if (selectedFilters.length > 0) {
        results = results.filter((post) => {
          const lowerCaption = post.caption.toLowerCase();
          return selectedFilters.some((filter) =>
            lowerCaption.includes(filter.toLowerCase())
          );
        });
      }

      setFilteredPosts(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilters, posts, isSearchActive]);

  const handleSearchChange = (query: string, active: boolean) => {
    setSearchQuery(query);
    setIsSearchActive(active);
    if (!active) {
      setSelectedFilters([]);
    }
  };

  const handleFilterChange = (filters: string[]) => {
    const hasChanges = 
      filters.length !== selectedFilters.length ||
      filters.some((f) => !selectedFilters.includes(f));
    
    setSelectedFilters(filters);
    
    if (hasChanges) {
      setIsFilterOpen(false);
    }
  };

  const handleClearAllFilters = () => {
    setSelectedFilters([]);
  };

  const handleItemClick = (item: FashionPost) => {
    setSelectedItem(item as ExtendedFashionPost);
  };

  const handleBackToFeed = () => {
    setSelectedItem(null);
  };

  // Get related items (exclude current item)
  const getRelatedItems = (currentItem: ExtendedFashionPost) => {
    return posts.filter((post) => post.id !== currentItem.id).slice(0, 6);
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
        ) : isSearchActive ? (
          <div className="py-6">
            {isSearching ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <MasonryFeed posts={filteredPosts} onItemClick={handleItemClick} />
            ) : (
              <EmptyState
                message={
                  searchQuery.trim() || selectedFilters.length > 0
                    ? "No results for your search."
                    : "Start typing to search for fashion posts."
                }
                onClearFilters={
                  selectedFilters.length > 0 ? handleClearAllFilters : undefined
                }
              />
            )}
          </div>
        ) : (
          <MasonryFeed posts={posts} onItemClick={handleItemClick} />
        )}
      </main>
    </div>
  );
}
