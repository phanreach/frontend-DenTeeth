import type { DateChipData } from "../constants/dentist-appointments-data";

export default function AppointmentsDateChip({ item }: { item: DateChipData }) {
  if (item.dayLabel === "All") {
    return (
      <button className="min-w-20 rounded-2xl border border-black/10 bg-white p-2 text-center">
        <p className="text-sm font-bold text-slate-500">All</p>
        <p className="text-[10px] font-semibold text-slate-500">{item.appointments} appts</p>
      </button>
    );
  }

  return (
    <button
      className={`relative min-w-16 rounded-2xl border p-2 text-center ${
        item.active ? "border-indigo-700 bg-indigo-700" : "border-black/10 bg-white"
      }`}
    >
      {item.hasDot && !item.active ? <span className="absolute right-2 top-2 size-1.5 rounded-full bg-yellow-500" /> : null}
      <p className={`text-[10px] font-semibold uppercase ${item.active ? "text-white/70" : "text-slate-500"}`}>{item.dayLabel}</p>
      <p className={`text-base font-bold ${item.active ? "text-white" : "text-neutral-900"}`}>{item.dayNumber}</p>
      <p className={`text-[10px] font-medium ${item.active ? "text-white/80" : "text-slate-500"}`}>{item.appointments} appts</p>
    </button>
  );
}
