import CardStat from "../../components/card-stat";
import { COOKIE_KEYS, getCookie } from "../../utils/cookies";
import UseDentistQuery from "@/components/hook/use-dentist-query";
import DentistCard from "@/landing/dentist-card";

export default function Home() {
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

  const { data = [] } = UseDentistQuery();

  return (
    <div className="space-y-8 p-8">
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
      <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((dentist) => (
            <DentistCard key={dentist.id} data={dentist} />
          ))}
        </div>
      </div>
    </div>
  );
}
