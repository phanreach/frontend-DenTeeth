import { FileText } from "lucide-react";

interface ConditionItem {
 label: string;
 count: number;
}

interface TopConditionsCardProps {
 items: ConditionItem[];
}

export default function TopConditionsCard({ items }: TopConditionsCardProps) {
 const max = Math.max(...items.map((item) => item.count), 1);

 return (
 <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
 <h3 className="text-base font-semibold text-foreground">Top Conditions</h3>

 {items.length === 0 ? (
 <div className="mt-6 flex h-24 flex-col items-center justify-center text-muted-foreground">
 <FileText className="size-8 opacity-20 mb-2" />
 <p className="text-xs font-medium">No conditions recorded</p>
 </div>
 ) : (
 <div className="mt-6 space-y-4">
 {items.map((item) => {
 const width = `${(item.count / max) * 100}%`;
 return (
 <div key={item.label} className="grid grid-cols-[100px_1fr_24px] items-center gap-4">
 <p className="truncate text-[11px] font-semibold uppercase tracking-tight text-muted-foreground/60">{item.label}</p>
 <div className="h-2 rounded-full bg-muted shadow-inner">
 <div className="h-2 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/20" style={{ width }} />
 </div>
 <p className="text-xs font-semibold text-foreground text-right">{item.count}</p>
 </div>
 );
 })}
 </div>
 )}
 </article>
 );
}
