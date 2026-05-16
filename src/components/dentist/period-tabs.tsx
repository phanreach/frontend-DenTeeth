import type { AnalyticsPeriod } from "../../dentist/constants/dashboard-data";

const PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

interface PeriodTabsProps {
  value: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
}

export default function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div className="inline-flex rounded-2xl bg-slate-100 p-1">
      {PERIODS.map((period) => {
        const isActive = value === period.key;

        return (
          <button
            key={period.key}
            onClick={() => onChange(period.key)}
            className={`rounded-xl px-4 py-1.5 text-xs font-semibold leading-4 transition-all ${
              isActive
                ? "bg-indigo-700 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
