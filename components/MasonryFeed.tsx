import Masonry from "react-responsive-masonry";
import { FashionCard } from "./FashionCard";

export interface FashionPost {
  id: string;
  imageUrl: string;
  caption: string;
}

interface MasonryFeedProps {
  posts: FashionPost[];
  onItemClick?: (post: FashionPost) => void;
}

export function MasonryFeed({ posts, onItemClick }: MasonryFeedProps) {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-6">
      <Masonry columnsCount={3} gutter="16px">
        {posts.map((post) => (
          <FashionCard
            key={post.id}
            id={post.id}
            imageUrl={post.imageUrl}
            caption={post.caption}
            onClick={() => onItemClick?.(post)}
          />
        ))}
      </Masonry>
    </div>
  );
}
