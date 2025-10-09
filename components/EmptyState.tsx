import { ImageOff } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  showIcon?: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({
  message = "No results for your search.",
  showIcon = false,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
      {showIcon && <ImageOff className="w-16 h-16 mb-4 opacity-40" />}
      <p className="mb-4">{message}</p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-white hover:opacity-70 transition-opacity underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
