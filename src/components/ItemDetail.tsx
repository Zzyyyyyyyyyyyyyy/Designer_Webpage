import { useState, useEffect } from "react";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Scale, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FashionPost } from "./MasonryFeed";
import { DesignerPost } from "@/contexts/FollowingContext";
import { SizeGuide } from "./SizeGuide";
import { ShareProduct } from "./ShareProduct";
import { ProductQA } from "./ProductQA";
import { useComparison } from "@/contexts/ComparisonContext";
import { useCart } from "@/contexts/CartContext";
import { VideoPlayer } from "./VideoPlayer";

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

// Create a unified type that works with both FashionPost and DesignerPost
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
  const [isLiked, setIsLiked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { addToCart } = useCart();

  // Build media array (images + video)
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

  // Close fullscreen with ESC key
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-20 left-6 z-10 p-2 hover:opacity-70 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Page Container - Centered with max width */}
      <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-8 lg:py-12 bg-black">
        {/* Content Row - Gallery and Info as siblings */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Gallery Section - FULL BLEED COVER (do not change) */}
          <div className="w-full lg:flex-1 flex-shrink-0">
            {/* Main Media Container - Fixed height with contain */}
            <div
              className="relative bg-[#111] group flex items-center justify-center"
              style={{
                height: '80vh',
                minHeight: '560px',
              }}
            >
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
                  className="max-w-full max-h-full object-contain cursor-zoom-in"
                  onClick={handleImageClick}
                />
              )}

              {/* Media Navigation Arrows */}
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

            {/* Thumbnails - fixed size, does NOT affect main container height */}
            {mediaItems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-2">
                {mediaItems.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 bg-[#111] overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border border-white opacity-100"
                        : "border border-transparent opacity-75 hover:opacity-90"
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

          {/* Info Panel - Fill with max width, symmetric gutters */}
          <div className="w-full lg:flex-1 lg:max-w-[640px] flex-shrink-0">
            <div className="flex flex-col py-4 pr-4 lg:py-6 lg:pr-8">
              {/* Title */}
              <h1 className="text-white text-2xl lg:text-3xl mb-2">
                {item.caption}
              </h1>

              {/* Designer Name */}
              {"designerName" in item && item.designerName && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">
                    by <span className="font-medium text-white">{item.designerName}</span>
                  </p>
                </div>
              )}

              {/* Price - Always show */}
              <div className="mb-6">
                <p className="text-white text-xl">{item.price || "$0"}</p>
              </div>

              {/* Size Selector - Always show */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white text-sm uppercase tracking-wider">
                    Select Size
                  </label>
                  <SizeGuide category="clothing" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(item.sizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedSize === size
                          ? "border-white bg-white text-black font-semibold"
                          : "border-[#2a2a2a] text-white hover:border-white/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-white text-sm uppercase tracking-wider mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-[#2a2a2a] text-white rounded-lg hover:border-white/50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-[#2a2a2a] text-white rounded-lg hover:border-white/50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div className="mb-6">
                  <p className="text-[#b3b3b3] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              {/* CTA Buttons - Always show */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => {
                    if (!selectedSize) {
                      alert("Please select a size");
                      return;
                    }
                    addToCart({
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
                  }}
                  className="flex-1 bg-white text-black py-3 px-6 rounded-lg hover:bg-[#e0e0e0] transition-colors font-semibold"
                >
                  Add to Cart
                </button>
                <button
                  className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-5 h-5" />
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
                  className={`px-6 py-3 border rounded-lg transition-colors ${
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

              {/* Details Section */}
              {item.details && (
                <div className="border-t border-[#2a2a2a] pt-6 mt-8">
                  <h2 className="text-white text-sm uppercase tracking-wider mb-4">
                    Details
                  </h2>
                  <p className="text-[#b3b3b3] leading-relaxed whitespace-pre-line">
                    {item.details}
                  </p>
                </div>
              )}

              {/* Additional Info Sections - extend vertical space naturally */}
              <div className="border-t border-[#2a2a2a] pt-6 mt-8">
                <h2 className="text-white text-sm uppercase tracking-wider mb-4">
                  Shipping & Returns
                </h2>
                <p className="text-[#b3b3b3] leading-relaxed">
                  Free shipping on orders over $200. Returns accepted within 30 days of purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Q&A Section - Full width section */}
        <div className="w-full border-t border-[#2a2a2a] pt-12 mt-16">
          <ProductQA productId={item.id} />
        </div>

        {/* Related Items - Full width section */}
        {relatedItems.length > 0 && (
          <div className="w-full border-t border-[#2a2a2a] pt-12 mt-16 lg:mt-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-sm uppercase tracking-wider">
                More Like This
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  className="p-2 border border-[#2a2a2a] rounded-lg hover:border-white transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  className="p-2 border border-[#2a2a2a] rounded-lg hover:border-white transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              id="related-carousel"
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            >
              {relatedItems.map((relatedItem) => (
                <div
                  key={relatedItem.id}
                  onClick={() => onItemClick(relatedItem)}
                  className="flex-shrink-0 w-64 cursor-pointer group"
                >
                  <div className="bg-[#0f0f0f] rounded-lg overflow-hidden mb-2" style={{ aspectRatio: '4/5' }}>
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
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          style={{
            animation: 'fadeIn 160ms ease-out',
          }}
          onClick={handleCloseFullscreen}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-4 right-4 p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Zoom Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 rounded-full p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={zoomLevel <= 1}
              className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Media Navigation in Fullscreen */}
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

          {/* Fullscreen Image - FIT mode with zoom */}
          {!isVideo && (
            <div
              className="relative overflow-auto max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: 'scaleIn 160ms ease-out',
              }}
            >
              <ImageWithFallback
                src={currentMedia.url}
                alt={item.caption}
                className="object-contain"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 200ms ease-out',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                }}
              />
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 1023px) {
          .lg\\:flex-1 > div:first-child {
            height: 70vh !important;
            min-height: 360px !important;
          }
        }
        
        /* Responsive padding for PageContainer and ContentRow gap */
        @media (min-width: 1024px) {
          .lg\\:px-8 {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
          .lg\\:gap-8 {
            gap: 32px !important;
          }
          .lg\\:pr-8 {
            padding-right: 32px !important;
          }
          .lg\\:py-6 {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }
        }
        
        @media (max-width: 1023px) {
          .px-4 {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .gap-4 {
            gap: 16px !important;
          }
          .pr-4 {
            padding-right: 16px !important;
          }
          .py-4 {
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
        }

        /* Ensure no horizontal overflow */
        body {
          overflow-x: hidden;
          background-color: #000;
        }
      `}</style>
    </div>
  );
}
