import { UserPlus } from "lucide-react";

interface FollowingEmptyStateProps {
  onDiscoverClick?: () => void;
}

export function FollowingEmptyState({ onDiscoverClick }: FollowingEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <UserPlus className="w-10 h-10 text-white/60" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-medium text-white mb-3">
          Start Following Designers
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          Follow your favorite designers to see their latest work and never miss a new collection.
          Build your personalized feed of inspiring fashion content.
        </p>

        {/* CTA Button */}
        <button
          onClick={onDiscoverClick}
          className="px-8 py-3 bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          Discover Designers
        </button>
      </div>
    </div>
  );
}
