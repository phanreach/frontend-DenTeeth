import { AlertCircle, CalendarClock, CheckCircle2 } from "lucide-react";
import type { OverviewCardData } from "../../dentist/constants/dentist-appointments-data";

const kindStyle = {
 next: {
 card: "bg-card border-border hover:border-indigo-600/20",
 iconWrap: "bg-indigo-600/10 text-indigo-600 ",
 label: "text-indigo-600 ",
 },
 action: {
 card: "bg-card border-border hover:border-amber-600/20",
 iconWrap: "bg-amber-600/10 text-amber-600 dark:text-amber-400",
 label: "text-amber-600 dark:text-amber-400",
 },
 week: {
 card: "bg-card border-border hover:border-emerald-600/20",
 iconWrap: "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400",
 label: "text-emerald-600 dark:text-emerald-400",
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
 <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
 {item.title}
 </p>
 <p className="text-2xl font-semibold text-foreground">{item.value}</p>
 </div>
 <span className={`grid size-10 place-items-center rounded-xl transition-transform group-hover:scale-110 ${styles.iconWrap}`}>
 <Icon className="size-5" />
 </span>
 </div>

 <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
 <div>
 {item.subtitle && (
 <p className={`text-xs font-semibold ${styles.label}`}>
 {item.subtitle}
 </p>
 )}
 {item.meta && (
 <p className="mt-0.5 text-[10px] font-medium text-muted-foreground/60">
 {item.meta}
 </p>
 )}
 </div>
 <button className="h-7 cursor-pointer rounded-lg bg-muted px-3 text-[10px] font-semibold text-muted-foreground transition hover:bg-muted/80 active:scale-95">
 View Detail
 </button>
 </div>
 </article>
 );
}
