import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFilters } from "@/components/ProductFilters";
import { SortOptions } from "@/components/SortOptions";
import { Pagination } from "@/components/Pagination";
import { Loader2 } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  designer: string;
  designerId: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

interface Filters {
  categories: string[];
  priceRange: [number, number];
  designers: string[];
  tags: string[];
  inStockOnly: boolean;
}

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 1000],
    designers: [],
    tags: [],
    inStockOnly: false,
  });

  const itemsPerPage = 12;

  useEffect(() => {
    // BACKEND API PLACEHOLDER: Fetch products
    // TODO: Replace with actual API call to /api/products
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Simulated API call - Replace with:
        // const response = await fetch('/api/products?page=' + currentPage + '&limit=' + itemsPerPage);
        // const data = await response.json();

        // Mock product data
        const mockProducts: Product[] = [
          {
            id: "1",
            title: "Minimalist Black Coat",
            designer: "Sophie Chen",
            designerId: "designer-1",
            price: 425,
            imageUrl: "https://images.unsplash.com/photo-1653875842174-429c1b467548?w=800",
            category: "Outerwear",
            tags: ["minimalist", "luxury", "winter"],
            featured: true,
            rating: 4.8,
            reviewCount: 124,
            inStock: true,
          },
          {
            id: "2",
            title: "Abstract Art Print T-Shirt",
            designer: "Marcus Rivera",
            designerId: "designer-2",
            price: 65,
            imageUrl: "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?w=800",
            category: "Clothing",
            tags: ["streetwear", "artistic", "cotton"],
            featured: true,
            rating: 4.6,
            reviewCount: 89,
            inStock: true,
          },
          {
            id: "3",
            title: "Handcrafted Leather Bag",
            designer: "Elena Vasquez",
            designerId: "designer-3",
            price: 285,
            imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
            category: "Accessories",
            tags: ["leather", "handmade", "sustainable"],
            featured: false,
            rating: 4.9,
            reviewCount: 156,
            inStock: true,
          },
          {
            id: "4",
            title: "Elegant Evening Dress",
            designer: "Yuki Tanaka",
            designerId: "designer-4",
            price: 520,
            imageUrl: "https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?w=800",
            category: "Dresses",
            tags: ["elegant", "evening", "silk"],
            featured: true,
            rating: 4.7,
            reviewCount: 67,
            inStock: false,
          },
          {
            id: "5",
            title: "Urban Streetwear Hoodie",
            designer: "Alex Kim",
            designerId: "designer-5",
            price: 95,
            imageUrl: "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?w=800",
            category: "Clothing",
            tags: ["streetwear", "casual", "cotton"],
            featured: false,
            rating: 4.5,
            reviewCount: 203,
            inStock: true,
          },
          {
            id: "6",
            title: "Designer Sunglasses",
            designer: "Sophie Chen",
            designerId: "designer-1",
            price: 180,
            imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
            category: "Accessories",
            tags: ["sunglasses", "summer", "luxury"],
            featured: false,
            rating: 4.4,
            reviewCount: 98,
            inStock: true,
          },
          {
            id: "7",
            title: "Vintage Denim Jacket",
            designer: "Marcus Rivera",
            designerId: "designer-2",
            price: 145,
            imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
            category: "Outerwear",
            tags: ["denim", "vintage", "casual"],
            featured: false,
            rating: 4.6,
            reviewCount: 142,
            inStock: true,
          },
          {
            id: "8",
            title: "Silk Scarf Collection",
            designer: "Elena Vasquez",
            designerId: "designer-3",
            price: 75,
            imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
            category: "Accessories",
            tags: ["silk", "luxury", "handmade"],
            featured: false,
            rating: 4.8,
            reviewCount: 76,
            inStock: true,
          },
        ];

        // Simulate network delay
        setTimeout(() => {
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
          setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Apply price range filter
    result = result.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Apply designer filter
    if (filters.designers.length > 0) {
      result = result.filter(p => filters.designers.includes(p.designerId));
    }

    // Apply in stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // In real app, sort by creation date
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [products, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-black py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Browse All Products</h1>
          <p className="text-gray-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="mb-6">
              <SortOptions
                sortBy={sortBy}
                onSortChange={setSortBy}
                resultCount={filteredProducts.length}
              />
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <ProductGrid products={paginatedProducts} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-4">No products found</p>
                <button
                  onClick={() => setFilters({
                    categories: [],
                    priceRange: [0, 1000],
                    designers: [],
                    tags: [],
                    inStockOnly: false,
                  })}
                  className="px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BACKEND API PLACEHOLDER: Product fetching with filters */}
      {/* TODO: Implement GET /api/products with query parameters:
          - page, limit (pagination)
          - category, minPrice, maxPrice (filters)
          - designer, tags (filters)
          - sortBy (sorting)
          - inStock (availability)
      */}
    </div>
  );
}