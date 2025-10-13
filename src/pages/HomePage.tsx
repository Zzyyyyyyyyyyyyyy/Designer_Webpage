import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { DesignerSpotlight } from "@/components/DesignerSpotlight";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  designer: string;
  price: number;
  imageUrl: string;
  category: string;
  featured: boolean;
}

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // BACKEND API PLACEHOLDER: Fetch featured products
    // TODO: Replace with actual API call to /api/products/featured
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);

        // Simulated API call - Replace with:
        // const response = await fetch('/api/products/featured');
        // const data = await response.json();

        // Mock data for now
        const mockProducts: Product[] = [
          {
            id: "1",
            title: "Minimalist Black Coat",
            designer: "Sophie Chen",
            price: 425,
            imageUrl: "https://images.unsplash.com/photo-1653875842174-429c1b467548?w=800",
            category: "Outerwear",
            featured: true
          },
          {
            id: "2",
            title: "Abstract Art Print T-Shirt",
            designer: "Marcus Rivera",
            price: 65,
            imageUrl: "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?w=800",
            category: "Clothing",
            featured: true
          },
          {
            id: "3",
            title: "Handcrafted Leather Bag",
            designer: "Elena Vasquez",
            price: 285,
            imageUrl: "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?w=800",
            category: "Accessories",
            featured: true
          },
          {
            id: "4",
            title: "Elegant Evening Dress",
            designer: "Yuki Tanaka",
            price: 520,
            imageUrl: "https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?w=800",
            category: "Dresses",
            featured: true
          }
        ];

        // Simulate network delay
        setTimeout(() => {
          setFeaturedProducts(mockProducts);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error('Error fetching featured products:', error);
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <FeaturedProducts
        products={featuredProducts}
        isLoading={isLoading}
      />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Designer Spotlight */}
      <DesignerSpotlight />

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Creative Community
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Get exclusive access to new releases, designer stories, and special offers
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Subscribe
            </button>
          </form>

          {/* BACKEND API PLACEHOLDER: Newsletter subscription */}
          {/* TODO: Implement POST /api/newsletter/subscribe */}
        </div>
      </section>
    </div>
  );
}