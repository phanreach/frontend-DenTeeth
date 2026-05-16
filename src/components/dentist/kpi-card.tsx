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
      className={`rounded-2xl border p-4 ${
        featured
          ? "border-indigo-700/20 bg-indigo-700 text-white"
          : "border-black/10 bg-white text-slate-900"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p
          className={`text-xs font-medium leading-4 ${
            featured ? "text-white/70" : "text-slate-500"
          }`}
        >
          {title}
        </p>

        <span
          className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
            featured ? "bg-white/20" : "bg-violet-100 text-indigo-700"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p
        className={`text-4xl font-bold leading-8 ${
          featured ? "text-white" : "text-neutral-900"
        }`}
        style={{ fontFamily: "'Fraunces', 'DM Serif Display', Georgia, serif" }}
      >
        {value}
      </p>

      <p className={`mt-2 text-xs leading-4 ${featured ? "text-white/70" : "text-slate-500"}`}>
        {subtitle}
      </p>
    </article>
  );
}
