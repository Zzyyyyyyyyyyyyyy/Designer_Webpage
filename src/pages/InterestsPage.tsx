import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

interface Interest {
  id: string;
  name: string;
  description: string;
}

const INTERESTS: Interest[] = [
  { id: "streetwear", name: "Streetwear", description: "Urban fashion & hype culture" },
  { id: "luxury", name: "Luxury", description: "High-end designer brands" },
  { id: "vintage", name: "Vintage", description: "Classic & retro styles" },
  { id: "minimalist", name: "Minimalist", description: "Clean & simple aesthetics" },
  { id: "avant-garde", name: "Avant-garde", description: "Experimental & artistic" },
  { id: "sustainable", name: "Sustainable", description: "Eco-friendly fashion" },
  { id: "athletic", name: "Athletic", description: "Sportswear & activewear" },
  { id: "formal", name: "Formal", description: "Business & evening wear" },
  { id: "casual", name: "Casual", description: "Everyday comfortable style" },
  { id: "bohemian", name: "Bohemian", description: "Free-spirited & eclectic" },
  { id: "punk", name: "Punk", description: "Rebellious & edgy looks" },
  { id: "preppy", name: "Preppy", description: "Collegiate & polished" },
];

const MIN_SELECTION = 3;

export function InterestsPage() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length >= MIN_SELECTION) {
      // TODO: Save interests to user profile in Supabase
      // For now, just navigate to welcome page
      navigate("/welcome");
    }
  };

  const isSelected = (interestId: string) => selectedInterests.includes(interestId);
  const canContinue = selectedInterests.length >= MIN_SELECTION;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-white text-3xl font-medium tracking-wider">
            What interests you?
          </h1>
          <p className="text-gray-400 text-sm">
            Choose at least {MIN_SELECTION} styles to personalize your feed
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {INTERESTS.map((interest) => {
            const selected = isSelected(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`relative aspect-square p-6 border-2 transition-all duration-200 ${
                  selected
                    ? "border-white bg-white/5"
                    : "border-white/20 hover:border-white/40"
                } flex flex-col items-center justify-center text-center group`}
              >
                {/* Checkmark Icon */}
                {selected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}

                {/* Interest Content */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-lg">
                    {interest.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selection Counter & Continue Button */}
        <div className="space-y-4">
          {/* Counter */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {selectedInterests.length} of {INTERESTS.length} selected
              {selectedInterests.length < MIN_SELECTION && (
                <span className="text-gray-400">
                  {" "}
                  (select at least {MIN_SELECTION - selectedInterests.length} more)
                </span>
              )}
            </p>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`px-12 py-3 font-medium transition-all ${
                canContinue
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
