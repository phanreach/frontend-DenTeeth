import type { Diagnosis } from "@/types/api";
import {
  Info,
  AlertTriangle,
  Search,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

export default function Disease({ data }: { data: Diagnosis }) {
  const diseases = data.diseases ?? [];

  if (diseases.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Understanding your results
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Here's what each finding means, in plain terms.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {diseases.map((disease) => (
          <div key={disease.id} className="py-8 first:pt-0 last:pb-0">
            {/* Disease title */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold capitalize text-slate-900">
                {disease.name}
              </h3>
            </div>

            <p className="mb-6 text-[15px] leading-7 text-slate-600">
              {disease.description}
            </p>

            {/* Symptoms / causes / treatment as a simple list, not boxed cards */}
            <dl className="space-y-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <dt className="text-sm font-semibold text-slate-800">
                    What to look out for
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-600">
                    {disease.symptoms}
                  </dd>
                </div>
              </div>

              <div className="flex gap-3">
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <div>
                  <dt className="text-sm font-semibold text-slate-800">
                    Why it happens
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-600">
                    {disease.causes}
                  </dd>
                </div>
              </div>

              <div className="flex gap-3">
                <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <dt className="text-sm font-semibold text-slate-800">
                    How it's treated
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-600">
                    {disease.treatment}
                  </dd>
                </div>
              </div>
            </dl>

            {/* Prevention keeps its own light callout — it's the one thing worth visually separating */}
            <div className="mt-6 rounded-lg bg-emerald-50 p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  How to prevent it
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                {disease.prevention}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
