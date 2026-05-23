import { CalendarDays, ClipboardList, LayoutGrid, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileBottomNavProps {
  active?: "dashboard" | "bookings" | "calendar" | "services";
}

export default function MobileBottomNav({ active = "dashboard" }: MobileBottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white lg:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 px-2">
        <button
          onClick={() => navigate("/dentist/dashboard")}
          className="flex flex-col items-center justify-center gap-0.5"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-xl ${
              active === "dashboard" ? "bg-violet-100 text-indigo-700" : "text-slate-500"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </span>
          <span
            className={`text-[10px] font-medium ${
              active === "dashboard" ? "text-indigo-700" : "text-slate-500"
            }`}
          >
            Dashboard
          </span>
        </button>

        <button className="flex flex-col items-center justify-center gap-0.5 text-slate-500">
          <ClipboardList className="h-4 w-4" />
          <span className="text-[10px] font-medium">Bookings</span>
        </button>

        <button
          onClick={() => navigate("/dentist/calendar")}
          className="flex flex-col items-center justify-center gap-0.5"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-xl ${
              active === "calendar" ? "bg-violet-100 text-indigo-700" : "text-slate-500"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
          </span>
          <span
            className={`text-[10px] font-medium ${
              active === "calendar" ? "text-indigo-700" : "text-slate-500"
            }`}
          >
            Calendar
          </span>
        </button>

        <button
          onClick={() => navigate("/dentist/service-configuration")}
          className="flex flex-col items-center justify-center gap-0.5"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-xl ${
              active === "services" ? "bg-violet-100 text-indigo-700" : "text-slate-500"
            }`}
          >
            <Settings className="h-4 w-4" />
          </span>
          <span
            className={`text-[10px] font-medium ${
              active === "services" ? "text-indigo-700" : "text-slate-500"
            }`}
          >
            Services
          </span>
        </button>
      </div>
    </nav>
  );
}
