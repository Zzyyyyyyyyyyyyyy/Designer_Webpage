import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { ProductReviews } from "@/components/ProductReviews";
import { RelatedProducts } from "@/components/RelatedProducts";
import { SizeGuide } from "@/components/SizeGuide";
import { ProductDetails } from "@/components/ProductDetails";
import { ShareProduct } from "@/components/ShareProduct";
import { ProductQA } from "@/components/ProductQA";
import { useComparison } from "@/contexts/ComparisonContext";

interface Product {
  id: string;
  title: string;
  designer: string;
  designerId: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  material: string;
  careInstructions: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  useEffect(() => {
    // BACKEND API PLACEHOLDER: Fetch product details
    // TODO: Replace with actual API call to /api/products/:id
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);

        // Simulated API call - Replace with:
        // const response = await fetch(`/api/products/${productId}`);
        // const data = await response.json();

        // Mock product data
        const mockProduct: Product = {
          id: productId || "1",
          title: "Minimalist Black Coat",
          designer: "Sophie Chen",
          designerId: "designer-1",
          price: 425,
          images: [
            "https://images.unsplash.com/photo-1653875842174-429c1b467548?w=800",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
            "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800",
          ],
          category: "Outerwear",
          description: "A timeless minimalist coat crafted from premium wool blend. This elegant piece features a clean silhouette with a tailored fit that flatters any body type. Perfect for both casual and formal occasions, this coat is designed to be a staple in your wardrobe for years to come.",
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["Black", "Navy", "Charcoal"],
          tags: ["minimalist", "luxury", "winter"],
          rating: 4.8,
          reviewCount: 124,
          inStock: true,
          stockCount: 15,
          material: "80% Wool, 20% Polyester",
          careInstructions: "Dry clean only. Do not bleach. Cool iron if needed.",
        };

        // Mock reviews data
        const mockReviews: Review[] = [
          {
            id: "1",
            userId: "user-1",
            userName: "Emma Wilson",
            rating: 5,
            comment: "Absolutely love this coat! The quality is exceptional and it fits perfectly. Worth every penny.",
            date: "2024-01-15",
            verified: true,
          },
          {
            id: "2",
            userId: "user-2",
            userName: "Michael Chen",
            rating: 4,
            comment: "Great coat, very stylish. Only wish it came in more colors.",
            date: "2024-01-10",
            verified: true,
          },
        ];

        setTimeout(() => {
          setProduct(mockProduct);
          setReviews(mockReviews);
          setSelectedSize(mockProduct.sizes[0]);
          setSelectedColor(mockProduct.colors[0]);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error('Error fetching product details:', error);
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    // BACKEND API PLACEHOLDER: Add to cart
    // TODO: Implement POST /api/cart/add with { productId, quantity, size, color }
    console.log('Add to cart:', { productId, quantity, size: selectedSize, color: selectedColor });
  };

  const handleToggleWishlist = () => {
    // BACKEND API PLACEHOLDER: Toggle wishlist
    // TODO: Implement POST /api/wishlist/toggle with { productId }
    setIsInWishlist(!isInWishlist);
    console.log('Toggle wishlist:', productId);
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? (product?.images.length || 1) - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === (product?.images.length || 1) - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Product not found</h2>
          <Link to="/products" className="text-gray-400 hover:text-white">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-white">{product.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden group">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-white scale-95'
                      : 'border-transparent hover:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Designer */}
            <div>
              <Link
                to={`/designers/${product.designerId}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {product.designer}
              </Link>
              <h1 className="text-4xl font-bold text-white mt-2">{product.title}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-semibold">{product.rating}</span>
              </div>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-white">${product.price}</div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-500 font-semibold">In Stock ({product.stockCount} available)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-red-500 font-semibold">Out of Stock</span>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white font-semibold">Select Size</label>
                <SizeGuide category={product.category} />
              </div>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-white bg-white text-black'
                        : 'border-gray-700 text-white hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">Select Color</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                      selectedColor === color
                        ? 'border-white bg-white text-black'
                        : 'border-gray-700 text-white hover:border-gray-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-white font-semibold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  -
                </button>
                <span className="text-white font-semibold text-xl w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-lg transition-colors ${
                  product.inStock
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isInWishlist
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-700 text-white hover:border-gray-500'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={() => {
                  const productData = {
                    id: product.id,
                    title: product.title,
                    imageUrl: product.images[0],
                    price: `$${product.price}`,
                    sizes: product.sizes,
                    description: product.description,
                    material: product.material,
                    careInstructions: product.careInstructions,
                    category: product.category,
                  };
                  if (isInComparison(product.id)) {
                    removeFromComparison(product.id);
                  } else {
                    addToComparison(productData);
                  }
                }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isInComparison(product.id)
                    ? 'border-white bg-white text-black'
                    : 'border-gray-700 text-white hover:border-gray-500'
                }`}
                aria-label="Add to comparison"
              >
                <Scale className={`w-6 h-6`} />
              </button>
              <ShareProduct productTitle={product.title} />
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RefreshCw className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductDetails
          description={product.description}
          material={product.material}
          careInstructions={product.careInstructions}
          category={product.category}
        />

        {/* Product Q&A Section */}
        <ProductQA productId={product.id} />

        {/* Reviews Section */}
        <ProductReviews reviews={reviews} productId={product.id} averageRating={product.rating} totalReviews={product.reviewCount} />

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>

      {/* BACKEND API PLACEHOLDER: Product details */}
      {/* TODO: Implement GET /api/products/:id for product details */}
      {/* TODO: Implement GET /api/products/:id/reviews for product reviews */}
      {/* TODO: Implement POST /api/products/:id/reviews for submitting reviews */}
      {/* TODO: Implement GET /api/products/:id/related for related products */}
      {/* TODO: Implement POST /api/cart/add for adding to cart */}
      {/* TODO: Implement POST /api/wishlist/toggle for wishlist management */}
    </div>
  );
}
