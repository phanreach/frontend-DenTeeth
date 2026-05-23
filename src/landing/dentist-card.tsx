import { Calendar, Clock, MapPin } from "lucide-react";
import type { dentist } from "../types/api";
import { useNavigate } from "react-router-dom";

export default function DentistCard({ data }: { data: dentist }) {
  const navigate = useNavigate();

  const handleNavigate = (dentistId: number) => {
    navigate(`/find-dentist/${dentistId}`);
  };
  return (
    <div className="max-w-xs overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
      <div className="relative">
        <img
          src={
            data.photoUrl ||
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
          }
          alt={data.name}
          className="h-48 w-full object-cover"
        />

        <span className="absolute right-3 top-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          Available
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <p className="text-base font-semibold text-gray-900">{data.name}</p>

          <p className="mt-0.5 text-sm font-medium text-primary">
            {data.profession ?? "Dentist"}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-y border-gray-100 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>

            <span className="text-xs text-gray-500">
              {data.clinicName ?? "Clinic not available"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Clock className="h-4 w-4 text-gray-500" />
            </div>

            <span className="text-xs text-gray-500">
              {data.yearsOfExperience
                ? `${data.yearsOfExperience} years experience`
                : "Experience not available"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>

            <span className="text-xs text-gray-500">
              {data.services?.length || 0} services available
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div>
            <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">
              Consultation fee
            </p>

            <p className="text-lg font-semibold text-gray-900">
              ${data.priceRange?.[0] ?? 0} - ${data.priceRange?.[1] ?? 0}
            </p>
          </div>
          <div key={data.id}>
            <button
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-blue-800 active:scale-95"
              onClick={() => handleNavigate(data.id)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
