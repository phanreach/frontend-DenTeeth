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
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm overflow-hidden">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-xs font-medium text-muted-foreground">{subtitle}</p>

      <div className="mt-8 flex gap-4">
        <div className="flex h-24 flex-col justify-between py-1 text-[10px] font-bold text-muted-foreground/40">
          <span>8</span>
          <span>4</span>
          <span>0</span>
        </div>

        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div style={{ minWidth: `${w}px` }}>
            <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full overflow-visible">
              <defs>
                <linearGradient id="weekGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#weekGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_4px_6px_rgba(99,102,241,0.3)]"
              />
            </svg>

            <div
              className="mt-4 grid text-center text-[10px] font-bold uppercase tracking-tight text-muted-foreground/60"
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
    </article>
  );
}
