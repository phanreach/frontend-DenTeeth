import type { AnalyticsPeriod } from "../../dentist/constants/dashboard-data";

const PERIODS: { key: AnalyticsPeriod; label: string }[] = [
 { key: "24h", label: "24h" },
 { key: "1w", label: "1w" },
 { key: "1m", label: "1m" },
 { key: "3m", label: "3m" },
 { key: "6m", label: "6m" },
 { key: "1y", label: "1y" },
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
 className={`rounded-xl px-5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
 isActive
 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 "
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
