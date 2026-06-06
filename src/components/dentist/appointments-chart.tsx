import type { ChartItem } from "../../dentist/constants/dashboard-data";

interface AppointmentsChartProps {
  title: string;
  subtitle: string;
  items: ChartItem[];
}

export default function AppointmentsChart({
  title,
  subtitle,
  items,
}: AppointmentsChartProps) {
  const max = Math.max(...items.map((item) => item.appointments), 1);
  const step = 4;
  const ticks = [step * 4, step * 3, step * 2, step, 0].map((v) =>
    Math.max(v, Math.round((max / 4) * (v / step))),
  );

  const shouldShowLabel = (index: number) => {
    if (items.length <= 7) return true;
    if (items.length <= 12) return index % 2 === 0;
    return index % 3 === 0;
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>

      <div className="mt-6">
        <div className="grid grid-cols-[30px_1fr] gap-2">
          <div className="flex h-44 flex-col justify-between text-right text-xs text-slate-400">
            {ticks.map((tick, index) => (
              <span key={`${tick}-${index}`}>{tick}</span>
            ))}
          </div>

          <div className="relative h-44">
            <div className="absolute inset-0 flex flex-col justify-between">
              {ticks.map((_, index) => (
                <div key={index} className="border-t border-dashed border-black/5" />
              ))}
            </div>

            <div className="relative z-10 flex h-full items-end gap-1 px-1 sm:gap-2 sm:px-3">
              {items.map((item, index) => {
                const appHeight =
                  item.appointments > 0
                    ? `${Math.max((item.appointments / ticks[0]) * 100, 6)}%`
                    : "6%";
                const treatedHeight =
                  item.treated > 0
                    ? `${Math.max((item.treated / ticks[0]) * 100, 6)}%`
                    : "6%";

                return (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-36 w-full max-w-12 items-end justify-center gap-0.5 sm:gap-1">
                      <div
                        style={{ height: appHeight }}
                        className="w-full max-w-5 rounded-t-sm bg-indigo-700"
                      />
                      <div
                        style={{ height: treatedHeight }}
                        className="w-full max-w-5 rounded-t-sm bg-emerald-500"
                      />
                    </div>
                    <div className="text-[10px] font-medium text-slate-500">
                      {shouldShowLabel(index) ? item.label : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-indigo-700" /> Appointments
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500" /> Treated
        </span>
      </div>
    </section>
  );
}
