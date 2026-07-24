"use client";

import { useState } from "react";
import type { Diagnosis } from "@/types/api";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Verified, ScanSearch } from "lucide-react";

type DiagnosisFinding = Diagnosis["findings"][number] & {
  coverage?: unknown;
  coverage_pct?: unknown;
  confidence?: unknown;
};

export default function DiagnosisCard({ data }: { data: Diagnosis }) {
  const [showOverlay, setShowOverlay] = useState(true);
  const findings: DiagnosisFinding[] = data.findings ?? [];
  const diseases = data.diseases ?? [];

  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg md:flex md:min-h-[320px]">
      <div className="group relative h-64 overflow-hidden bg-slate-900 md:h-auto md:w-1/3 lg:w-[30%]">
        <img
          src={data.imageUrl}
          alt="Original Scan"
          className="h-full w-full object-contain transition duration-700 group-hover:scale-105"
        />

        {data.overlayUrl && (
          <img
            src={data.overlayUrl}
            alt="AI Detection"
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
            style={{ opacity: showOverlay ? 0.75 : 0 }}
          />
        )}

        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
            AI Analysis
          </span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setShowOverlay((prev) => !prev);
          }}
          disabled={!data.overlayUrl}
          className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/70"
          aria-label={showOverlay ? "Hide AI detection" : "Show AI detection"}
        >
          {showOverlay ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 md:p-8">
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Scan ID #{data.diagnosisId}
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                Oral Health Analysis
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-semibold">
                {new Date(data.createdAt).toLocaleDateString()}
              </p>

              <p className="text-xs text-slate-400">
                {new Date(data.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {findings.length === 0 && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  No visible issues detected
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The analysis did not return any disease findings for this
                  scan.
                </p>
              </div>
            )}

            {findings.map((item) => {
              const disease = diseases.find((d) => d.id === item.diseaseId);
              const coveragePct = item.coveragePct;

              return (
                <div
                  key={`${item.diseaseId}-${item.className}`}
                  className=" p-4"
                >
                  <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold capitalize text-slate-800">
                      {item.className}
                    </span>

                    <span className="text-sm font-bold text-primary">
                      {coveragePct.toFixed(0)}% Coverage
                    </span>
                  </div>

                  <Progress value={coveragePct} className="h-2" />

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {disease?.description ?? "No description available."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex -space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-50">
              <Verified className="h-4 w-4 text-blue-600" />
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal-50">
              <ScanSearch className="h-4 w-4 text-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
