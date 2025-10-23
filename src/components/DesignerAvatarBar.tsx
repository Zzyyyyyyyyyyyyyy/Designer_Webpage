import { Designer } from "@/contexts/FollowingContext";
import { Check } from "lucide-react";

interface DesignerAvatarBarProps {
  designers: Designer[];
  selectedDesignerId: string | null;
  onDesignerClick: (designerId: string | null) => void;
  getNewPostCount?: (designerId: string) => number;
}

export function DesignerAvatarBar({
  designers,
  selectedDesignerId,
  onDesignerClick,
  getNewPostCount,
}: DesignerAvatarBarProps) {
  const handleDesignerClick = (designerId: string) => {
    // If clicking the same designer, deselect
    if (selectedDesignerId === designerId) {
      onDesignerClick(null);
    } else {
      onDesignerClick(designerId);
    }
  };

  return (
    <div className="bg-black border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="py-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2">
            {/* All Posts option */}
            <button
              onClick={() => onDesignerClick(null)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 transition-opacity ${
                selectedDesignerId === null ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors ${
                  selectedDesignerId === null
                    ? "border-white bg-white/10"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="text-xs text-white font-medium">All Posts</span>
            </button>

            {/* Designer avatars */}
            {designers.map((designer) => {
              const isSelected = selectedDesignerId === designer.id;
              const newPostCount = getNewPostCount?.(designer.id) || 0;

              return (
                <button
                  key={designer.id}
                  onClick={() => handleDesignerClick(designer.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-200 ${
                    isSelected ? "opacity-100 scale-105" : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <div className="relative">
                    {/* Avatar container */}
                    <div
                      className={`w-16 h-16 rounded-full border-2 overflow-hidden transition-all ${
                        isSelected ? "border-white" : "border-white/20"
                      }`}
                    >
                      <img
                        src={designer.avatar}
                        alt={designer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-black">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}

                    {/* New post count badge */}
                    {!isSelected && newPostCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-black">
                        <span className="text-[10px] font-bold text-black">
                          {newPostCount > 9 ? "9+" : newPostCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Designer username */}
                  <span className="text-xs text-white font-medium max-w-[70px] truncate">
                    {designer.username}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
