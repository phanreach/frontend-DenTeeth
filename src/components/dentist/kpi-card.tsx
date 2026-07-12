import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
 title: string;
 value: string;
 subtitle: string;
 icon: LucideIcon;
 featured?: boolean;
}

export default function KpiCard({
 title,
 value,
 subtitle,
 icon: Icon,
 featured = false,
}: KpiCardProps) {
 return (
 <article
 className={`rounded-2xl border p-5 transition-all hover:shadow-lg ${
 featured
 ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 "
 : "border-border bg-card text-foreground"
 }`}
 >
 <div className="mb-4 flex items-center justify-between">
 <p
 className={`text-[11px] font-semibold uppercase tracking-wider ${
 featured ? "text-white/80" : "text-muted-foreground/60"
 }`}
 >
 {title}
 </p>

 <span
 className={`flex size-10 items-center justify-center rounded-xl transition-transform hover:scale-110 ${
 featured ? "bg-white/20 text-white" : "bg-indigo-600/10 text-indigo-600 "
 }`}
 >
 <Icon className="size-5" />
 </span>
 </div>

 <p
 className={`text-3xl font-semibold tracking-tight ${
 featured ? "text-white" : "text-foreground"
 }`}
 >
 {value}
 </p>

 <div className="mt-3 flex items-center gap-1.5">
 <p className={`text-xs font-semibold ${featured ? "text-white/80" : "text-indigo-600 "}`}>
 {subtitle}
 </p>
 </div>
 </article>
 );
}
