import Navbar from "../components/nav-bar";
import Footer from "../components/footer";
import { useState } from "react";
import {
  CircleAlert,
  Sparkles,
  ShieldCheck,
  ScanLine,
  BadgeCheck,
} from "lucide-react";
import UploadImage from "./upload-image";
import DiagnosisCard from "@/components/diagnosis-card";
import useDiagnosisMutation from "@/components/hook/use-diagnosis-mutation";
import type { Diagnosis } from "@/types/api";

export default function AIScan() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const diagnosisMutation = useDiagnosisMutation();
  const handleDiagnosis = () => {
    if (!file) return;

    diagnosisMutation.mutate(
      { file },
      {
        onSuccess: (response) => {
          console.log(response.data);
          setDiagnosis(response.data);
        },
      },
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#eef3ff]">
      <Navbar />

      <section className="relative">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 py-16 lg:flex-row">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              AI Powered Dental Screening
            </div>

            <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
              A precise scan
              <br />
              for a{" "}
              <span className="relative inline-block text-primary">
                healthier
              </span>
              <br />
              smile.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Upload your dental image and let our AI provide a fast preliminary
              screening. Designed to help detect visible concerns with clarity
              and convenience.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: ScanLine,
                  title: "AI Analysis",
                  desc: "Fast image scanning",
                },
                {
                  icon: ShieldCheck,
                  title: "Private & Secure",
                  desc: "Your uploads stay protected",
                },
                {
                  icon: BadgeCheck,
                  title: "Accurate Results",
                  desc: "Optimized AI screening",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-md backdrop-blur-sm"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-xl">
            <UploadImage
              onImageChange={(uploadedFile) => setFile(uploadedFile)}
              onStartScan={handleDiagnosis}
            />
            <div className="mt-5 rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                  <CircleAlert className="h-6 w-6 text-amber-500" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Medical Disclaimer
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    DenTeeth AI provides preliminary screening only and should
                    not be considered a medical diagnosis. Always consult a
                    licensed dental professional for proper evaluation and
                    treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {diagnosis && (
          <div className="mx-auto max-w-7xl pb-6">
            <DiagnosisCard data={diagnosis} showScanInfo={false} />
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
