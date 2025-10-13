import { CheckCircle2 } from "lucide-react";

const featuredDesigners = [
  {
    id: 1,
    name: "Sophie Chen",
    specialty: "Minimalist Fashion",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    products: 45,
    verified: true
  },
  {
    id: 2,
    name: "Marcus Rivera",
    specialty: "Street Art & Graphics",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    products: 78,
    verified: true
  },
  {
    id: 3,
    name: "Elena Vasquez",
    specialty: "Handcrafted Leather",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    products: 32,
    verified: true
  }
];

export function DesignerSpotlight() {
  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Designers
          </h2>
          <p className="text-gray-400 text-lg">
            Meet the talented artists behind our collections
          </p>
        </div>

        {/* Designers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDesigners.map((designer) => (
            <div
              key={designer.id}
              className="bg-gray-900 rounded-xl p-8 text-center hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="relative inline-block mb-4">
                <img
                  src={designer.avatar}
                  alt={designer.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
                {designer.verified && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {designer.name}
              </h3>
              <p className="text-gray-400 mb-4">
                {designer.specialty}
              </p>
              <div className="text-sm text-gray-500">
                {designer.products} Products
              </div>

              <button className="mt-6 w-full py-2 border border-gray-700 text-white rounded-lg hover:bg-white hover:text-black transition-all">
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Are You a Designer?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of creative minds. Showcase your work to thousands of
              potential customers and build your brand with zero upfront costs.
            </p>
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              Start Selling Today
            </button>
          </div>
        </div>
      </div>

      {/* BACKEND API PLACEHOLDER: Featured Designers */}
      {/* TODO: Fetch featured designers from /api/designers/featured */}
    </section>
  );
}