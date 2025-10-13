const categories = [
  {
    id: 1,
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600",
    count: "2.5K+ items"
  },
  {
    id: 2,
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600",
    count: "1.8K+ items"
  },
  {
    id: 3,
    name: "Artwork",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600",
    count: "950+ items"
  },
  {
    id: 4,
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
    count: "620+ items"
  }
];

export function CategoryShowcase() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-400 text-lg">
            Explore our diverse collection of creative designs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative h-80 rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {category.count}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BACKEND API PLACEHOLDER: Categories */}
      {/* TODO: Fetch categories from /api/categories */}
    </section>
  );
}