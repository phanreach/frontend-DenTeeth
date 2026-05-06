import { Play, Star } from "lucide-react";
import UploadImage from "./upload-image";
import { useState } from "react";

export default function Hero() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <section className="relative flex items-center px-10 py-20 bg-secondary">
      <div className="mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e3e7fd] text-primary text-sm uppercase tracking-widest">
            <Star className="w-4 h-4" />
            AI-Powered Dental Analysis
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-slate-800">
            Scan Your Teeth, <br />
            <span className="text-primary">Get Instant Insights</span>
          </h1>

          <p className="text-base lg:text-lg leading-relaxed max-w-xl">
            Upload a photo of your smile and let our clinical-grade AI analyze
            your dental health in seconds. Precise, private, and professional
            guidance at your fingertips.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              disabled={!uploadedFile}
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-primary/20 hover:bg-primary hover:shadow-primary active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Analyze Now
            </button>
            <button className="inline-flex items-center gap-2 border border-gray-500 px-8 py-3.5 rounded-xl font-semibold text-base text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
              <Play className="w-4 h-4" />
              How it works
            </button>
          </div>

          {uploadedFile && (
            <p className="text-xs text-teal-600 font-medium">
              ✓ {uploadedFile.name} ready for analysis
            </p>
          )}
        </div>

        {/* Right */}
        <div>
          <UploadImage onImageChange={(file) => setUploadedFile(file)} />
        </div>
      </div>
    </section>
  );
}
