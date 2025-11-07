import { NavigationBar } from "@/components/NavigationBar";
import { MasonryFeed, FashionPost } from "@/components/MasonryFeed";
import { FilterPanel } from "@/components/FilterPanel";
import { EmptyState } from "@/components/EmptyState";
import { ItemDetail } from "@/components/ItemDetail";
import { ComparisonBar, ProductComparison } from "@/components/ProductComparison";
import { useComparison } from "@/contexts/ComparisonContext";
import { usePosts } from "@/contexts/PostsContext";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Extended FashionPost type for detail view
// FashionPost now includes: id, imageUrl, caption, designerId, designerName, designerAvatar, designerUsername, timestamp, likes, saves, isLiked, isSaved
interface ExtendedFashionPost extends FashionPost {
  images?: string[];
  price?: string;
  sizes?: string[];
  description?: string;
  details?: string;
  isProduct?: boolean;
  tags?: string[];
}

// Mock fashion posts data with extended details
const mockPosts: ExtendedFashionPost[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1653875842174-429c1b467548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDAxMzY1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Minimal Monochrome: Structured silhouettes in black",
    designerId: "designer-1",
    designerName: "Elena Rossi",
    designerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    designerUsername: "elenarossi",
    timestamp: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    likes: 3421,
    saves: 892,
    isLiked: false,
    isSaved: false,
    isProduct: true,
    price: "$425",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A minimalist approach to contemporary fashion. This structured piece features clean lines and a timeless silhouette.",
    details: "Material: 100% Wool\nMade in Italy\nDry clean only\nModel is 5'10\" and wears size S",
    images: [
      "https://images.unsplash.com/photo-1653875842174-429c1b467548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDAxMzY1NHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5OTQ3NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5OTQ3NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Luxury tailored coat with refined details",
    designerId: "designer-1",
    designerName: "Elena Rossi",
    designerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    designerUsername: "elenarossi",
    timestamp: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    likes: 2156,
    saves: 543,
    isLiked: true,
    isSaved: false,
    isProduct: true,
    price: "$685",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Luxury tailored coat crafted from premium materials. Features refined details and impeccable construction for a sophisticated look.",
    details: "Material: 90% Wool, 10% Cashmere\nMade in Italy\nDry clean only\nModel is 5'9\" and wears size M",
    images: [
      "https://images.unsplash.com/photo-1668934803312-2f04d43a648c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5OTQ3NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1653875842174-429c1b467548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDAxMzY1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwc3R5bGV8ZW58MXx8fHwxNzYwMDE0MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Urban streetwear: Oversized hoodies and clean lines",
    designerId: "designer-2",
    designerName: "Marcus Chen",
    designerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    designerUsername: "marcuschen",
    timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    likes: 5234,
    saves: 1432,
    isLiked: true,
    isSaved: true,
    isProduct: true,
    price: "$195",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Urban streetwear essentials featuring oversized silhouettes and clean, minimalist design. Perfect for the modern city dweller.",
    details: "Material: 80% Cotton, 20% Polyester\nMade in USA\nMachine washable\nModel is 6'1\" and wears size L",
    images: [
      "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwc3R5bGV8ZW58MXx8fHwxNzYwMDE0MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3V0Zml0fGVufDF8fHx8MTc2MDA0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc2MDA0NTE0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Designer accessories for the modern minimalist",
    designerId: "designer-5",
    designerName: "Amara Johnson",
    designerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    designerUsername: "amarajohnson",
    timestamp: Date.now() - 7 * 60 * 60 * 1000, // 7 hours ago
    likes: 2876,
    saves: 734,
    isLiked: false,
    isSaved: true,
    isProduct: true,
    price: "$145",
    sizes: ["One Size"],
    description: "Designer accessories that complement your minimalist wardrobe. High-quality craftsmanship meets timeless design.",
    details: "Material: Premium Leather\nMade in Spain\nWipe clean with soft cloth\nDimensions: 8\" x 5\" x 2\"",
    images: [
      "https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc2MDA0NTE0OXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1625622176700-1ad9e716c8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNob2VzfGVufDF8fHx8MTc2MDAxMTUzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3V0Zml0fGVufDF8fHx8MTc2MDA0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Essential minimalist outfit: Less is more",
    designerId: "designer-1",
    designerName: "Elena Rossi",
    designerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    designerUsername: "elenarossi",
    timestamp: Date.now() - 10 * 60 * 60 * 1000, // 10 hours ago
    likes: 1876,
    saves: 423,
    isLiked: false,
    isSaved: true,
    isProduct: true,
    price: "$320",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Essential minimalist pieces that form the foundation of a versatile wardrobe. Timeless design meets everyday functionality.",
    details: "Material: 100% Organic Cotton\nMade in Portugal\nMachine washable\nModel is 5'8\" and wears size S",
    images: [
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3V0Zml0fGVufDF8fHx8MTc2MDA0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1526632503813-6f479409d7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGljJTIwb3V0Zml0fGVufDF8fHx8MTc1OTk1MTIyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1704208316515-a32f81e373ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU5OTc1MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "High fashion editorial: Bold statement pieces",
    designerId: "designer-2",
    designerName: "Marcus Chen",
    designerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    designerUsername: "marcuschen",
    timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    likes: 4123,
    saves: 876,
    isLiked: false,
    isSaved: false,
    isProduct: true,
    price: "$560",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "High fashion editorial pieces that make bold statements. Perfect for those who dare to stand out with contemporary design.",
    details: "Material: Mixed Fabrics\nMade in USA\nProfessional cleaning recommended\nModel is 5'11\" and wears size M",
    images: [
      "https://images.unsplash.com/photo-1704208316515-a32f81e373ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU5OTc1MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwc3R5bGV8ZW58MXx8fHwxNzYwMDE0MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3N8ZW58MXx8fHwxNzU5OTUwNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Elegant evening dress with timeless appeal",
    designerId: "designer-3",
    designerName: "Sofia Laurent",
    designerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    designerUsername: "sofialaurent",
    timestamp: Date.now() - 14 * 60 * 60 * 1000, // 14 hours ago
    likes: 6543,
    saves: 2134,
    isLiked: true,
    isSaved: false,
    isProduct: true,
    price: "$850",
    sizes: ["XS", "S", "M", "L"],
    description: "Elegant evening dress featuring timeless design and luxurious fabric. Perfect for special occasions and formal events.",
    details: "Material: 100% Silk\nMade in France\nDry clean only\nModel is 5'10\" and wears size S",
    images: [
      "https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3N8ZW58MXx8fHwxNzU5OTUwNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1704208316515-a32f81e373ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU5OTc1MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1727686679920-79be3ffe07d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MDA0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Modern fashion editorial with architectural lines",
    designerId: "designer-3",
    designerName: "Sofia Laurent",
    designerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    designerUsername: "sofialaurent",
    timestamp: Date.now() - 18 * 60 * 60 * 1000, // 18 hours ago
    likes: 2987,
    saves: 654,
    isLiked: false,
    isSaved: false,
    isProduct: true,
    price: "$720",
    sizes: ["S", "M", "L", "XL"],
    description: "Modern fashion featuring architectural lines and innovative silhouettes. For the fashion-forward individual.",
    details: "Material: 85% Wool, 15% Silk\nMade in Italy\nDry clean only\nModel is 5'10\" and wears size M",
    images: [
      "https://images.unsplash.com/photo-1727686679920-79be3ffe07d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MDA0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3N8ZW58MXx8fHwxNzU5OTUwNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1664851449299-cc7db4ea9858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMHJ1bndheXxlbnwxfHx8fDE3NTk5OTY3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Runway ready: Avant-garde meets wearable",
    designerId: "designer-4",
    designerName: "Kai Nakamura",
    designerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    designerUsername: "kainakamura",
    timestamp: Date.now() - 20 * 60 * 60 * 1000, // 20 hours ago
    likes: 4532,
    saves: 1234,
    isLiked: false,
    isSaved: false,
    isProduct: true,
    price: "$950",
    sizes: ["S", "M", "L"],
    description: "Runway-ready avant-garde fashion that pushes boundaries while remaining wearable. Tokyo Fashion Week exclusive.",
    details: "Material: Innovative Technical Fabric\nMade in Japan\nSpecialist cleaning required\nModel is 5'9\" and wears size M",
    images: [
      "https://images.unsplash.com/photo-1664851449299-cc7db4ea9858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMHJ1bndheXxlbnwxfHx8fDE3NTk5OTY3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1727686679920-79be3ffe07d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MDA0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "10",
    imageUrl: "https://images.unsplash.com/photo-1641926362132-f820c474acfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzdHlsZXxlbnwxfHx8fDE3NjAwNDUxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Contemporary style for the creative soul",
    designerId: "designer-5",
    designerName: "Isabella Verde",
    designerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    designerUsername: "isabellaverde",
    timestamp: Date.now() - 22 * 60 * 60 * 1000, // 22 hours ago
    likes: 2345,
    saves: 567,
    isLiked: true,
    isSaved: false,
    isProduct: true,
    price: "$275",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Contemporary pieces designed for the creative individual. Express yourself with unique patterns and thoughtful details.",
    details: "Material: 70% Viscose, 30% Linen\nMade in Japan\nHand wash recommended\nModel is 5'7\" and wears size M",
    images: [
      "https://images.unsplash.com/photo-1641926362132-f820c474acfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzdHlsZXxlbnwxfHx8fDE3NjAwNDUxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1664851449299-cc7db4ea9858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMHJ1bndheXxlbnwxfHx8fDE3NTk5OTY3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "11",
    imageUrl: "https://images.unsplash.com/photo-1625622176700-1ad9e716c8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNob2VzfGVufDF8fHx8MTc2MDAxMTUzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Designer footwear: Every step is a statement",
    designerId: "designer-1",
    designerName: "Elena Rossi",
    designerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    designerUsername: "elenarossi",
    timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
    likes: 3876,
    saves: 1098,
    isLiked: false,
    isSaved: true,
    isProduct: true,
    price: "$395",
    sizes: ["EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41"],
    description: "Designer footwear that combines style and comfort. Premium materials and expert craftsmanship in every detail.",
    details: "Material: Full-grain Leather\nMade in Italy\nLeather sole\nHeel height: 2 inches",
    images: [
      "https://images.unsplash.com/photo-1625622176700-1ad9e716c8b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNob2VzfGVufDF8fHx8MTc2MDAxMTUzOHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc2MDA0NTE0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
  {
    id: "12",
    imageUrl: "https://images.unsplash.com/photo-1526632503813-6f479409d7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGljJTIwb3V0Zml0fGVufDF8fHx8MTc1OTk1MTIyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Chic everyday outfit: Effortless elegance",
    designerId: "designer-2",
    designerName: "Marcus Chen",
    designerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    designerUsername: "marcuschen",
    timestamp: Date.now() - 28 * 60 * 60 * 1000, // 28 hours ago
    likes: 2901,
    saves: 743,
    isLiked: false,
    isSaved: false,
    isProduct: true,
    price: "$240",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Chic everyday pieces that bring effortless elegance to your daily routine. Versatile and comfortable for all-day wear.",
    details: "Material: 65% Cotton, 35% Tencel\nMade in Turkey\nMachine washable\nModel is 5'9\" and wears size S",
    images: [
      "https://images.unsplash.com/photo-1526632503813-6f479409d7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGljJTIwb3V0Zml0fGVufDF8fHx8MTc1OTk1MTIyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3V0Zml0fGVufDF8fHx8MTc2MDA0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  },
];

export function FeedPage() {
  const [posts, setPosts] = useState<ExtendedFashionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ExtendedFashionPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExtendedFashionPost | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const { posts: userPosts } = usePosts();

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      // Sort user posts by createdAt (most recent first)
      const sortedUserPosts = [...userPosts].sort((a, b) => b.createdAt - a.createdAt);
      // User posts first (most recent), then mock posts
      const allPosts = [...sortedUserPosts, ...mockPosts];
      setPosts(allPosts);
      setIsLoading(false);
    }, 800);
  }, [userPosts]);

  useEffect(() => {
    if (!isSearchActive) {
      setFilteredPosts(posts);
      return;
    }

    // Simulate search delay
    setIsSearching(true);
    const timer = setTimeout(() => {
      let results = posts;

      // Filter by search query
      if (searchQuery.trim()) {
        results = results.filter((post) =>
          post.caption.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by selected categories
      if (selectedFilters.length > 0) {
        results = results.filter((post) => {
          // For user posts with tags array defined
          if (post.tags !== undefined) {
            // Only match if tags array has matching items
            return post.tags.length > 0 && selectedFilters.some((filter) =>
              post.tags!.includes(filter)
            );
          }
          // For mock posts without tags array (caption-based filtering)
          const lowerCaption = post.caption.toLowerCase();
          return selectedFilters.some((filter) =>
            lowerCaption.includes(filter.toLowerCase())
          );
        });
      }

      setFilteredPosts(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilters, posts, isSearchActive]);

  const handleSearchChange = (query: string, active: boolean) => {
    setSearchQuery(query);
    setIsSearchActive(active);
    if (!active) {
      setSelectedFilters([]);
    }
    // Close ItemDetail when search is activated
    if (active && selectedItem) {
      setSelectedItem(null);
    }
  };

  const handleFilterChange = (filters: string[]) => {
    const hasChanges =
      filters.length !== selectedFilters.length ||
      filters.some((f) => !selectedFilters.includes(f));

    setSelectedFilters(filters);

    if (hasChanges) {
      setIsFilterOpen(false);
      // Close ItemDetail when filters are applied
      if (selectedItem) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAllFilters = () => {
    setSelectedFilters([]);
  };

  const handleItemClick = (item: FashionPost) => {
    setSelectedItem(item as ExtendedFashionPost);
  };

  const handleBackToFeed = () => {
    setSelectedItem(null);
  };

  // Get related items (exclude current item)
  const getRelatedItems = (currentItem: ExtendedFashionPost) => {
    return posts.filter((post) => post.id !== currentItem.id).slice(0, 6);
  };

  // If item is selected, show detail view
  if (selectedItem) {
    return (
      <div className="min-h-screen bg-black overflow-x-hidden">
        <NavigationBar
          onSearchChange={handleSearchChange}
          onFilterClick={() => setIsFilterOpen(true)}
          searchQuery={searchQuery}
        />

        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          resultCount={isSearchActive ? filteredPosts.length : undefined}
        />

        <main className="pt-16 bg-black">
          <ItemDetail
            item={selectedItem}
            relatedItems={getRelatedItems(selectedItem)}
            onBack={handleBackToFeed}
            onItemClick={handleItemClick}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <NavigationBar
        onSearchChange={handleSearchChange}
        onFilterClick={() => setIsFilterOpen(true)}
        searchQuery={searchQuery}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        resultCount={isSearchActive ? filteredPosts.length : undefined}
      />

      {/* Main Content */}
      <main className="pt-16">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : isSearchActive ? (
          <div className="py-6">
            {isSearching ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <MasonryFeed posts={filteredPosts} onItemClick={handleItemClick} />
            ) : (
              <EmptyState
                message={
                  searchQuery.trim() || selectedFilters.length > 0
                    ? "No results for your search."
                    : "Start typing to search for fashion posts."
                }
                onClearFilters={
                  selectedFilters.length > 0 ? handleClearAllFilters : undefined
                }
              />
            )}
          </div>
        ) : (
          <MasonryFeed posts={posts} onItemClick={handleItemClick} />
        )}
      </main>

      {/* Comparison Bar and Modal */}
      <ComparisonBar
        count={comparisonList.length}
        onOpen={() => setIsComparisonOpen(true)}
        onClear={clearComparison}
      />
      <ProductComparison
        products={comparisonList}
        onRemove={removeFromComparison}
        onClear={clearComparison}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />
    </div>
  );
}
