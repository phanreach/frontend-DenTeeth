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
    <section className="rounded-2xl border border-black/10 bg-white p-4">
      <h3 className="text-sm font-semibold leading-5 text-neutral-900">{title}</h3>
      <p className="mt-1 text-xs leading-4 text-slate-500">{subtitle}</p>

      <div className="mt-3 overflow-x-auto">
        <div style={{ minWidth: `${w}px` }}>
          <svg viewBox={`0 0 ${w} ${h + 16}`} className="h-24 w-full">
          <path d={areaPath} fill="#1d4ed8" opacity="0.12" />
          <path
            d={linePath}
            fill="none"
            stroke="#1560ab"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          </svg>
        </div>
      </div>

      <div
        className="mt-1 grid text-center text-[10px] text-slate-500"
        style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
      >
        {labels.map((label, index) => (
          <span key={`${label}-${index}`}>
            {shouldShowLabel(index) ? label : ""}
          </span>
        ))}
      </div>
    </section>
  );
}
