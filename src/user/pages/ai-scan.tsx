import DiagnosisCard from "@/components/diagnosis-card";
import useDiagnosisQuery from "@/components/hook/use-diagnosis-query";
import useDiagnosisMutation from "@/components/hook/use-diagnosis-mutation";
import UploadImage from "@/landing/upload-image";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AiScan() {
  const { data = [] } = useDiagnosisQuery();
  const diagnosisMutation = useDiagnosisMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    navigate(`/report/${id}`);
  };

  const handleImageChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleStartScan = () => {
    if (!selectedFile) return;

    diagnosisMutation.mutate({
      file: selectedFile,
    });
  };

  return (
    <div>
      <div className="border-b bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
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

      <div className="p-4 sm:p-6">
        <UploadImage
          onImageChange={handleImageChange}
          onStartScan={handleStartScan}
          isLoading={diagnosisMutation.isPending}
        />
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
