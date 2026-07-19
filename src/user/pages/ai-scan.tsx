import UploadImage from "@/landing/upload-image";

export default function AiScan() {
  return (
    <div>
      <div className="border-b bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-jci-primary-dark sm:text-2xl">
                AI Scan
              </h1>
              <p className="text-xs text-gray-400 sm:text-sm">
                Powered by Clinical AI for precise intra oral analysis and early
                detection.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <UploadImage />
      </div>
    </div>
  );
}
