import { Heart, Bookmark } from "lucide-react";
import { useState, memo } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DesignerPostCardProps {
  imageUrl: string;
  caption: string;
  id: string;
  designerAvatar: string;
  designerName: string;
  designerUsername: string;
  timestamp: number;
  likes?: number;
  saves?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onClick?: () => void;
  onLike?: () => void;
  onSave?: () => void;
}

// Helper function to format timestamp
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export const DesignerPostCard = memo(function DesignerPostCard({
  imageUrl,
  caption,
  id,
  designerAvatar,
  designerName,
  designerUsername,
  timestamp,
  likes = 0,
  saves = 0,
  isLiked: initialIsLiked = false,
  isSaved: initialIsSaved = false,
  onClick,
  onLike,
  onSave,
}: DesignerPostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likesCount, setLikesCount] = useState(likes);
  const [savesCount, setSavesCount] = useState(saves);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
    onLike?.();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    setSavesCount(prev => newIsSaved ? prev + 1 : prev - 1);
    onSave?.();
  };

  return (
    <div
      className="group relative cursor-pointer animate-in fade-in duration-300"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-post-id={id}
    >
      {/* Designer Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <img
          src={designerAvatar}
          alt={designerName}
          className="w-8 h-8 rounded-full object-cover border border-white/20"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{designerUsername}</p>
        </div>
        <span className="text-gray-500 text-xs flex-shrink-0">
          {formatTimeAgo(timestamp)}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden bg-zinc-900 rounded-sm">
        <ImageWithFallback
          src={imageUrl}
          alt={caption}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-300">
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                title={isSaved ? "Unsave" : "Save"}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isSaved ? "fill-white text-white" : "text-white"
                  }`}
                />
              </button>
              <button
                onClick={handleLike}
                className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                title={isLiked ? "Unlike" : "Like"}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "fill-white text-white" : "text-white"
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Caption and Interaction Stats */}
      <div className="pt-2 pb-1 px-1">
        <p className="text-white text-sm line-clamp-2 opacity-90 mb-2">{caption}</p>

        {/* Stats - Always show */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="font-medium">{likesCount.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white text-white' : ''}`} />
            <span className="font-medium">{savesCount.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
});
