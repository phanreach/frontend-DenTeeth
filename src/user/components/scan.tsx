import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Scan() {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate(`/ai-scan`);
  };
  return (
    <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl bg-primary p-6 text-white lg:flex-row">
      {/* LEFT SIDE */}
      <div className="max-w-lg">
        <p className="text-2xl font-semibold">Ready for your weekly checkup?</p>

        <p className="mt-3 leading-7 text-blue-100">
          Our AI analysis identifies early signs of plaque, cavities, and gum
          disease in under 60 seconds with 98% accuracy.
        </p>

        <button
          className="mt-5 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-primary transition hover:bg-gray-100 cursor-pointer"
          onClick={handleNext}
        >
          <Camera className="h-5 w-5" />

          <span>Start New AI Scan</span>
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex w-full max-w-sm justify-center">
        <div className="absolute top-4 h-56 w-44 rotate-6 rounded-2xl bg-white/20 backdrop-blur-sm" />

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop"
            alt="AI dental scan preview"
            className="h-56 w-44 object-cover"
          />

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-sm font-medium text-white">AI Scan Preview</p>

            <p className="text-xs text-blue-100">Analysis Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
