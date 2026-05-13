import {
  CloudUpload,
  X,
  CheckCircle2,
  FileImage,
  Sparkles,
} from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface UploadImageProps {
  onImageChange?: (file: File | null, preview?: string | null) => void;
}

export default function UploadImage({ onImageChange }: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file || !file.type.startsWith("image/")) return;

      const url = URL.createObjectURL(file);

      setPreview(url);
      setFileName(file.name);

      onImageChange?.(file, url);
    },
    [onImageChange],
  );

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);

    setPreview(null);
    setFileName(null);

    onImageChange?.(null, null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDragging(false);

    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-md">
      {/* Header */}
      <div className="relative overflow-hidden bg-primary px-7 py-6">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Teeth AI Analysis</h2>

            <p className="mt-1 text-sm text-blue-100">
              Upload a clear dental image for instant AI scanning
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Upload Area */}
        <div
          onClick={() => !preview && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300
          ${
            preview
              ? "border-blue-200 bg-blue-50/40"
              : isDragging
                ? "scale-[0.99] border-primary bg-blue-50"
                : "border-blue-200 bg-gradient-to-b from-blue-50/80 to-white hover:border-primary hover:bg-blue-50/60"
          }`}
        >
          {preview ? (
            <div className="relative h-[320px]">
              <img
                src={preview}
                alt="Uploaded preview"
                className="h-full w-full object-contain p-5"
              />

              {/* Remove */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 text-slate-500 hover:text-red-500" />
              </button>

              {/* Status */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
                <CheckCircle2 className="h-4 w-4" />
                Ready for AI diagnosis
              </div>
            </div>
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center px-8 text-center">
              <div
                className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300
                ${isDragging ? "scale-110 bg-primary" : "bg-blue-100"}`}
              >
                <CloudUpload
                  className={`h-10 w-10 transition-colors
                  ${isDragging ? "text-white" : "text-primary"}`}
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                {isDragging ? "Drop image here" : "Upload your dental image"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                Drag & drop your image here or click to browse. Supported
                formats: JPG, PNG, WEBP.
              </p>

              <div className="mt-6 rounded-xl border border-blue-100 bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
                Maximum file size: 10MB
              </div>
            </div>
          )}
        </div>

        {/* File Name */}
        {fileName && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
              <FileImage className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">
                {fileName}
              </p>

              <p className="text-xs text-slate-400">
                Image uploaded successfully
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        {!preview && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              "Clear & bright image",
              "Close-up preferred",
              "Upper or lower arch",
              "Avoid heavy filters",
            ].map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
                {tip}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95">
            <Sparkles className="h-4 w-4" />
            START AI DIAGNOSIS
          </button>

          {preview && (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-2xl border border-blue-200 bg-white py-3 text-sm font-semibold text-primary transition hover:bg-blue-50"
            >
              Replace image
            </button>
          )}
        </div>
      </div>

      {/* Hidden Input */}
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
