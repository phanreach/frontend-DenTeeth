"use client";

import { CloudUpload, FileImage, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface UploadImageProps {
  onImageChange?: (file: File | null, preview?: string | null) => void;

  onStartScan?: () => void;

  isLoading?: boolean;
}

export default function UploadImage({
  onImageChange,
  onStartScan,
  isLoading = false,
}: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file || !file.type.startsWith("image/")) return;

      // cleanup previous preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      const url = URL.createObjectURL(file);

      setPreview(url);
      setFileName(file.name);

      onImageChange?.(file, url);
    },
    [onImageChange, preview],
  );

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setFileName(null);

    onImageChange?.(null, null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragging(false);

    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  return (
    <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-xl font-semibold text-primary">
          Teeth AI Analysis
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload a dental image to let AI analyze your teeth.
        </p>
      </div>

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
          className={`
            cursor-pointer rounded-xl
            border-2 border-dashed
            p-6 transition

            ${
              preview
                ? "border-gray-200"
                : isDragging
                  ? "border-primary bg-blue-50"
                  : "border-gray-300 hover:border-primary"
            }
          `}
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="
                  h-80 w-full
                  rounded-lg
                  border border-gray-200
                  bg-gray-50
                  object-contain
                  p-4
                "
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="
                  absolute right-3 top-3
                  rounded-full
                  bg-white
                  p-2
                  shadow-sm
                  transition
                  hover:bg-red-50
                "
              >
                <X className="h-4 w-4 text-gray-600 hover:text-red-500" />
              </button>
            </div>
          ) : (
            <div className="py-12 text-center">
              <CloudUpload
                className="
                  mx-auto
                  h-12 w-12
                  text-primary
                "
              />

              <h3 className="mt-5 text-lg font-medium text-gray-800">
                Upload Dental Image
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Drag & drop your image here, or click to browse.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                JPG, PNG, WEBP • Maximum size 10 MB
              </p>
            </div>
          )}
        </div>

        {/* File Info */}
        {fileName && (
          <div
            className="
              mt-4 flex items-center gap-3
              rounded-lg border border-gray-200
              p-3
            "
          >
            <div className="rounded-lg bg-blue-50 p-2">
              <FileImage className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {fileName}
              </p>

              <p className="text-xs text-gray-500">
                Image uploaded successfully
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        {!preview && (
          <div
            className="
              mt-6 rounded-lg
              border border-gray-200
              bg-gray-50
              p-4
            "
          >
            <h4 className="mb-2 text-sm font-semibold text-gray-700">
              Tips for best results
            </h4>

            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-500">
              <li>Use a clear and well-lit photo.</li>
              <li>Capture the teeth from a close distance.</li>
              <li>Keep the image in focus.</li>
              <li>Avoid filters or edited photos.</li>
            </ul>
          </div>
        )}

        {/* Actions */}
        {preview && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
              className="
                flex-1
                rounded-lg
                border border-primary
                py-3
                text-sm
                font-medium
                text-primary
                transition
                hover:bg-blue-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Replace Image
            </button>

            <button
              type="button"
              onClick={onStartScan}
              disabled={isLoading}
              className="
                flex-1
                rounded-lg
                bg-primary
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? "Analyzing..." : "Start Scan"}
            </button>
          </div>
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
