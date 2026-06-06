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
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">Top Conditions</h3>

      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const width = `${(item.count / max) * 100}%`;
          return (
            <div key={item.label} className="grid grid-cols-[100px_1fr_auto] items-center gap-3">
              <p className="truncate text-xs font-medium text-slate-500">{item.label}</p>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-indigo-700" style={{ width }} />
              </div>
              <p className="text-xs font-bold text-slate-900">{item.count}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
