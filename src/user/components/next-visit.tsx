import type { AppointmentData } from "@/types/api";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NextVisit({
  data,
}: {
  data: AppointmentData | undefined;
}) {
  const navigate = useNavigate();
  if (!data) return null;

  const date = new Date(data.appointmentDate);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const year = date.getFullYear();

  return (
    <div className="relative rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5 bg-white">
      <div className="flex items-center justify-between px-5 py-3.5 border-b">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            Upcoming Appointment
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-stretch gap-4">
          <div className="flex min-w-[76px] flex-col items-center justify-center rounded-2xl px-3 py-4 text-center shadow-md bg-secondary">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-primary">
              {month}
            </p>
            <p className="mt-0.5 text-4xl font-black leading-none text-primary">
              {day}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-primary">
              {weekday.slice(0, 3)} · {year}
            </p>
          </div>

          <div className="flex flex-1 min-w-0 flex-col justify-between gap-2">
            <div>
              <p className="truncate text-[15px] font-bold text-gray-900 leading-tight">
                {data.serviceName}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-primary" />
                <p className="truncate text-sm text-gray-500">
                  Dr. {data.dentistName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex bg-secondary items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {data.startAt} – {data.endAt}
              </div>
              <div className="inline-flex items-center bg-secondary gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Dental Clinic
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t">
        <p className="text-xs text-gray-400">Need to change your time?</p>
        <button
          onClick={() => navigate("/history")}
          className="group flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-95 bg-primary"
        >
          Reschedule
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
