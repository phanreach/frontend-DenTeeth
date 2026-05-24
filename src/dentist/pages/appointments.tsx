import { Funnel, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
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
} from "../../components/constants/dentist-appointments-data";
import type { Appointment } from "../types/calendar";

type FilterMode = "day" | "month" | "year";
type SortMode = "date" | "name";

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "rejected";

function parseAppointmentDate(value: string): Date {
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date;
  return new Date(2026, 4, 8);
}

export default function Appointments() {
  const [appointments, setAppointments] = useState(APPOINTMENTS_PAGE_DATA.appointments);
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
    setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
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

    setShowRescheduleModal(false);
    setActiveId(null);
  };

  const tabs = APPOINTMENTS_PAGE_DATA.tabs.map((tab) => ({
    ...tab,
    count: statusCounts[tab.key as StatusFilter] ?? tab.count,
  }));

  return (
    <main className="mx-auto w-full max-w-[1134px] space-y-4 px-4 pb-24 lg:px-6 lg:pb-10">
      <section className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700/60">
            {APPOINTMENTS_PAGE_DATA.heading.eyebrow}
          </p>
          <h1
            className="mt-1 text-2xl font-bold leading-8 text-neutral-900 lg:text-4xl"
            style={{ fontFamily: "'Fraunces', 'DM Serif Display', Georgia, serif" }}
          >
            {APPOINTMENTS_PAGE_DATA.heading.title}
          </h1>
          <p className="text-sm text-slate-500">{APPOINTMENTS_PAGE_DATA.heading.dateLabel}</p>
        </div>

        <button className="grid size-9 place-items-center rounded-2xl bg-slate-100 text-slate-500">
          <SlidersHorizontal className="size-4" />
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {APPOINTMENTS_PAGE_DATA.overviewCards.map((item) => (
          <AppointmentsOverviewCard key={item.title} item={item} />
        ))}
      </section>

      <section className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-tight text-slate-500">Filter by Date</p>
        <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
          {(["day", "month", "year"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setFilterMode(mode);
                if (mode !== "day") setSelectedDateChip("all");
              }}
              className={`rounded-[10px] px-2.5 py-1 capitalize ${
                filterMode === mode ? "bg-white text-neutral-900 shadow" : "text-slate-500"
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
              className="contents"
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

      <section className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patient name, condition..."
            className="h-10 w-full rounded-2xl bg-slate-100 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <button
          onClick={() => setSortMode((prev) => (prev === "date" ? "name" : "date"))}
          className="inline-flex h-10 items-center gap-1.5 rounded-2xl bg-slate-100 px-3.5 text-xs font-semibold text-slate-500"
        >
          <Funnel className="size-3.5" />
          Sort: {sortMode === "date" ? "Date" : "Name"}
        </button>
      </section>

      <section className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as StatusFilter)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              statusFilter === tab.key ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {tab.label}{" "}
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${statusFilter === tab.key ? "bg-white/20" : "bg-black/10"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
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
          if (!activeId) return;
          setAppointments((prev) => prev.filter((item) => item.id !== activeId));
          setShowRejectModal(false);
          setActiveId(null);
        }}
      />

      <MobileBottomNav active="bookings" />
    </main>
  );
}
