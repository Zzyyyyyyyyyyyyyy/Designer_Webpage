import { Package, RotateCcw, Shield, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailsProps {
  description: string;
  material: string;
  careInstructions: string;
  category: string;
}

interface Specification {
  label: string;
  value: string;
}

export function ProductDetails({ description, material, careInstructions, category }: ProductDetailsProps) {
  // BACKEND API PLACEHOLDER: Fetch detailed product specifications
  // TODO: Replace with actual API call to /api/products/:id/specifications
  const specifications: Specification[] = [
    { label: "Material", value: material },
    { label: "Category", value: category },
    { label: "Care Instructions", value: careInstructions },
    { label: "Country of Origin", value: "Italy" },
    { label: "Fit", value: "True to size" },
    { label: "Closure Type", value: "Button" },
    { label: "Pocket Details", value: "Two side pockets, one inner pocket" },
    { label: "Lining", value: "100% Polyester" },
    { label: "Weight", value: "1.2 lbs" },
  ];

  const shippingInfo = [
    {
      icon: Package,
      title: "Free Shipping",
      description: "Free standard shipping on orders over $200. Express shipping available at checkout.",
    },
    {
      icon: Clock,
      title: "Delivery Time",
      description: "Standard: 5-7 business days. Express: 2-3 business days. International: 10-15 business days.",
    },
    {
      icon: Shield,
      title: "Secure Packaging",
      description: "All items are carefully packaged to ensure they arrive in perfect condition.",
    },
  ];

  const returnInfo = [
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Easy returns within 30 days of purchase. Items must be unworn with original tags attached.",
    },
    {
      icon: Package,
      title: "Return Process",
      description: "Initiate a return through your account dashboard. Print the prepaid return label and drop off at any carrier location.",
    },
    {
      icon: Shield,
      title: "Refund Policy",
      description: "Refunds are processed within 5-7 business days after we receive your return. Original payment method will be credited.",
    },
  ];

  return (
    <div className="mb-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black border border-gray-900 h-auto p-1 rounded-xl">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-400 py-3 rounded-lg transition-all"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-400 py-3 rounded-lg transition-all"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-400 py-3 rounded-lg transition-all"
          >
            Shipping
          </TabsTrigger>
          <TabsTrigger
            value="returns"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-400 py-3 rounded-lg transition-all"
          >
            Returns
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="mt-6">
          <div className="bg-black border border-gray-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Product Description</h3>
            <p className="text-gray-300 leading-relaxed mb-6">{description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-900">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">•</span>
                    <span>Premium quality materials for lasting durability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">•</span>
                    <span>Expertly crafted with attention to detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">•</span>
                    <span>Versatile design suitable for multiple occasions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-1">•</span>
                    <span>Sustainable and ethically produced</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Designer Notes</h4>
                <p className="text-gray-400 italic">
                  "This piece represents the perfect balance between timeless elegance and contemporary design.
                  Every detail has been carefully considered to create a garment that will remain a wardrobe staple for years to come."
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specifications" className="mt-6">
          <div className="bg-black border border-gray-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="flex justify-between py-3 border-b border-gray-900">
                  <span className="text-gray-400 font-medium">{spec.label}</span>
                  <span className="text-white text-right">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-900">
              <h4 className="text-lg font-semibold text-white mb-4">Sustainability</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/80 rounded-lg p-4 text-center">
                  <div className="text-green-500 text-2xl mb-2">♻️</div>
                  <p className="text-sm text-gray-300">Recyclable Materials</p>
                </div>
                <div className="bg-gray-900/80 rounded-lg p-4 text-center">
                  <div className="text-green-500 text-2xl mb-2">🌱</div>
                  <p className="text-sm text-gray-300">Eco-Friendly Production</p>
                </div>
                <div className="bg-gray-900/80 rounded-lg p-4 text-center">
                  <div className="text-green-500 text-2xl mb-2">✨</div>
                  <p className="text-sm text-gray-300">Ethical Manufacturing</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Shipping Tab */}
        <TabsContent value="shipping" className="mt-6">
          <div className="bg-black border border-gray-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Shipping Information</h3>
            <div className="space-y-6">
              {shippingInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex gap-4 pb-6 border-b border-gray-900 last:border-0">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900/80 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{info.title}</h4>
                      <p className="text-gray-400">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-900">
              <h4 className="text-lg font-semibold text-white mb-4">International Shipping</h4>
              <p className="text-gray-400 mb-4">
                We ship to over 100 countries worldwide. Customs duties and taxes may apply and are the responsibility of the customer.
              </p>
              <div className="bg-gray-900/80 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Note:</strong> Delivery times may vary during peak seasons and holidays.
                  You'll receive a tracking number via email once your order ships.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Returns Tab */}
        <TabsContent value="returns" className="mt-6">
          <div className="bg-black border border-gray-900 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Returns & Exchanges</h3>
            <div className="space-y-6">
              {returnInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex gap-4 pb-6 border-b border-gray-900 last:border-0">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900/80 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{info.title}</h4>
                      <p className="text-gray-400">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-900">
              <h4 className="text-lg font-semibold text-white mb-4">Non-Returnable Items</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Personalized or customized items</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Final sale or clearance items</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Items without original tags or packaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  <span>Worn, washed, or altered items</span>
                </li>
              </ul>

              <div className="mt-6 bg-gray-900/80 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Questions?</strong> Contact our customer service team at{" "}
                  <a href="mailto:support@example.com" className="text-white hover:underline">
                    support@example.com
                  </a>{" "}
                  or call us at (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// BACKEND API PLACEHOLDER: Product details
// TODO: Implement GET /api/products/:id/specifications for detailed specs
// TODO: Implement GET /api/shipping-info for dynamic shipping options
// TODO: Implement GET /api/return-policy for up-to-date return policies
