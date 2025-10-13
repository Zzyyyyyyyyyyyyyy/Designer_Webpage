import { Loader2, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  designer: string;
  price: number;
  imageUrl: string;
  category: string;
  featured: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
}

export function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // BACKEND API PLACEHOLDER: Add to cart
    // TODO: Implement POST /api/cart/add with productId
    console.log('Add to cart:', productId);
  };

  const handleAddToWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // BACKEND API PLACEHOLDER: Add to wishlist
    // TODO: Implement POST /api/wishlist/add with productId
    console.log('Add to wishlist:', productId);
  };

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Collections
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handpicked pieces from our most talented designers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
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

                {/* Overlay on Hover */}
                <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
                  hoveredId === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center gap-4">
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => handleAddToWishlist(product.id, e)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                  {product.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  by {product.designer}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    ${product.price}
                  </span>
                  {product.featured && (
                    <span className="text-xs text-yellow-500 font-medium">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/products" className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}