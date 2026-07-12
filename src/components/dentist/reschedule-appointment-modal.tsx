import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { RESCHEDULE_TIME_OPTIONS } from "../../dentist/constants/appointment-actions-data";
import type { Appointment } from "../../dentist/types/ui-appointment";

interface RescheduleAppointmentModalProps {
 appointment: Appointment | null;
 anchorDate: Date;
 onClose: () => void;
 onSuggest: (newDateIso: string, hourId: number) => void;
}

interface DateOption {
 iso: string;
 dayLabel: string;
 dateLabel: string;
 monthLabel: string;
}

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
 const [selectedHourId, setSelectedHourId] = useState<number | null>(null);

 if (!appointment) return null;

 const canSubmit = Boolean(selectedDateIso && selectedHourId !== null);

 return (
 <div
 className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
 onClick={onClose}
 >
 <div
 className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
 onClick={(event) => event.stopPropagation()}
 >
 <div className="flex items-center justify-between border-b border-border px-5 py-4">
 <div>
 <h3 className="text-base font-semibold text-foreground">Reschedule Appointment</h3>
 <p className="text-xs text-muted-foreground">Pick a new date and time to suggest</p>
 </div>
 <button
 onClick={onClose}
 className="grid size-8 cursor-pointer place-items-center rounded-xl bg-muted text-muted-foreground transition hover:bg-muted/80"
 aria-label="Close reschedule dialog"
 >
 <X className="size-4" />
 </button>
 </div>

 <div className="space-y-5 p-5">
 <div>
 <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Available Dates
 </p>
 <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
 {dateOptions.map((item) => {
 const selected = selectedDateIso === item.iso;

 return (
 <button
 key={item.iso}
 onClick={() => setSelectedDateIso(item.iso)}
 className={`h-16 w-14 shrink-0 cursor-pointer rounded-2xl border text-center transition ${
 selected
 ? "border-indigo-600 bg-indigo-50 "
 : "border-border bg-muted/30 hover:border-indigo-600/20"
 }`}
 >
 <p className={`text-[10px] font-semibold uppercase ${selected ? "text-indigo-600 " : "text-muted-foreground/60"}`}>{item.dayLabel}</p>
 <p className={`text-sm font-semibold ${selected ? "text-indigo-600 " : "text-foreground"}`}>{item.dateLabel}</p>
 <p className={`text-[10px] font-semibold uppercase ${selected ? "text-indigo-600 " : "text-muted-foreground/60"}`}>{item.monthLabel}</p>
 </button>
 );
 })}
 </div>
 </div>

 <div>
 <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 Available Times
 </p>
 <div className="grid grid-cols-4 gap-2">
 {RESCHEDULE_TIME_OPTIONS.map((item) => {
 const selected = selectedHourId === item.id;

 return (
 <button
 key={item.id}
 onClick={() => setSelectedHourId(item.id)}
 className={`h-12 cursor-pointer rounded-xl border text-center transition flex items-center justify-center ${
 selected
 ? "border-indigo-600 bg-indigo-50 "
 : "border-border bg-muted/30 hover:border-indigo-600/20"
 }`}
 >
 <p className={`text-xs font-semibold ${selected ? "text-indigo-600 " : "text-foreground"}`}>{item.time}</p>
 </button>
 );
 })}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-2 pt-2">
 <button
 onClick={onClose}
 className="h-11 cursor-pointer rounded-xl bg-muted text-sm font-semibold text-muted-foreground transition hover:bg-muted/80 active:scale-95"
 >
 Cancel
 </button>
 <button
 onClick={() => {
 if (!canSubmit) return;
 onSuggest(selectedDateIso, selectedHourId!);
 }}
 disabled={!canSubmit}
 className="h-11 cursor-pointer rounded-xl bg-indigo-600 text-sm font-semibold text-white transition enabled:hover:bg-indigo-600 disabled:opacity-40 active:scale-95 "
 >
 Suggest Time
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
