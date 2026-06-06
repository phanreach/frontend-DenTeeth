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
    <div className="inline-flex rounded-xl bg-slate-100/50 p-1">
      {PERIODS.map((period) => {
        const isActive = value === period.key;

        return (
          <button
            key={period.key}
            onClick={() => onChange(period.key)}
            className={`rounded-lg px-5 py-1.5 text-xs font-bold leading-4 transition-all cursor-pointer ${
              isActive
                ? "bg-indigo-700 text-white shadow-md shadow-indigo-100"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
