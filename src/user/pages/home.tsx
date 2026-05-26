import CardStat from "../../components/card-stat";
import { COOKIE_KEYS, getCookie } from "../../utils/cookies";
import UseDentistQuery from "@/components/hook/use-dentist-query";
import DentistCard from "@/landing/dentist-card";
import Scan from "../components/scan";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const username = getCookie(COOKIE_KEYS.username);

  const stats = [
    {
      id: "appointment",
      title: "Total Appointment",
      value: 5,
      icon: "Calendar" as const,
      iconColor: "text-green-500",
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
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/find-dentist");
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome back {username}
        </h1>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Monitor your AI dental platform performance.
        </p>
      </div>

      {/* STATS */}
      <div>
        <CardStat stats={stats} isLoading={false} />
      </div>

      {/* AI SCAN */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Scan />
        </div>
      </div>

      {/* DENTIST SECTION */}
      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Find your dentists
          </h1>

          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-primary sm:text-base"
            onClick={handleNavigate}
          >
            <span>See more</span>

            <MoveRight className="h-5 w-5" />
          </button>
        </div>

        {/* DENTIST GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.slice(0, 4).map((dentist) => (
            <DentistCard key={dentist.id} data={dentist} />
          ))}
        </div>
      </div>
    </div>
  );
}
