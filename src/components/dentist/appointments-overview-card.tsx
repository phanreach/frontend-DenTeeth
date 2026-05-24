import { AlertTriangle, CalendarClock, Sparkles } from "lucide-react";
import type { OverviewCardData } from "../constants/dentist-appointments-data";

const kindStyle = {
  next: {
    card: "bg-white border-black/10",
    iconWrap: "bg-indigo-700/10 text-indigo-700",
  },
  action: {
    card: "bg-amber-50 border-amber-100",
    iconWrap: "bg-amber-100 text-amber-700",
  },
  week: {
    card: "bg-white border-black/10",
    iconWrap: "bg-violet-100 text-indigo-700",
  },
} as const;

const kindIcon = {
  next: CalendarClock,
  action: AlertTriangle,
  week: Sparkles,
} as const;

export default function AppointmentsOverviewCard({ item }: { item: OverviewCardData }) {
  const Icon = kindIcon[item.kind];
  const styles = kindStyle[item.kind];

  return (
    <article className={`rounded-2xl border p-4 ${styles.card}`}>
      <div className="inline-flex items-center gap-2">
        <span className={`grid size-7 place-items-center rounded-xl ${styles.iconWrap}`}>
          <Icon className="size-4" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-tight text-slate-500">{item.title}</p>
      </div>

      <p className="mt-3 text-xl font-bold text-neutral-900">{item.value}</p>
      {item.subtitle ? <p className="mt-1 text-xs font-medium text-teal-600">{item.subtitle}</p> : null}
      {item.meta ? <p className="mt-2 text-xs text-slate-500">{item.meta}</p> : null}
    </article>
  );
}
