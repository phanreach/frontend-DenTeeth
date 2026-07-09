import { Calendar, Clock, MapPin } from "lucide-react";
import type { dentist } from "../types/api";
import { useNavigate } from "react-router-dom";

export default function DentistCard({ data }: { data: dentist }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/find-dentist/${data.id}`);
  };

  return (
    <div
      className="w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
    >
      <div className="relative">
        <img
          src={
            data.photoUrl ||
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
          }
          alt={data.name}
          className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
        />

        <span className="absolute right-3 top-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          Available
        </span>
      </div>

      <div className="p-4 md:p-5">
        <div className="mb-3">
          <p className="line-clamp-2 text-lg font-semibold leading-tight text-gray-900">
            {data.name}
          </p>

          <p className="mt-0.5 text-sm font-medium text-primary">
            {data.profession ?? "Dentist"}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-y border-gray-100 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <MapPin className="h-3.5 w-3.5 text-gray-500 md:h-4 md:w-4" />
            </div>

            <span className="min-w-0 flex-1 break-words text-sm text-gray-500">
              {data.clinicName ?? "Clinic not available"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 md:h-8 md:w-8">
              <Clock className="h-3.5 w-3.5 text-gray-500 md:h-4 md:w-4" />
            </div>

            <span className="text-xs text-gray-500 sm:text-sm">
              {data.yearsOfExperience
                ? `${data.yearsOfExperience} years experience`
                : "Experience not available"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Calendar className="h-3.5 w-3.5 text-gray-500 md:h-4 md:w-4" />
            </div>

            <span className="text-xs text-gray-500 sm:text-sm">
              {data.services?.length || 0} services available
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">
              Consultation fee
            </p>

            <p className="text-lg font-bold text-gray-900">
              ${data.priceRange?.[0] ?? 0} - ${data.priceRange?.[1] ?? 0}
            </p>
          </div>

          <button
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-800 active:scale-95 md:w-auto"
            onClick={(event) => {
              event.stopPropagation();
              handleNavigate();
            }}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
