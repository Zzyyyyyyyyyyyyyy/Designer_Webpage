import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SizeGuideProps {
  category?: string;
}

interface SizeData {
  size: string;
  chest: string;
  waist: string;
  hips: string;
  length: string;
}

export function SizeGuide({ category = "clothing" }: SizeGuideProps) {
  // BACKEND API PLACEHOLDER: Fetch size guide data based on category
  // TODO: Replace with actual API call to /api/size-guide/:category
  const sizeData: SizeData[] = [
    { size: "XS", chest: "32-34", waist: "24-26", hips: "34-36", length: "26" },
    { size: "S", chest: "34-36", waist: "26-28", hips: "36-38", length: "27" },
    { size: "M", chest: "36-38", waist: "28-30", hips: "38-40", length: "28" },
    { size: "L", chest: "38-40", waist: "30-32", hips: "40-42", length: "29" },
    { size: "XL", chest: "40-42", waist: "32-34", hips: "42-44", length: "30" },
  ];

  const measurementTips = [
    {
      title: "Chest",
      description: "Measure around the fullest part of your chest, keeping the tape horizontal.",
    },
    {
      title: "Waist",
      description: "Measure around your natural waistline, keeping the tape comfortably loose.",
    },
    {
      title: "Hips",
      description: "Measure around the fullest part of your hips, about 8 inches below your waist.",
    },
    {
      title: "Length",
      description: "Measure from the highest point of the shoulder down to the desired length.",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Ruler className="w-4 h-4" />
          Size Guide
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Size Guide</DialogTitle>
          <DialogDescription className="text-gray-400">
            Find your perfect fit with our detailed size measurements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Size Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Size Chart (inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Chest</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Waist</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Hips</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row) => (
                    <tr key={row.size} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 font-semibold">{row.size}</td>
                      <td className="py-3 px-4 text-gray-300">{row.chest}</td>
                      <td className="py-3 px-4 text-gray-300">{row.waist}</td>
                      <td className="py-3 px-4 text-gray-300">{row.hips}</td>
                      <td className="py-3 px-4 text-gray-300">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Measurement Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-4">How to Measure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {measurementTips.map((tip, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{tip.title}</h4>
                  <p className="text-sm text-gray-400">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Model Information</h4>
            <p className="text-sm text-gray-400 mb-2">
              Model is 5'10" (178 cm) and wearing size S
            </p>
            <p className="text-sm text-gray-400">
              For a more relaxed fit, we recommend sizing up. If you're between sizes, choose the larger size.
            </p>
          </div>

          {/* Contact Note */}
          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Need help finding your size?{" "}
              <button className="text-white hover:underline">Contact us</button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// BACKEND API PLACEHOLDER: Size guide data
// TODO: Implement GET /api/size-guide/:category for fetching size charts
// TODO: Support different categories (clothing, shoes, accessories)
// TODO: Implement unit conversion (inches/cm toggle)
