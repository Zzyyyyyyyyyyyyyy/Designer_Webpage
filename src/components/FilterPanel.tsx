import { X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import { FilterOption } from "./FilterOption";
import { useState, useEffect } from "react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  resultCount?: number;
}

const filterOptions = [
  { id: "clothing", label: "Clothing" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
  { id: "jewelry", label: "Jewelry" },
  { id: "bags", label: "Bags" },
  { id: "outerwear", label: "Outerwear" },
  { id: "dresses", label: "Dresses" },
  { id: "streetwear", label: "Streetwear" },
  { id: "luxury", label: "Luxury" },
  { id: "minimal", label: "Minimal" },
];

export function FilterPanel({
  isOpen,
  onClose,
  selectedFilters,
  onFilterChange,
  resultCount,
}: FilterPanelProps) {
  const [tempFilters, setTempFilters] = useState<string[]>(selectedFilters);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempFilters(selectedFilters);
      setHasChanges(false);
    }
  }, [isOpen, selectedFilters]);

  useEffect(() => {
    const filtersChanged =
      tempFilters.length !== selectedFilters.length ||
      tempFilters.some((f) => !selectedFilters.includes(f));
    setHasChanges(filtersChanged);
  }, [tempFilters, selectedFilters]);

  const handleToggle = (filterId: string) => {
    if (tempFilters.includes(filterId)) {
      setTempFilters(tempFilters.filter((id) => id !== filterId));
    } else {
      setTempFilters([...tempFilters, filterId]);
    }
  };

  const handleClearAll = () => {
    setTempFilters([]);
  };

  const handleApply = () => {
    onFilterChange(tempFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="bg-[#0f0f0f] border-l border-[#2a2a2a] w-full sm:w-[520px] sm:max-w-[520px] p-0 flex flex-col"
      >
        {/* Hidden title for accessibility */}
        <SheetTitle className="sr-only">Filters</SheetTitle>
        {/* Hidden description for accessibility */}
        <SheetDescription className="sr-only">
          Filter fashion posts by category
        </SheetDescription>

        {/* Header with close button */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-white text-xl">Filters</h2>
            <p className="text-[#b3b3b3] text-sm mt-1">
              Refine your search results
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 transition-opacity p-2 -mr-2 -mt-2"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Separator */}
        <div className="h-px bg-[#2a2a2a] flex-shrink-0" />

        {/* Filter options - Two columns on desktop, single column on mobile */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {filterOptions.map((option) => (
              <FilterOption
                key={option.id}
                id={option.id}
                label={option.label}
                selected={tempFilters.includes(option.id)}
                onSelectedChange={() => handleToggle(option.id)}
              />
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-[#2a2a2a] flex-shrink-0" />

        {/* Bottom sticky bar */}
        <div className="flex-shrink-0 h-14 px-6 flex items-center justify-between bg-[#0f0f0f]">
          {/* Left: Clear all */}
          <button
            onClick={handleClearAll}
            disabled={tempFilters.length === 0}
            className="text-sm text-white hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Clear all
          </button>

          {/* Center: Result count (optional) */}
          {resultCount !== undefined && (
            <span className="text-sm text-[#b3b3b3]">
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </span>
          )}

          {/* Right: Apply button */}
          <button
            onClick={handleApply}
            disabled={!hasChanges}
            className="px-6 py-2 bg-white text-black rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e0e0e0] disabled:hover:bg-white"
          >
            Apply filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
