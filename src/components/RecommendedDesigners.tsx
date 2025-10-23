import { Designer } from "@/contexts/FollowingContext";
import { Check, Plus } from "lucide-react";

interface RecommendedDesignersProps {
  designers: Designer[];
  followedIds: Set<string>;
  onFollowToggle: (designerId: string) => void;
}

export function RecommendedDesigners({
  designers,
  followedIds,
  onFollowToggle,
}: RecommendedDesignersProps) {
  if (designers.length === 0) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-white mb-2">Suggested Designers</h2>
        <p className="text-gray-400">Discover talented designers you might enjoy following</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designers.map((designer) => {
          const isFollowing = followedIds.has(designer.id);

          return (
            <div
              key={designer.id}
              className="bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-colors"
            >
              {/* Designer Header */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={designer.avatar}
                  alt={designer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">{designer.name}</h3>
                    {designer.isVerified && (
                      <svg
                        className="w-4 h-4 text-blue-400 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">@{designer.username}</p>
                </div>
              </div>

              {/* Designer Bio */}
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{designer.bio}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                <span>
                  <span className="text-white font-medium">
                    {designer.followerCount.toLocaleString()}
                  </span>{" "}
                  followers
                </span>
                <span>
                  <span className="text-white font-medium">{designer.postCount}</span> posts
                </span>
              </div>

              {/* Follow Button */}
              <button
                onClick={() => onFollowToggle(designer.id)}
                className={`w-full py-2.5 font-medium transition-colors flex items-center justify-center gap-2 ${
                  isFollowing
                    ? "bg-white/10 text-white border border-white/20 hover:bg-white/5"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4" />
                    Following
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
