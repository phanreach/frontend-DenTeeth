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
      <h3 className="text-base font-bold text-foreground">Top Conditions</h3>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const width = `${(item.count / max) * 100}%`;
          return (
            <div key={item.label} className="grid grid-cols-[100px_1fr_24px] items-center gap-4">
              <p className="truncate text-[11px] font-bold uppercase tracking-tight text-muted-foreground/60">{item.label}</p>
              <div className="h-2 rounded-full bg-muted shadow-inner">
                <div className="h-2 rounded-full bg-indigo-600 dark:bg-indigo-500 shadow-sm shadow-indigo-600/20" style={{ width }} />
              </div>
              <p className="text-xs font-black text-foreground text-right">{item.count}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
