import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  featured?: boolean;
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  featured = false,
}: KpiCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 transition-shadow hover:shadow-sm ${
        featured
          ? "border-indigo-700 bg-indigo-700 text-white shadow-lg shadow-indigo-200"
          : "border-black/5 bg-white text-slate-900"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <p
          className={`text-sm font-medium leading-4 ${
            featured ? "text-white/80" : "text-slate-500"
          }`}
        >
          {title}
        </p>

        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            featured ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <p
        className={`text-4xl font-extrabold tracking-tight ${
          featured ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <div className="mt-3 flex items-center gap-1.5">
        <p className={`text-xs font-medium ${featured ? "text-white/80" : "text-slate-500"}`}>
          {subtitle}
        </p>
      </div>
    </article>
  );
}
