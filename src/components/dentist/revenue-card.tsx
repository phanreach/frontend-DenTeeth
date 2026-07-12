import { CircleDollarSign } from "lucide-react";

interface RevenueCardProps {
 periodLabel: string;
 revenueLabel: string;
 labels: string[];
 values: number[];
 yTicks: string[];
}

export default function RevenueCard({
 periodLabel,
 revenueLabel,
 labels,
 values,
 yTicks,
}: RevenueCardProps) {
 const max = Math.max(...values, 1);
 const w = 640;
 const h = 160;
 const step = w / Math.max(values.length - 1, 1);

 const points = values.map((value, i) => {
 const x = i * step;
 const y = h - (value / max) * (h - 10);
 return { x, y };
 });

 const linePath = points
 .map((p, i, arr) => {
 if (i === 0) return `M ${p.x} ${p.y}`;
 const prev = arr[i - 1];
 const cx = (prev.x + p.x) / 2;
 return `Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
 })
 .join(" ");

 const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
 const isSinglePoint = labels.length === 1;
 const shouldShowLabel = (index: number) => {
 if (labels.length <= 7) return true;
 if (labels.length <= 12) return index % 2 === 0;
 return index % 3 === 0;
 };

 return (
 <section className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
 <h3 className="text-base font-semibold text-foreground">Estimated Revenue</h3>
 <p className="text-xs font-medium text-muted-foreground">
 {periodLabel} <span className="font-semibold text-indigo-600 ">{revenueLabel}</span>
 </p>

 {labels.length === 0 || values.length === 0 ? (
 <div className="mt-8 flex h-40 flex-col items-center justify-center text-muted-foreground">
 <CircleDollarSign className="size-8 opacity-20 mb-2" />
 <p className="text-xs font-medium">No revenue data available</p>
 </div>
 ) : (
 <div className="mt-8">
 <div className="grid grid-cols-[42px_1fr] gap-4">
 <div className="flex h-40 flex-col justify-between py-1 text-right text-[10px] font-semibold text-muted-foreground/40">
 {yTicks.map((tick) => (
 <span key={tick}>{tick}</span>
 ))}
 </div>

 <div className="relative">
 <div className="absolute inset-0 flex h-40 flex-col justify-between">
 {yTicks.map((tick) => (
 <div key={tick} className="border-t border-dashed border-border" />
 ))}
 </div>

 <svg viewBox={`0 0 ${w} ${h}`} className="relative z-10 h-40 w-full overflow-visible">
 {isSinglePoint ? (
 <circle cx={w / 2} cy={h * 0.38} r={5} fill="white" stroke="#6366f1" strokeWidth={3} />
 ) : (
 <>
 <defs>
 <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
 <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
 </linearGradient>
 </defs>
 <path d={areaPath} fill="url(#revenueGradient)" />
 <path
 d={linePath}
 fill="none"
 stroke="#6366f1"
 strokeWidth="3"
 strokeLinecap="round"
 strokeLinejoin="round"
 className="drop-shadow-[0_4px_6px_rgba(99,102,241,0.3)]"
 />
 </>
 )}
 </svg>

 <div
 className="mt-4 grid text-center text-[10px] font-semibold uppercase tracking-tight text-muted-foreground/60"
 style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
 >
 {labels.map((label, index) => (
 <span key={`${label}-${index}`}>
 {shouldShowLabel(index) ? label : ""}
 </span>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}
 </section>
 );
}
