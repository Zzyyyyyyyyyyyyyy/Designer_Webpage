import { useState, useEffect } from "react";
import { X, Scale, ShoppingCart, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  sizes?: string[];
  description?: string;
  material?: string;
  careInstructions?: string;
  category?: string;
}

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductComparison({ products, onRemove, onClear, isOpen, onClose }: ProductComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setSelectedProducts(products);
  }, [products]);

  const handleAddToCart = (productId: string) => {
    // BACKEND API PLACEHOLDER: Add to cart
    // TODO: Implement POST /api/cart/add with { productId }
    console.log("Add to cart:", productId);
  };

  const handleAddToWishlist = (productId: string) => {
    // BACKEND API PLACEHOLDER: Add to wishlist
    // TODO: Implement POST /api/wishlist/add with { productId }
    console.log("Add to wishlist:", productId);
  };

  const comparisonAttributes = [
    { key: "price", label: "Price" },
    { key: "sizes", label: "Available Sizes" },
    { key: "material", label: "Material" },
    { key: "category", label: "Category" },
    { key: "careInstructions", label: "Care Instructions" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-900 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Scale className="w-6 h-6" />
              Product Comparison
            </DialogTitle>
            {selectedProducts.length > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </DialogHeader>

        {selectedProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Scale className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products to Compare</h3>
            <p className="text-gray-400">
              Add products to comparison to see them side by side
            </p>
          </div>
        ) : (
          <div className="mt-6">
            {/* Product Images and Names */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, minmax(0, 1fr))` }}>
              {selectedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-2 right-2 z-10 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className="p-2 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="border-t border-gray-900 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Specifications</h4>
              <div className="space-y-4">
                {comparisonAttributes.map((attr) => (
                  <div key={attr.key} className="border-b border-gray-900 pb-4">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, minmax(0, 1fr))` }}>
                      <div className="col-span-full mb-2">
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                          {attr.label}
                        </span>
                      </div>
                      {selectedProducts.map((product) => {
                        const value = product[attr.key as keyof Product];
                        return (
                          <div key={product.id} className="text-sm text-gray-300">
                            {Array.isArray(value) ? (
                              <div className="flex flex-wrap gap-1">
                                {value.map((item, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-900/80 rounded text-xs">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : value ? (
                              <span>{value}</span>
                            ) : (
                              <span className="text-gray-600">Not specified</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Description */}
                <div className="border-b border-gray-900 pb-4">
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, minmax(0, 1fr))` }}>
                    <div className="col-span-full mb-2">
                      <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Description
                      </span>
                    </div>
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="text-sm text-gray-300">
                        {product.description || <span className="text-gray-600">No description</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Floating Comparison Bar Component
interface ComparisonBarProps {
  count: number;
  onOpen: () => void;
  onClear: () => void;
}

export function ComparisonBar({ count, onOpen, onClear }: ComparisonBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4">
      <div className="bg-white text-black rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          <span className="font-semibold">{count} {count === 1 ? 'Product' : 'Products'} to Compare</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpen}
            className="px-4 py-2 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            Compare
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-full hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// BACKEND API PLACEHOLDER: Product comparison
// TODO: Implement POST /api/comparison/add for adding products to comparison
// TODO: Implement DELETE /api/comparison/remove/:id for removing products
// TODO: Implement GET /api/comparison for fetching comparison list
// TODO: Add local storage persistence for comparison list
// TODO: Implement comparison limit (e.g., max 4 products)
