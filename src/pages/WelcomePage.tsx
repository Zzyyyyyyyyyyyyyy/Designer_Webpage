import { useNavigate } from "react-router-dom";
import { Sparkles, Star, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function WelcomePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    // TODO: Mark user as onboarded in Phase 6
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div
        className={`w-full max-w-2xl text-center space-y-12 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Illustration/Icon Section */}
        <div className="relative flex justify-center">
          {/* Main Icon */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="w-32 h-32 border-4 border-white rounded-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Decorative Stars */}
          <div
            className={`absolute top-0 left-1/4 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <Star className="w-6 h-6 text-white" fill="white" />
          </div>
          <div
            className={`absolute bottom-0 right-1/4 transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div
            className={`absolute top-1/4 right-1/3 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <Star className="w-4 h-4 text-white" fill="white" />
          </div>
        </div>

        {/* Welcome Text Section */}
        <div
          className={`space-y-4 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-white text-4xl md:text-5xl font-medium tracking-wider">
            Welcome to DESIGNER
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
            Your personalized feed is ready. Discover curated fashion content
            tailored to your unique style.
          </p>
        </div>

        {/* Get Started Button */}
        <div
          className={`transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={handleGetStarted}
            className="px-16 py-4 bg-white text-black text-lg font-medium hover:bg-white/90 transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Additional Info */}
        <div
          className={`transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-gray-600 text-sm">
            You can update your preferences anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
}
