import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  title: string;
  designer: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // BACKEND API PLACEHOLDER: Fetch related products
    // TODO: Replace with actual API call to /api/products/:id/related
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);

        // Simulated API call - Replace with:
        // const response = await fetch(`/api/products/${currentProductId}/related?category=${category}`);
        // const data = await response.json();

        // Mock related products
        const mockProducts: Product[] = [
          {
            id: "2",
            title: "Abstract Art Print T-Shirt",
            designer: "Marcus Rivera",
            price: 65,
            imageUrl: "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?w=800",
            rating: 4.6,
            reviewCount: 89,
            inStock: true,
          },
          {
            id: "3",
            title: "Handcrafted Leather Bag",
            designer: "Elena Vasquez",
            price: 285,
            imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
            rating: 4.9,
            reviewCount: 156,
            inStock: true,
          },
          {
            id: "5",
            title: "Urban Streetwear Hoodie",
            designer: "Alex Kim",
            price: 95,
            imageUrl: "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?w=800",
            rating: 4.5,
            reviewCount: 203,
            inStock: true,
          },
          {
            id: "7",
            title: "Vintage Denim Jacket",
            designer: "Marcus Rivera",
            price: 145,
            imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
            rating: 4.6,
            reviewCount: 142,
            inStock: true,
          },
        ];

        setTimeout(() => {
          setProducts(mockProducts.filter((p) => p.id !== currentProductId));
          setIsLoading(false);
        }, 300);

      } catch (error) {
        console.error('Error fetching related products:', error);
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, category]);

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    // BACKEND API PLACEHOLDER: Add to cart
    // TODO: Implement POST /api/cart/add with { productId, quantity: 1 }
    console.log('Add to cart:', productId);
  };

  const handleAddToWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    // BACKEND API PLACEHOLDER: Add to wishlist
    // TODO: Implement POST /api/wishlist/add with { productId }
    console.log('Add to wishlist:', productId);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('related-products-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left'
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">You May Also Like</h2>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 bg-gray-900 rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">You May Also Like</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        id="related-products-container"
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="flex-shrink-0 w-72 group"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="bg-gray-900 rounded-xl overflow-hidden transition-transform hover:scale-105">
              {/* Product Image */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Quick Actions on Hover */}
                <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
                  hoveredId === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={!product.inStock}
                      className={`flex items-center gap-2 px-6 py-2 bg-white text-black font-semibold rounded-lg transition-colors ${
                        product.inStock ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button
                      onClick={(e) => handleAddToWishlist(product.id, e)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                  {product.title}
                </h3>

                <p className="text-sm text-gray-400 mb-3">
                  by {product.designer}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-white ml-1">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-white">
                  ${product.price}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* BACKEND API PLACEHOLDER: Related products */}
      {/* TODO: Implement GET /api/products/:id/related?category=:category */}
    </div>
  );
}
