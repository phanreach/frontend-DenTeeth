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
  const minWidth = Math.max(520, labels.length * 34);
  const shouldShowLabel = (index: number) => {
    if (labels.length <= 12) return true;
    if (labels.length <= 24) return index % 2 === 0;
    return index % 3 === 0;
  };

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4">
      <h3 className="text-sm font-semibold leading-5 text-neutral-900">Estimated Revenue</h3>
      <p className="mt-1 text-xs leading-4 text-slate-500">
        {periodLabel} <span className="font-semibold text-neutral-900">{revenueLabel}</span>
      </p>

      <div className="mt-3 overflow-x-auto">
        <div
          className="grid grid-cols-[42px_1fr] gap-2"
          style={{ minWidth: `${minWidth}px` }}
        >
        <div className="flex h-40 flex-col justify-between text-right text-xs text-slate-500">
          {yTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex h-40 flex-col justify-between">
            {yTicks.map((tick) => (
              <div key={tick} className="border-t border-dashed border-black/5" />
            ))}
          </div>

          <svg viewBox={`0 0 ${w} ${h}`} className="relative z-10 h-40 w-full">
            {isSinglePoint ? (
              <circle cx={w / 2} cy={h * 0.38} r={4} fill="white" stroke="#0d9488" strokeWidth={2} />
            ) : (
              <>
                <path d={areaPath} fill="#0d9488" opacity="0.1" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>

          <div
            className="mt-1 grid text-center text-xs text-slate-500"
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
    </section>
  );
}
