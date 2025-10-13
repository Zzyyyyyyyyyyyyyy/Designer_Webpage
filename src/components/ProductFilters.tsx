import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Filters {
  categories: string[];
  priceRange: [number, number];
  designers: string[];
  tags: string[];
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const categories = ["Clothing", "Outerwear", "Accessories", "Dresses", "Footwear"];
const designers = [
  { id: "designer-1", name: "Sophie Chen" },
  { id: "designer-2", name: "Marcus Rivera" },
  { id: "designer-3", name: "Elena Vasquez" },
  { id: "designer-4", name: "Yuki Tanaka" },
  { id: "designer-5", name: "Alex Kim" },
];

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["category", "price", "availability"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleDesignerToggle = (designerId: string) => {
    const newDesigners = filters.designers.includes(designerId)
      ? filters.designers.filter(d => d !== designerId)
      : [...filters.designers, designerId];
    onFilterChange({ ...filters, designers: newDesigners });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: [0, 1000],
      designers: [],
      tags: [],
      inStockOnly: false,
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 border-b border-gray-800 pb-6">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between mb-4"
        >
          <span className="font-semibold text-white">Category</span>
          {expandedSections.has("category") ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has("category") && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-white"
                />
                <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 border-b border-gray-800 pb-6">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between mb-4"
        >
          <span className="font-semibold text-white">Price Range</span>
          {expandedSections.has("price") ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has("price") && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Min: ${filters.priceRange[0]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Max: ${filters.priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Designer Filter */}
      <div className="mb-6 border-b border-gray-800 pb-6">
        <button
          onClick={() => toggleSection("designer")}
          className="w-full flex items-center justify-between mb-4"
        >
          <span className="font-semibold text-white">Designer</span>
          {expandedSections.has("designer") ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has("designer") && (
          <div className="space-y-2">
            {designers.map((designer) => (
              <label key={designer.id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.designers.includes(designer.id)}
                  onChange={() => handleDesignerToggle(designer.id)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-white"
                />
                <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
                  {designer.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div>
        <button
          onClick={() => toggleSection("availability")}
          className="w-full flex items-center justify-between mb-4"
        >
          <span className="font-semibold text-white">Availability</span>
          {expandedSections.has("availability") ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has("availability") && (
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-white"
            />
            <span className="ml-3 text-gray-300 group-hover:text-white transition-colors">
              In Stock Only
            </span>
          </label>
        )}
      </div>

      {/* BACKEND API PLACEHOLDER: Filter options */}
      {/* TODO: Fetch categories from /api/categories */}
      {/* TODO: Fetch designers from /api/designers */}
    </div>
  );
}