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
    <div className="inline-flex rounded-2xl bg-muted p-1 border border-border shadow-sm">
      {PERIODS.map((period) => {
        const isActive = value === period.key;

        return (
          <button
            key={period.key}
            onClick={() => onChange(period.key)}
            className={`rounded-xl px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-500"
                : "text-muted-foreground/60 hover:text-foreground hover:bg-card"
            }`}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
