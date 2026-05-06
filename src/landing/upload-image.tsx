import { CloudUpload, X, ImageIcon, CheckCircle2 } from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface UploadImageProps {
  onImageChange?: (file: File | null, preview?: string | null) => void;
}

export default function UploadImage({ onImageChange }: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageChange?.(file, url);
    },
    [onImageChange],
  );

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onImageChange?.(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <CloudUpload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Upload Dental Scan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              JPG, PNG or WEBP · Max 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div className="p-6">
        <div
          onClick={() => !preview && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
            ${
              preview
                ? "border-teal-300 bg-teal-50/30 h-56 cursor-default"
                : isDragging
                  ? "border-primary bg-primary/5 cursor-copy h-36 scale-[0.99]"
                  : "border-slate-200 bg-slate-50/80 hover:border-primary/50 hover:bg-primary/3 cursor-pointer h-36"
            }`}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Uploaded scan"
                className="w-full h-full object-contain p-3"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors group"
              >
                <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
              </button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-teal-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Ready
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 select-none">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDragging ? "bg-primary/15" : "bg-slate-200/80"}`}
              >
                <ImageIcon
                  className={`w-5 h-5 transition-colors ${isDragging ? "text-primary" : "text-slate-400"}`}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">
                  {isDragging ? "Drop to upload" : "Drag & drop your image"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isDragging ? "" : "or click to browse files"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        {!preview && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              "Clear, well-lit photo",
              "Upper or lower arch",
              "Close-up preferred",
              "No filters",
            ].map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-1.5 text-xs text-slate-400"
              >
                <div className="w-1 h-1 rounded-full bg-teal-400 shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        )}

        {preview && (
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-4 w-full text-xs text-primary/70 hover:text-primary font-medium py-2 rounded-lg hover:bg-primary/5 transition-colors border border-dashed border-slate-200 hover:border-primary/30"
          >
            Replace image
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
