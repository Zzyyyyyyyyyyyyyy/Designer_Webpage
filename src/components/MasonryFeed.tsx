import { ResponsiveMasonry } from "react-responsive-masonry";
import Masonry from "react-responsive-masonry";
import { DesignerPostCard } from "./DesignerPostCard";

export interface FashionPost {
  id: string;
  imageUrl: string;
  caption: string;
  designerId: string;
  designerName: string;
  designerAvatar: string;
  designerUsername: string;
  timestamp: number;
  likes: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface MasonryFeedProps {
  posts: FashionPost[];
  onItemClick?: (post: FashionPost) => void;
}

export function MasonryFeed({ posts, onItemClick }: MasonryFeedProps) {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3, 1280: 4 }}
      >
        <Masonry gutter="1rem">
          {posts.map((post) => (
            <DesignerPostCard
              key={post.id}
              id={post.id}
              imageUrl={post.imageUrl}
              caption={post.caption}
              designerAvatar={post.designerAvatar}
              designerName={post.designerName}
              designerUsername={post.designerUsername}
              timestamp={post.timestamp}
              likes={post.likes}
              saves={post.saves}
              isLiked={post.isLiked}
              isSaved={post.isSaved}
              onClick={() => onItemClick?.(post)}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
