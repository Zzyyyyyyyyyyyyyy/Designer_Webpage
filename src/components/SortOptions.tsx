import { ArrowUpDown } from "lucide-react";

interface SortOptionsProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  resultCount: number;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export function SortOptions({ sortBy, onSortChange, resultCount }: SortOptionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-900 rounded-lg">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400">
          Showing <span className="text-white font-semibold">{resultCount}</span> results
        </span>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-gray-400 text-sm">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}