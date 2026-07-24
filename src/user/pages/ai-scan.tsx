import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ScanSearch, ClipboardList } from "lucide-react";
import DiagnosisCard from "@/components/diagnosis-card";
import useDiagnosisQuery from "@/components/hook/use-diagnosis-query";
import useDiagnosisMutation from "@/components/hook/use-diagnosis-mutation";
import UploadImage from "@/landing/upload-image";

const STEPS = [
  {
    icon: Upload,
    title: "Upload a dental image",
    detail:
      "Select a clear photo of your teeth from your device (JPG, PNG, or WEBP).",
  },
  {
    icon: ScanSearch,
    title: "AI analyzes your image",
    detail:
      "Our AI detects visible dental conditions and highlights affected areas.",
  },
  {
    icon: ClipboardList,
    title: "Review the analysis",
    detail:
      "View detected conditions, confidence scores, and AI-generated explanations.",
  },
];
export default function AiScan() {
  const { data = [] } = useDiagnosisQuery();
  const diagnosisMutation = useDiagnosisMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    navigate(`/ai-scan/report/${id}`);
  };

  const handleImageChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleStartScan = () => {
    if (!selectedFile) return;
    diagnosisMutation.mutate({ file: selectedFile });
  };

  return (
    <div>
      <div className="border-b bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
          <div>
            <h1 className="text-xl font-bold text-jci-primary-dark sm:text-2xl">
              AI scan
            </h1>
            <p className="text-xs text-gray-400 sm:text-sm">
              Powered by clinical AI for precise intra-oral analysis and early
              detection.
            </p>
          </div>
        </div>
      </div>

      <div className="grid items-stretch gap-6 p-4 sm:p-6 lg:grid-cols-2">
        <UploadImage
          onImageChange={handleImageChange}
          onStartScan={handleStartScan}
          isLoading={diagnosisMutation.isPending}
        />
        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              AI Screening Guide
            </span>

            <h2 className="mt-3 text-xl font-bold text-slate-900">
              How AI Dental Screening Works
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Follow these simple steps to upload your dental image and receive
              an AI-powered preliminary screening within seconds.
            </p>
          </div>

          <div className="mt-2 space-y-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === STEPS.length - 1;

              return (
                <div key={step.title} className="relative flex gap-4">
                  {!isLast && (
                    <div className="absolute left-5 top-11 h-[calc(100%-4px)] w-px bg-slate-200" />
                  )}

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">
                        STEP {index + 1}
                      </span>
                    </div>

                    <h3 className="mt-1 font-semibold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {data.map((diagnosis) => (
          <div
            key={diagnosis.diagnosisId}
            className="cursor-pointer"
            onClick={() => handleNavigate(diagnosis.diagnosisId)}
          >
            <DiagnosisCard data={diagnosis} />
          </div>
        ))}
      </div>
    </div>
  );
}
