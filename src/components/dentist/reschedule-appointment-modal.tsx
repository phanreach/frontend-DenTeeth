import { X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Appointment } from "../../dentist/types/calendar";

interface RescheduleAppointmentModalProps {
  appointment: Appointment | null;
  anchorDate: Date;
  onClose: () => void;
  onSuggest: (newDateIso: string, newTime: string) => void;
}

interface DateOption {
  iso: string;
  dayLabel: string;
  dateLabel: string;
  monthLabel: string;
}

const TIME_OPTIONS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildDateOptions(anchorDate: Date): DateOption[] {
  return Array.from({ length: 9 }, (_, idx) => {
    const date = new Date(anchorDate);
    date.setDate(anchorDate.getDate() + idx + 1);

    return {
      iso: toIso(date),
      dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateLabel: String(date.getDate()),
      monthLabel: date.toLocaleDateString("en-US", { month: "short" }),
    };
  });
}

export default function RescheduleAppointmentModal({
  appointment,
  anchorDate,
  onClose,
  onSuggest,
}: RescheduleAppointmentModalProps) {
  const dateOptions = useMemo(() => buildDateOptions(anchorDate), [anchorDate]);
  const [selectedDateIso, setSelectedDateIso] = useState(dateOptions[0]?.iso ?? "");
  const [selectedTime, setSelectedTime] = useState("");

  if (!appointment) return null;

  const canSubmit = Boolean(selectedDateIso && selectedTime);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500">Pick a new date and time to suggest</p>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Close reschedule dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-tight text-slate-500">
              Available Dates
            </p>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              {dateOptions.map((item) => {
                const selected = selectedDateIso === item.iso;

                return (
                  <button
                    key={item.iso}
                    onClick={() => setSelectedDateIso(item.iso)}
                    className={`h-16 w-14 shrink-0 rounded-2xl border text-center transition ${
                      selected
                        ? "border-indigo-700 bg-violet-100"
                        : "border-black/0 bg-slate-100 hover:border-black/10"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase text-slate-500">{item.dayLabel}</p>
                    <p className="text-sm font-bold text-neutral-900">{item.dateLabel}</p>
                    <p className="text-[10px] font-medium text-slate-500">{item.monthLabel}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-tight text-slate-500">
              Available Times
            </p>
            <div className="grid grid-cols-4 gap-2">
              {TIME_OPTIONS.map((time) => {
                const selected = selectedTime === time;

                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`h-14 rounded-xl border text-center transition ${
                      selected
                        ? "border-indigo-700 bg-violet-100"
                        : "border-black/0 bg-slate-100 hover:border-black/10"
                    }`}
                  >
                    
                    <p className="text-xs font-medium text-neutral-900">{time}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="h-11 rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!canSubmit) return;
                onSuggest(selectedDateIso, selectedTime);
              }}
              disabled={!canSubmit}
              className="h-11 rounded-2xl bg-indigo-700 text-sm font-semibold text-white transition enabled:hover:bg-indigo-800 disabled:opacity-40"
            >
              Suggest Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
