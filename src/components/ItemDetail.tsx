import { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Scale, Play, UserPlus, UserCheck } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FashionPost } from "./MasonryFeed";
import { DesignerPost } from "@/contexts/FollowingContext";
import { SizeGuide } from "./SizeGuide";
import { ShareProduct } from "./ShareProduct";
import { ProductQA } from "./ProductQA";
import { useComparison } from "@/contexts/ComparisonContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { VideoPlayer } from "./VideoPlayer";
import { useFollowing } from "@/contexts/FollowingContext";
import { useAuth } from "@/contexts/AuthContext";

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

type ItemDetailItem = (FashionPost | DesignerPost) & {
  images?: string[];
  videoUrl?: string;
  price?: string;
  sizes?: string[];
  description?: string;
  details?: string;
  userName?: string;
  isProduct?: boolean;
};

interface ItemDetailProps {
  item: ItemDetailItem;
  relatedItems: (FashionPost | DesignerPost)[];
  onBack: () => void;
  onItemClick: (item: FashionPost | DesignerPost) => void;
}

export function ItemDetail({ item, relatedItems, onBack, onItemClick }: ItemDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isFollowing, followDesigner, unfollowDesigner } = useFollowing();
  const { user } = useAuth();

  const isProductInWishlist = isInWishlist(item.id);

  // Get designer ID from item
  const designerId = "designerId" in item ? item.designerId : ("user_id" in item ? item.user_id : null);
  const designerName = "designerName" in item ? item.designerName : ("userName" in item ? item.userName : "Unknown");
  const designerAvatar = "designerAvatar" in item ? item.designerAvatar : undefined;
  const isFollowingDesigner = designerId ? isFollowing(designerId) : false;

  const handleFollowToggle = async () => {
    if (!user) {
      alert("Please log in to follow designers");
      return;
    }
    if (!designerId) return;

    try {
      if (isFollowingDesigner) {
        await unfollowDesigner(designerId);
      } else {
        await followDesigner(designerId);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const mediaItems: MediaItem[] = [
    ...(item.images || [item.imageUrl]).map((url) => ({ type: "image" as const, url })),
    ...(item.videoUrl ? [{ type: "video" as const, url: item.videoUrl, thumbnail: item.images?.[0] || item.imageUrl }] : []),
  ];

  const currentMedia = mediaItems[selectedImageIndex];
  const isVideo = currentMedia?.type === "video";

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("related-carousel");
    if (container) {
      const scrollAmount = 300;
      const currentScroll = container.scrollLeft;
      const newPosition = direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
    }
  };

  const handleImageClick = () => {
    setIsFullscreen(true);
    setZoomLevel(1);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        handleCloseFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-20 left-6 z-10 p-2 hover:opacity-70 transition-opacity"
        aria-label="Go back"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-zinc-900 rounded-lg overflow-hidden aspect-[4/5] lg:aspect-square group">
              {isVideo ? (
                <VideoPlayer
                  videoUrl={currentMedia.url}
                  poster={currentMedia.thumbnail}
                  className="w-full h-full"
                />
              ) : (
                <ImageWithFallback
                  src={currentMedia.url}
                  alt={item.caption}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={handleImageClick}
                />
              )}

              {/* Navigation Arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {mediaItems.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 bg-zinc-900 rounded overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "ring-2 ring-white"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ImageWithFallback
                      src={media.type === "video" ? (media.thumbnail || media.url) : media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {media.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-6 h-6 text-white" fill="currentColor" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {item.caption}
              </h1>
            </div>

            {/* Designer Card */}
            {designerId && designerId !== user?.id && (
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-3">
                  {designerAvatar ? (
                    <img
                      src={designerAvatar}
                      alt={designerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {designerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{designerName}</p>
                    <p className="text-gray-400 text-sm">Designer</p>
                  </div>
                </div>
                <button
                  onClick={handleFollowToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isFollowingDesigner
                      ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {isFollowingDesigner ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Price */}
            <div className="text-2xl font-bold text-white">
              {item.price || "$0"}
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white uppercase tracking-wider">
                  Select Size
                </label>
                <SizeGuide category="clothing" />
              </div>
              <div className="flex flex-wrap gap-2">
                {(item.sizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? "border-white bg-white text-black"
                        : "border-gray-700 text-white hover:border-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-white uppercase tracking-wider mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:border-gray-500 transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-700 text-white rounded-lg hover:border-gray-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={async () => {
                  if (!selectedSize) {
                    alert("Please select a size");
                    return;
                  }
                  try {
                    await addToCart({
                      productId: item.id,
                      title: item.caption,
                      imageUrl: item.imageUrl,
                      price: item.price || "$0",
                      size: selectedSize,
                      quantity,
                      designerName: "designerName" in item ? item.designerName : undefined,
                      designerUsername: "designerUsername" in item ? item.designerUsername : undefined,
                    });
                    alert(`Added ${quantity} item(s) to cart!`);
                  } catch (error: any) {
                    console.error("Failed to add to cart:", error);
                    alert(`Failed to add to cart: ${error.message}`);
                  }
                }}
                className="flex-1 bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Add to Cart
              </button>
              <button
                onClick={async () => {
                  try {
                    await toggleWishlist({
                      productId: item.id,
                      title: item.caption,
                      imageUrl: item.imageUrl,
                      price: parseFloat(item.price?.replace('$', '') || '0'),
                      designer: "designerName" in item ? item.designerName || "Unknown" : "Unknown",
                      addedAt: new Date().toISOString(),
                    });
                  } catch (error: any) {
                    console.error("Failed to toggle wishlist:", error);
                    alert(`Failed to update wishlist: ${error.message}`);
                  }
                }}
                className={`p-3 border-2 rounded-lg transition-all ${
                  isProductInWishlist
                    ? 'border-white bg-white text-black hover:bg-gray-100'
                    : 'border-white text-white hover:bg-white/10'
                }`}
                aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 transition-all ${isProductInWishlist ? 'fill-black' : ''}`} />
              </button>
              <button
                onClick={() => {
                  const productData = {
                    id: item.id,
                    title: item.caption,
                    imageUrl: item.imageUrl,
                    price: item.price || "",
                    sizes: item.sizes,
                    description: item.description,
                    category: "Fashion",
                  };
                  if (isInComparison(item.id)) {
                    removeFromComparison(item.id);
                  } else {
                    addToComparison(productData);
                  }
                }}
                className={`p-3 border-2 rounded-lg transition-all ${
                  isInComparison(item.id)
                    ? "border-white bg-white text-black"
                    : "border-white text-white hover:bg-white/10"
                }`}
                aria-label="Add to comparison"
              >
                <Scale className="w-5 h-5" />
              </button>
              <ShareProduct productTitle={item.caption} />
            </div>

            {/* Details */}
            {item.details && (
              <div className="pt-6 border-t border-gray-800">
                <h2 className="text-sm font-medium text-white uppercase tracking-wider mb-3">
                  Details
                </h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {item.details}
                </p>
              </div>
            )}

            {/* Shipping Info */}
            <div className="pt-6 border-t border-gray-800">
              <h2 className="text-sm font-medium text-white uppercase tracking-wider mb-3">
                Shipping & Returns
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Free shipping on orders over $200. Returns accepted within 30 days of purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Product Q&A */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <ProductQA productId={item.id} />
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-white uppercase tracking-wider">
                More Like This
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  className="p-2 border border-gray-800 rounded-lg hover:border-white transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  className="p-2 border border-gray-800 rounded-lg hover:border-white transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              id="related-carousel"
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            >
              {relatedItems.map((relatedItem) => (
                <div
                  key={relatedItem.id}
                  onClick={() => onItemClick(relatedItem)}
                  className="flex-shrink-0 w-64 cursor-pointer group"
                >
                  <div className="bg-zinc-900 rounded-lg overflow-hidden mb-2 aspect-[4/5]">
                    <ImageWithFallback
                      src={relatedItem.imageUrl}
                      alt={relatedItem.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-white text-sm line-clamp-2">
                    {relatedItem.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-200"
          onClick={handleCloseFullscreen}
        >
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-4 right-4 p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 rounded-full p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={zoomLevel <= 1}
              className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="px-3 flex items-center text-sm text-white">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              disabled={zoomLevel >= 3}
              className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {mediaItems.length > 1 && !isVideo && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {!isVideo && (
            <div
              className="relative overflow-auto max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={currentMedia.url}
                alt={item.caption}
                className="object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel})`,
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
