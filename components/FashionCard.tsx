import { Heart } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FashionCardProps {
  imageUrl: string;
  caption: string;
  id: string;
  onClick?: () => void;
}

export function FashionCard({ imageUrl, caption, id, onClick }: FashionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-zinc-900">
        <ImageWithFallback
          src={imageUrl}
          alt={caption}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="absolute top-3 right-3 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-white text-white" : "text-white"
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="pt-2 pb-1 px-1">
        <p className="text-white text-sm line-clamp-2 opacity-90">{caption}</p>
      </div>
    </div>
  );
}
