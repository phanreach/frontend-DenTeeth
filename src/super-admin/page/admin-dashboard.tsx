// admin-dashboard.tsx

import { TrendingUp } from "lucide-react";
import CardStat from "../../components/card-stat";
import { COOKIE_KEYS, getCookie } from "../../utils/cookies";

export default function AdminDashboard() {
  const username = getCookie(COOKIE_KEYS.username);
  const stats = [
    {
      id: "patients",
      title: "Total Patients",
      value: 150,
      icon: "users" as const,
      iconColor: "text-green-500",
    },
    {
      id: "dentists",
      title: "Total Dentists",
      value: 99,
      icon: "Stethoscope" as const,
      iconColor: "text-blue-500",
    },
    {
      id: "ai-scan",
      title: "AI Scans Performed",
      value: 15000,
      icon: "Microscope" as const,
      iconColor: "text-red-500",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back {username}
          </h1>

          <p className="text-slate-500 mt-1">
            Monitor your AI dental platform performance.
          </p>
        </div>

        <button className="h-11 px-5 rounded-xl bg-[#1a3cff] text-white font-medium shadow-lg hover:opacity-90 transition">
          Generate Report
        </button>
      </div>
      <div>
        <CardStat stats={stats} isLoading={false} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* RECENT SCANS */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent AI Scans
              </h2>

              <p className="text-sm text-slate-500">
                Latest dental scan activities
              </p>
            </div>

            <button className="text-sm text-[#1a3cff] font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "John Doe",
                result: "Possible cavity detected",
                status: "High Risk",
              },
              {
                name: "Sarah Kim",
                result: "Healthy teeth detected",
                status: "Low Risk",
              },
              {
                name: "Michael Tan",
                result: "Plaque buildup detected",
                status: "Medium Risk",
              },
            ].map((scan) => (
              <div
                key={scan.name}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{scan.name}</h3>

                  <p className="text-sm text-slate-500 mt-1">{scan.result}</p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1a3cff]/10 text-[#1a3cff]">
                  {scan.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Growth</h2>

              <p className="text-sm text-slate-500">
                Monthly platform performance
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">User Growth</span>

                <span className="font-semibold text-slate-900">82%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[82%] bg-[#1a3cff] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">AI Accuracy</span>

                <span className="font-semibold text-slate-900">85%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[85%] bg-green-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Appointment Rate</span>

                <span className="font-semibold text-slate-900">67%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[67%] bg-amber-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
