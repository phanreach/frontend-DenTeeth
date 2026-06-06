import { useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import AppointmentDetailModal from "../../components/dentist/appointment-detail-modal";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import RescheduleAppointmentModal from "../../components/dentist/reschedule-appointment-modal";
import type { Appointment, AppointmentStatus } from "../types/calendar";
import {
  APPOINTMENTS_BY_DATE,
  INITIAL_SELECTED_DATE_ISO,
  INITIAL_VISIBLE_MONTH,
  WEEKDAY_LABELS,
} from "../constants/calendar-data";

interface CalendarDay {
  date: Date;
  iso: string;
  day: number;
  inCurrentMonth: boolean;
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-500",
  completed: "bg-blue-400",
};

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  completed: "bg-blue-50 text-blue-700",
};

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMonthGrid(monthDate: Date): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      iso: toIso(date),
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === month,
    };
  });
}

function getStatusCounts(appointments: Appointment[]): AppointmentStatus[] {
  const ordered: AppointmentStatus[] = ["pending", "confirmed", "completed"];

  return ordered.filter((status) => appointments.some((item) => item.status === status));
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Calendar() {
  const [visibleMonth, setVisibleMonth] = useState(INITIAL_VISIBLE_MONTH);
  const [selectedIso, setSelectedIso] = useState(INITIAL_SELECTED_DATE_ISO);
  const [appointmentsByDate, setAppointmentsByDate] = useState(APPOINTMENTS_BY_DATE);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<{
    appointment: Appointment;
    fromIso: string;
  } | null>(null);

  const monthDays = useMemo(() => getMonthGrid(visibleMonth), [visibleMonth]);

  const selectedDate = useMemo(() => {
    const [y, m, d] = selectedIso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedIso]);

  const selectedAppointments = appointmentsByDate[selectedIso] ?? [];
  const activeAppointment = selectedAppointments.find(
    (appointment) => appointment.id === activeAppointmentId,
  );

  const updateAppointmentStatus = (status: AppointmentStatus) => {
    if (!activeAppointmentId) return;

    const patientName = activeAppointment?.patientName;

    setAppointmentsByDate((prev) => {
      const dayAppointments = prev[selectedIso] ?? [];
      const updatedDayAppointments = dayAppointments.map((appointment) =>
        appointment.id === activeAppointmentId ? { ...appointment, status } : appointment,
      );

      return {
        ...prev,
        [selectedIso]: updatedDayAppointments,
      };
    });

    if (status === "confirmed") {
      toast.success(`Appointment for ${patientName} confirmed.`);
    } else if (status === "completed") {
      toast.success(`Appointment for ${patientName} marked as completed.`);
    }
  };

  const rejectAppointment = () => {
    if (!activeAppointmentId) return;

    const patientName = activeAppointment?.patientName;

    setAppointmentsByDate((prev) => {
      const dayAppointments = prev[selectedIso] ?? [];
      const updatedDayAppointments = dayAppointments.filter(
        (appointment) => appointment.id !== activeAppointmentId,
      );

      return {
        ...prev,
        [selectedIso]: updatedDayAppointments,
      };
    });

    toast.error(`Appointment for ${patientName} rejected.`);
    setActiveAppointmentId(null);
  };

  const handleRescheduleSuggest = (newDateIso: string, newTime: string) => {
    if (!rescheduleTarget) return;

    const patientName = rescheduleTarget.appointment.patientName;

    setAppointmentsByDate((prev) => {
      const fromList = prev[rescheduleTarget.fromIso] ?? [];
      const moved = fromList.find((item) => item.id === rescheduleTarget.appointment.id);
      if (!moved) return prev;

      const updatedFrom = fromList.filter((item) => item.id !== moved.id);
      const updatedTo = [
        ...(prev[newDateIso] ?? []),
        { ...moved, time: newTime, status: "pending" as AppointmentStatus },
      ];

      return {
        ...prev,
        [rescheduleTarget.fromIso]: updatedFrom,
        [newDateIso]: updatedTo,
      };
    });

    toast.info(`Reschedule suggestion sent to ${patientName}.`);
    setSelectedIso(newDateIso);
    setRescheduleTarget(null);
  };

  return (
    <main className="mx-auto w-full max-w-[1134px] space-y-4 px-4 pt-4 pb-24 lg:mx-0 lg:max-w-none lg:px-6 lg:pb-10">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search patient or condition..."
            className="h-10 w-full rounded-xl bg-white pl-10 pr-4 text-sm text-neutral-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex shrink-0 items-center self-start rounded-2xl bg-white p-1 sm:self-auto">
          <button
            onClick={() =>
              setVisibleMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
              )
            }
            className="grid size-8 cursor-pointer place-items-center rounded-xl text-slate-500 transition hover:bg-[#432DD7]"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4 hover:text-white" />
          </button>

          <p className="min-w-28 px-4 text-center text-sm font-semibold text-neutral-900">
            {formatMonthYear(visibleMonth)}
          </p>

          <button
            onClick={() =>
              setVisibleMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
              )
            }
            className="grid size-8 cursor-pointer place-items-center rounded-xl text-slate-500 transition hover:bg-[#432DD7]"
            aria-label="Next month"
          >
            <ChevronRight className="size-4 hover:text-white" />
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-black/5 bg-white">
        <div className="grid grid-cols-7 border-b border-black/5">
          {WEEKDAY_LABELS.map((day) => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {monthDays.map((day) => {
            const appointments = appointmentsByDate[day.iso] ?? [];
            const statusDots = getStatusCounts(appointments);
            const isSelected = day.iso === selectedIso;

            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => setSelectedIso(day.iso)}
                className={`h-14 cursor-pointer border-r border-b border-black/5 p-1 text-center transition last:border-r-0 hover:bg-slate-50 lg:h-16 lg:p-1.5 ${
                  isSelected ? "bg-violet-100" : "bg-white"
                }`}
              >
                <div
                  className={`mx-auto grid size-6 place-items-center rounded-full text-[11px] font-semibold lg:size-7 lg:text-xs ${
                    isSelected
                      ? "bg-indigo-700 text-white"
                      : day.inCurrentMonth
                        ? "text-neutral-900"
                        : "text-slate-400"
                  }`}
                >
                  {day.day}
                </div>

                <div className="mt-1 flex h-1.5 items-center justify-center gap-1">
                  {statusDots.map((status) => (
                    <span
                      key={status}
                      className={`size-1.5 rounded-full ${STATUS_COLORS[status]}`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" /> Pending
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" /> Confirmed
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-blue-400" /> Completed
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">
            {formatLongDate(selectedDate)}
          </h2>
          <p className="text-sm text-slate-500">
            {selectedAppointments.length} appointment
            {selectedAppointments.length === 1 ? "" : "s"}
          </p>
        </div>

        {selectedAppointments.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {selectedAppointments.map((appointment) => (
              <button
                key={appointment.id}
                type="button"
                onClick={() => setActiveAppointmentId(appointment.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-indigo-200 hover:shadow-sm"
              >
                <div
                  className={`grid size-10 place-items-center rounded-full text-sm font-bold text-white ${
                    appointment.status === "confirmed"
                      ? "bg-emerald-500"
                      : appointment.status === "pending"
                        ? "bg-amber-500"
                        : "bg-blue-400"
                  }`}
                >
                  {appointment.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-base font-semibold text-neutral-900 lg:text-xl">{appointment.patientName}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_BADGE[appointment.status]}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <p className="truncate text-sm font-medium text-teal-600">{appointment.service}</p>

                  <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Clock3 className="size-3.5" />
                    {appointment.time}
                  </div>
                </div>

                <ChevronRight className="size-4 shrink-0 text-slate-500" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid min-h-32 place-items-center rounded-2xl border border-black/10 bg-white text-center text-slate-500">
            <div className="space-y-2">
              <CalendarX2 className="mx-auto size-8 text-slate-300" />
              <p className="text-xl">No appointments on this day</p>
            </div>
          </div>
        )}
      </section>

      <div className="sr-only" aria-hidden>
        <CalendarClock />
      </div>
      <AppointmentDetailModal
        appointment={activeAppointment ?? null}
        selectedDate={selectedDate}
        onClose={() => setActiveAppointmentId(null)}
        onConfirm={() => updateAppointmentStatus("confirmed")}
        onReject={rejectAppointment}
        onReschedule={() => {
          if (!activeAppointment) return;
          setRescheduleTarget({ appointment: activeAppointment, fromIso: selectedIso });
          setActiveAppointmentId(null);
        }}
        onMarkComplete={() => updateAppointmentStatus("completed")}
      />
      <RescheduleAppointmentModal
        appointment={rescheduleTarget?.appointment ?? null}
        anchorDate={selectedDate}
        onClose={() => setRescheduleTarget(null)}
        onSuggest={handleRescheduleSuggest}
      />
      <MobileBottomNav active="calendar" />
    </main>
  );
}
