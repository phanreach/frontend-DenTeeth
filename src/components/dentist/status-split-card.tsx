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

  const bg = `conic-gradient(#10b981 0 ${c1}%, #f59e0b ${c1}% ${c2}%, #4338ca ${c2}% 100%)`;

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">Status Split</h3>

      <div className="mt-6 flex justify-center">
        <div className="relative h-40 w-40 rounded-full" style={{ background: bg }}>
          <div className="absolute inset-[32px] rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-8 space-y-2 text-sm font-medium text-slate-500">
        <p className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" /> Confirmed: {confirmed}
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500" /> Pending: {pending}
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-700" /> Completed: {completed}
        </p>
      </div>
    </section>
  );
}
