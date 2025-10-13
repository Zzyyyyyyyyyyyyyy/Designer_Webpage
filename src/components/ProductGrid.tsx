import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/pages/ProductListPage";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // BACKEND API PLACEHOLDER: Add to cart
    // TODO: Implement POST /api/cart/add with { productId, quantity: 1 }
    console.log('Add to cart:', productId);
  };

  const handleAddToWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // BACKEND API PLACEHOLDER: Add to wishlist
    // TODO: Implement POST /api/wishlist/add with { productId }
    console.log('Add to wishlist:', productId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="group bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
          onMouseEnter={() => setHoveredId(product.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Product Image */}
          <div className="aspect-[3/4] overflow-hidden relative">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                  Featured
                </span>
              )}
              {!product.inStock && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  Sold Out
                </span>
              )}
            </div>

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
            <div className="mb-2">
              <span className="text-xs text-gray-500">{product.category}</span>
            </div>

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
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                ${product.price}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}