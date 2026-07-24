import { useParams } from "react-router-dom";
import useDiagnosisQuery from "@/components/hook/use-diagnosis-query";
import DiagnosisCard from "@/components/diagnosis-card";
import Disease from "../components/disease";

export default function DiagnosisReport() {
  const { id } = useParams<{ id: string }>();
  const { data = [], isLoading } = useDiagnosisQuery();

  const diagnosis = data.find((item) => item.diagnosisId === Number(id));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Loading your report…</p>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Report not found</h2>

        <p className="mt-2 text-muted-foreground">
          Diagnosis #{id} does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className=" p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Diagnosis Report
          </h1>
        </div>
      </div>
      <div className="space-y-6 p-4 sm:p-6">
        <DiagnosisCard data={diagnosis} />
        <Disease data={diagnosis} />
      </div>
    </div>
  );
}
