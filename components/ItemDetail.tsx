import { useState, useEffect } from "react";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FashionPost } from "./MasonryFeed";

interface ItemDetailProps {
  item: FashionPost & {
    images?: string[];
    price?: string;
    sizes?: string[];
    description?: string;
    details?: string;
    userName?: string;
    isProduct?: boolean;
  };
  relatedItems: FashionPost[];
  onBack: () => void;
  onItemClick: (item: FashionPost) => void;
}

export function ItemDetail({ item, relatedItems, onBack, onItemClick }: ItemDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const images = item.images || [item.imageUrl];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("related-carousel");
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === "left" 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
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
            {/* Main Image Container - Fixed height with cover */}
            <div 
              className="relative bg-[#111] overflow-hidden group cursor-zoom-in"
              style={{
                height: '80vh',
                minHeight: '560px',
              }}
              onClick={handleImageClick}
            >
              {/* Image with COVER behavior - fills container, crops edges */}
              <ImageWithFallback
                src={images[selectedImageIndex]}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation Arrows */}
              {images.length > 1 && (
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
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-[#111] overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border border-white opacity-100"
                        : "border border-transparent opacity-75 hover:opacity-90"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Panel - Fill with max width, symmetric gutters */}
          <div className="w-full lg:flex-1 lg:max-w-[640px] flex-shrink-0">
            <div className="flex flex-col py-4 pr-4 lg:py-6 lg:pr-8">
              {/* Title */}
              <h1 className="text-white text-2xl lg:text-3xl mb-4">
                {item.caption}
              </h1>

              {item.isProduct ? (
                <>
                  {/* Price */}
                  {item.price && (
                    <div className="mb-6">
                      <p className="text-white text-xl">{item.price}</p>
                    </div>
                  )}

                  {/* Size Selector */}
                  {item.sizes && item.sizes.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-white text-sm mb-3 uppercase tracking-wider">
                        Select Size
                      </label>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-white transition-colors"
                      >
                        <option value="">Choose a size</option>
                        {item.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <div className="mb-6">
                      <p className="text-[#b3b3b3] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex gap-3 mb-8">
                    <button className="flex-1 bg-white text-black py-3 px-6 rounded-lg hover:bg-[#e0e0e0] transition-colors">
                      Add to Bag
                    </button>
                    <button 
                      className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* User Info */}
                  {item.userName && (
                    <div className="mb-4">
                      <p className="text-white">
                        by <span className="font-semibold">{item.userName}</span>
                      </p>
                    </div>
                  )}

                  {/* Caption */}
                  <div className="mb-6">
                    <p className="text-[#b3b3b3] leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  {/* Social Actions */}
                  <div className="flex gap-3 mb-8">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-full hover:bg-[#3a3a3a] transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`}
                      />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-full hover:bg-[#3a3a3a] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>Comment</span>
                    </button>
                  </div>
                </>
              )}

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

          {/* Image Navigation in Fullscreen */}
          {images.length > 1 && (
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
          <div 
            className="relative overflow-auto max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'scaleIn 160ms ease-out',
            }}
          >
            <ImageWithFallback
              src={images[selectedImageIndex]}
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
