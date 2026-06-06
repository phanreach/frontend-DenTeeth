interface StatusSplitCardProps {
  confirmed: number;
  pending: number;
  completed: number;
}

export default function StatusSplitCard({
  confirmed,
  pending,
  completed,
}: StatusSplitCardProps) {
  const total = Math.max(confirmed + pending + completed, 1);
  const c1 = (confirmed / total) * 100;
  const c2 = ((confirmed + pending) / total) * 100;

  const bg = `conic-gradient(#10b981 0 ${c1}%, #f59e0b ${c1}% ${c2}%, #6366f1 ${c2}% 100%)`;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-bold text-foreground">Status Split</h3>

      <div className="mt-8 flex justify-center">
        <div className="relative size-40 rounded-full shadow-inner" style={{ background: bg }}>
          <div className="absolute inset-[32px] rounded-full bg-card shadow-sm" />
        </div>
      </div>

      <div className="mt-8 space-y-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" /> Confirmed
          </p>
          <span className="text-foreground">{confirmed}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/20" /> Pending
          </p>
          <span className="text-foreground">{pending}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 shadow-sm shadow-indigo-600/20" /> Completed
          </p>
          <span className="text-foreground">{completed}</span>
        </div>
      </div>
    </article>
  );
}
