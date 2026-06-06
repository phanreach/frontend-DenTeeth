import { Funnel, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppointmentBookingCard from "../../components/dentist/appointment-booking-card";
import AppointmentDetailModal from "../../components/dentist/appointment-detail-modal";
import AppointmentsDateChip from "../../components/dentist/appointments-date-chip";
import AppointmentsOverviewCard from "../../components/dentist/appointments-overview-card";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import RejectBookingModal from "../../components/dentist/reject-booking-modal";
import RescheduleAppointmentModal from "../../components/dentist/reschedule-appointment-modal";
import {
  APPOINTMENTS_PAGE_DATA,
  type AppointmentItem,
} from "../constants/dentist-appointments-data";
import type { Appointment } from "../types/calendar";
import useDentistAppointments from "../hooks/use-dentist-appointments";

type FilterMode = "day" | "month" | "year";
type SortMode = "date" | "name";

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "rejected";

function parseAppointmentDate(value: string): Date {
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date;
  return new Date(2026, 4, 8);
}

export default function Appointments() {
  const [appointments, setAppointments] = useDentistAppointments();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>("day");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedDateChip, setSelectedDateChip] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [searchTerm, setSearchTerm] = useState("");

  const activeItem = appointments.find((item) => item.id === activeId) ?? null;

  const activeAppointment = useMemo<Appointment | null>(() => {
    if (!activeItem) return null;

    return {
      id: activeItem.id,
      patientName: activeItem.name,
      initials: activeItem.initials,
      service: activeItem.service,
      time: activeItem.time,
      status: activeItem.status,
      age: activeItem.age,
      patientId: activeItem.patientId,
      phone: activeItem.phone,
      email: activeItem.email,
      visitType: activeItem.visitType,
      notes: activeItem.note,
    };
  }, [activeItem]);

  const selectedDate = useMemo(() => {
    if (!activeItem) return new Date(2026, 4, 8);
    return parseAppointmentDate(activeItem.date);
  }, [activeItem]);

  const statusCounts = useMemo(() => {
    return {
      all: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      confirmed: appointments.filter((item) => item.status === "confirmed").length,
      completed: 0,
      rejected: 0,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (statusFilter !== "all" && statusFilter !== "rejected") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.service.toLowerCase().includes(query) ||
          item.note.toLowerCase().includes(query),
      );
    }

    if (filterMode === "day" && selectedDateChip !== "all") {
      result = result.filter((item) => {
        const date = parseAppointmentDate(item.date);
        return String(date.getDate()) === selectedDateChip;
      });
    }

    if (filterMode === "month") {
      const month = parseAppointmentDate(appointments[0]?.date ?? "May 8, 2026").getMonth();
      result = result.filter((item) => parseAppointmentDate(item.date).getMonth() === month);
    }

    if (filterMode === "year") {
      const year = parseAppointmentDate(appointments[0]?.date ?? "May 8, 2026").getFullYear();
      result = result.filter((item) => parseAppointmentDate(item.date).getFullYear() === year);
    }

    if (sortMode === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => parseAppointmentDate(a.date).getTime() - parseAppointmentDate(b.date).getTime());
    }

    return result;
  }, [appointments, filterMode, searchTerm, selectedDateChip, sortMode, statusFilter]);

  const setStatus = (id: string, status: AppointmentItem["status"]) => {
    const appointment = appointments.find((item) => item.id === id);

    if (!appointment) {
      toast.error("Appointment was not found. Refresh and try again.");
      return;
    }

    setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    if (status === "confirmed") {
      toast.success(`${appointment.name}'s appointment confirmed.`);
    }
  };

  const handleRescheduleSuggest = (newDateIso: string, newTime: string) => {
    if (!activeId) return;

    const nextDate = new Date(`${newDateIso}T00:00:00`);
    const formattedDate = nextDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setAppointments((prev) =>
      prev.map((item) =>
        item.id === activeId ? { ...item, date: formattedDate, time: newTime, status: "pending" } : item,
      ),
    );

    toast.warning("Appointment moved. Patient confirmation is still pending.");
    setShowRescheduleModal(false);
    setActiveId(null);
  };

  const tabs = APPOINTMENTS_PAGE_DATA.tabs.map((tab) => ({
    ...tab,
    count: statusCounts[tab.key as StatusFilter] ?? tab.count,
  }));

  const currentDateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Phnom_Penh",
  }).format(new Date());

  return (
    <main className="mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10">
      <section className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{currentDateLabel}</p>
        <button className="grid size-9 cursor-pointer place-items-center rounded-2xl bg-muted text-muted-foreground transition hover:bg-muted/80 active:scale-95">
          <SlidersHorizontal className="size-4" />
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {APPOINTMENTS_PAGE_DATA.overviewCards.map((item) => (
          <AppointmentsOverviewCard key={item.title} item={item} />
        ))}
      </section>

      <section className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Filter by Date</p>
        <div className="flex rounded-xl bg-muted p-0.5 text-[11px] font-bold">
          {(["day", "month", "year"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setFilterMode(mode);
                if (mode !== "day") setSelectedDateChip("all");
              }}
              className={`h-7 cursor-pointer rounded-[10px] px-3 capitalize transition ${
                filterMode === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {filterMode === "day" ? (
        <section className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
          {APPOINTMENTS_PAGE_DATA.dateChips.map((item, index) => (
            <button
              key={`${item.dayLabel}-${item.dayNumber}-${index}`}
              onClick={() => setSelectedDateChip(item.dayLabel === "All" ? "all" : item.dayNumber)}
              className="contents cursor-pointer"
            >
              <AppointmentsDateChip
                item={{
                  ...item,
                  active:
                    item.dayLabel === "All"
                      ? selectedDateChip === "all"
                      : selectedDateChip === item.dayNumber,
                }}
              />
            </button>
          ))}
        </section>
      ) : null}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patient name, condition..."
            className="h-11 w-full rounded-2xl border border-indigo-600/10 bg-card pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-indigo-600/40 focus:ring-4 focus:ring-indigo-600/5 dark:border-indigo-500/10 dark:focus:border-indigo-500/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortMode((prev) => (prev === "date" ? "name" : "date"))}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl bg-indigo-600/10 px-4 text-xs font-bold text-indigo-600 transition hover:bg-indigo-600/20 active:scale-95 dark:bg-indigo-500/20 dark:text-indigo-400"
          >
            <Funnel className="size-3.5" />
            Sort: {sortMode === "date" ? "Date" : "Name"}
          </button>
          <button className="grid size-11 cursor-pointer place-items-center rounded-2xl bg-muted text-muted-foreground transition hover:bg-muted/80 active:scale-95">
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
      </section>

      <section className="scrollbar-hide flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as StatusFilter)}
            className={`flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-xs font-bold transition active:scale-95 ${
              statusFilter === tab.key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                statusFilter === tab.key ? "bg-white/20 text-white" : "bg-black/5 text-muted-foreground/60 dark:bg-white/5"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredAppointments.map((item) => (
          <AppointmentBookingCard
            key={item.id}
            item={item}
            onOpen={() => setActiveId(item.id)}
            onConfirm={() => setStatus(item.id, "confirmed")}
            onReject={() => {
              setActiveId(item.id);
              setShowRejectModal(true);
            }}
            onMove={() => {
              setActiveId(item.id);
              setShowRescheduleModal(true);
            }}
          />
        ))}
      </section>

      <AppointmentDetailModal
        appointment={showRescheduleModal || showRejectModal ? null : activeAppointment}
        selectedDate={selectedDate}
        onClose={() => setActiveId(null)}
        onConfirm={() => {
          if (!activeId) return;
          setStatus(activeId, "confirmed");
        }}
        onReject={() => {
          setShowRejectModal(true);
        }}
        onReschedule={() => {
          setShowRescheduleModal(true);
        }}
        onMarkComplete={() => {
          if (!activeId) return;
          setAppointments((prev) => prev.filter((item) => item.id !== activeId));
          toast.success("Appointment marked complete.");
          setActiveId(null);
        }}
      />

      <RescheduleAppointmentModal
        appointment={showRescheduleModal ? activeAppointment : null}
        anchorDate={selectedDate}
        onClose={() => {
          setShowRescheduleModal(false);
          setActiveId(null);
        }}
        onSuggest={handleRescheduleSuggest}
      />

      <RejectBookingModal
        open={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setActiveId(null);
        }}
        onConfirm={() => {
          if (!activeId) {
            toast.error("Choose an appointment before rejecting.");
            return;
          }
          setAppointments((prev) => prev.filter((item) => item.id !== activeId));
          toast.error("Appointment cancelled.");
          setShowRejectModal(false);
          setActiveId(null);
        }}
      />

      <MobileBottomNav active="bookings" />
    </main>
  );
}
