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
    navigate(`/find-dentist`);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back {username}
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor your AI dental platform performance.
        </p>
      </div>

      <div>
        <CardStat stats={stats} isLoading={false} />
      </div>
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          <Scan />
        </div>
      </div>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Find your dentists
          </h1>

          <button
            className="flex items-center gap-2 font-medium text-gray-500 transition hover:text-primary"
            onClick={handleNavigate}
          >
            <span>See more</span>

            <MoveRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.slice(0, 4).map((dentist) => (
            <DentistCard key={dentist.id} data={dentist} />
          ))}
        </div>
      </div>
    </div>
  );
}
