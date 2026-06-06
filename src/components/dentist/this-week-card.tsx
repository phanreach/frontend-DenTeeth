interface ThisWeekCardProps {
  points: number[];
  labels: string[];
  title?: string;
  subtitle?: string;
}

export default function ThisWeekCard({
  points,
  labels,
  title = "This Week",
  subtitle = "Daily patients",
}: ThisWeekCardProps) {
  const max = Math.max(...points, 1);
  const w = Math.max(300, labels.length * 26);
  const h = 90;
  const step = w / Math.max(points.length - 1, 1);

  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - (p / max) * (h - 8);
    return { x, y };
  });

  const linePath = coords
    .map((p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const shouldShowLabel = (index: number) => {
    if (labels.length <= 12) return true;
    if (labels.length <= 24) return index % 2 === 0;
    return index % 3 === 0;
  };

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{subtitle}</p>

      <div className="mt-6 flex gap-3">
        <div className="flex h-24 flex-col justify-between text-xs font-medium text-slate-400">
          <span>8</span>
          <span>4</span>
          <span>0</span>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div style={{ minWidth: `${w}px` }}>
            <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full overflow-visible">
              <path d={areaPath} fill="#4338ca" opacity="0.1" />
              <path
                d={linePath}
                fill="none"
                stroke="#4338ca"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div
              className="mt-3 grid text-center text-[10px] font-medium text-slate-400"
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
