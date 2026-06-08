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
  INITIAL_SELECTED_DATE_ISO,
  INITIAL_VISIBLE_MONTH,
  WEEKDAY_LABELS,
} from "../constants/calendar-data";
import useMyAppointments from "../hooks/use-my-appointments";
import useUpdateAppointmentStatus from "../hooks/use-update-appointment-status";
import useRescheduleAppointment from "../hooks/use-reschedule-appointment";
import type { AppointmentStatus as ApiStatus } from "../types/appointment";

interface CalendarDay {
  date: Date;
  iso: string;
  day: number;
  inCurrentMonth: boolean;
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-500",
  completed: "bg-indigo-400",
};

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  confirmed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  completed: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400",
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
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<{
    appointment: Appointment;
    fromIso: string;
  } | null>(null);

  const { data: apiAppointments, isLoading } = useMyAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const rescheduleMutation = useRescheduleAppointment();

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    if (!apiAppointments) return map;

    apiAppointments.forEach((item) => {
      const date = item.appointmentDate;
      if (!map[date]) map[date] = [];
      map[date].push({
        id: String(item.id),
        patientName: item.patientName,
        initials: item.patientName.split(" ").map(n => n[0]).join("").toUpperCase(),
        service: item.serviceName,
        time: item.startAt,
        status: item.status.toLowerCase() as any,
        price: item.price,
        age: 25,
        patientId: `P-${item.id}`,
        phone: "+1 234 567 890",
        email: "patient@example.com",
        visitType: "In-clinic visit",
        notes: item.remarks || "",
      });
    });
    return map;
  }, [apiAppointments]);

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
    const apiStatus: ApiStatus = status.toUpperCase() as ApiStatus;
    updateStatusMutation.mutate({ id: Number(activeAppointmentId), status: apiStatus });
  };

  const rejectAppointment = () => {
    if (!activeAppointmentId) return;
    updateStatusMutation.mutate({ id: Number(activeAppointmentId), status: "REJECTED" });
    setActiveAppointmentId(null);
  };

  const handleRescheduleSuggest = (newDateIso: string, hourId: number) => {
    if (!rescheduleTarget) return;

    rescheduleMutation.mutate({
      id: Number(rescheduleTarget.appointment.id),
      data: {
        appointmentDate: newDateIso,
        hourId: hourId,
      },
    }, {
      onSuccess: () => {
        setRescheduleTarget(null);
        setSelectedIso(newDateIso);
      }
    });
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-700 border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="search"
            placeholder="Search patient or condition..."
            className="h-11 w-full rounded-2xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 dark:focus:border-indigo-500"
          />
        </div>

        <div className="flex shrink-0 items-center self-start rounded-2xl border border-border bg-card p-1 sm:self-auto shadow-sm">
          <button
            onClick={() =>
              setVisibleMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
              )
            }
            className="grid size-9 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>

          <p className="min-w-32 px-4 text-center text-sm font-bold text-foreground">
            {formatMonthYear(visibleMonth)}
          </p>

          <button
            onClick={() =>
              setVisibleMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
              )
            }
            className="grid size-9 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {WEEKDAY_LABELS.map((day) => (
            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
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
                className={`group relative h-16 cursor-pointer border-r border-b border-border p-1 text-center transition last:border-r-0 hover:bg-muted/50 lg:h-20 lg:p-2 ${
                  isSelected ? "bg-indigo-600/5 dark:bg-indigo-500/5" : ""
                }`}
              >
                <div
                  className={`mx-auto grid size-7 place-items-center rounded-full text-[11px] font-bold transition lg:size-8 lg:text-xs ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500"
                      : day.inCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground/30"
                  }`}
                >
                  {day.day}
                </div>

                <div className="mt-1.5 flex h-1.5 items-center justify-center gap-1">
                  {statusDots.map((status) => (
                    <span
                      key={status}
                      className={`size-1 rounded-full shadow-sm ${STATUS_COLORS[status]}`}
                    />
                  ))}
                </div>
                
                {isSelected && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 dark:bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-500" /> Pending
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" /> Confirmed
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-500" /> Completed
        </div>
      </div>

      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-xl font-black text-foreground">
            {formatLongDate(selectedDate)}
          </h2>
          <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground">
            {selectedAppointments.length} appointment
            {selectedAppointments.length === 1 ? "" : "s"}
          </p>
        </div>

        {selectedAppointments.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {selectedAppointments.map((appointment) => (
              <button
                key={appointment.id}
                type="button"
                onClick={() => setActiveAppointmentId(appointment.id)}
                className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/5 dark:hover:shadow-indigo-500/5"
              >
                <div
                  className={`grid size-12 place-items-center rounded-2xl text-base font-black text-white shadow-lg transition-transform group-hover:scale-105 ${
                    appointment.status === "confirmed"
                      ? "bg-emerald-500 shadow-emerald-500/20"
                      : appointment.status === "pending"
                        ? "bg-amber-500 shadow-amber-500/20"
                        : "bg-indigo-500 shadow-indigo-500/20"
                  }`}
                >
                  {appointment.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-base font-bold text-foreground">{appointment.patientName}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[appointment.status]}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <p className="truncate text-xs font-bold text-indigo-600 dark:text-indigo-400">{appointment.service}</p>

                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/60">
                    <Clock3 className="size-3.5" />
                    {appointment.time}
                  </div>
                </div>

                <ChevronRight className="size-5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid min-h-48 place-items-center rounded-2xl border border-border bg-card/50 text-center text-muted-foreground/40">
            <div className="space-y-3">
              <CalendarX2 className="mx-auto size-12 opacity-20" />
              <p className="text-lg font-bold uppercase tracking-widest">No appointments</p>
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
