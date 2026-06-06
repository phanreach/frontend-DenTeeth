import { AlertCircle, CalendarClock, CheckCircle2 } from "lucide-react";
import type { OverviewCardData } from "../../dentist/constants/dentist-appointments-data";

const kindStyle = {
  next: {
    card: "bg-white border-black/5 hover:border-indigo-700/20",
    iconWrap: "bg-indigo-50 text-indigo-700",
    label: "text-indigo-700",
  },
  action: {
    card: "bg-white border-black/5 hover:border-amber-700/20",
    iconWrap: "bg-amber-50 text-amber-700",
    label: "text-amber-700",
  },
  week: {
    card: "bg-white border-black/5 hover:border-emerald-700/20",
    iconWrap: "bg-emerald-50 text-emerald-700",
    label: "text-emerald-700",
  },
} as const;

const kindIcon = {
  next: CalendarClock,
  action: AlertCircle,
  week: CheckCircle2,
} as const;

export default function AppointmentsOverviewCard({ item }: { item: OverviewCardData }) {
  const Icon = kindIcon[item.kind];
  const styles = kindStyle[item.kind];

  return (
    <article
      className={`group cursor-default rounded-2xl border p-5 transition-all hover:shadow-lg hover:shadow-black/5 ${styles.card}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {item.title}
          </p>
          <p className="text-2xl font-black text-neutral-900">{item.value}</p>
        </div>
        <span className={`grid size-10 place-items-center rounded-xl transition-transform group-hover:scale-110 ${styles.iconWrap}`}>
          <Icon className="size-5" />
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
        <div>
          {item.subtitle && (
            <p className={`text-xs font-bold ${styles.label}`}>
              {item.subtitle}
            </p>
          )}
          {item.meta && (
            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              {item.meta}
            </p>
          )}
        </div>
        <button className="h-7 cursor-pointer rounded-lg bg-slate-50 px-3 text-[10px] font-bold text-slate-500 transition hover:bg-slate-100 active:scale-95">
          View Detail
        </button>
      </div>
    </article>
  );
}
