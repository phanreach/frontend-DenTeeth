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

  const bg = `conic-gradient(#10b981 0 ${c1}%, #f59e0b ${c1}% ${c2}%, #0c63a7 ${c2}% 100%)`;

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4">
      <h3 className="text-sm font-semibold leading-5 text-neutral-900">Status Split</h3>

      <div className="mt-3 flex justify-center">
        <div className="relative h-36 w-36 rounded-full" style={{ background: bg }}>
          <div className="absolute inset-[26px] rounded-full bg-white" />
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
        <p className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Confirmed: {confirmed}
        </p>
        <p className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Pending: {pending}
        </p>
        <p className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-700" /> Completed: {completed}
        </p>
      </div>
    </section>
  );
}
