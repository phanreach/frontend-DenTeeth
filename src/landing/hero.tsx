import {
  MoveRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ScanLine,
} from "lucide-react";

const stats = [
  { icon: ShieldCheck, value: "85%+", label: "Detection accuracy" },
  { icon: ScanLine, value: "6", label: "Conditions detected" },
  { icon: Clock, value: "30s", label: "Per scan" },
];

const bars = [
  {
    label: "Cavity Risk",
    width: "w-1/6",
    color: "bg-emerald-400",
    text: "12%",
  },
  { label: "Plaque", width: "w-1/3", color: "bg-amber-400", text: "34%" },
  { label: "Gum Health", width: "w-5/6", color: "bg-blue-500", text: "88%" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#eef3ff] flex items-center">
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative z-10 flex flex-col gap-8">
          <div className="self-start flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-xl text-primary text-xs font-bold tracking-[0.18em] uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Dental Analysis
          </div>

          <div className="flex flex-col gap-4">
            <h1
              className="text-6xl sm:text-7xl font-extrabold leading-[1.02] tracking-tight text-slate-900"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Spot{" "}
              <span className="relative inline-block text-primary">Issues</span>
              <br />
              Before They
              <br />
              Become Pains.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Diagnostic-grade AI screenings in your pocket. Detect cavities,
              plaque, gum disease, and more with{" "}
              <span className="font-semibold text-slate-900">
                85%+ accuracy
              </span>{" "}
              from a single smartphone photo.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="group relative overflow-hidden flex items-center gap-2.5 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm active:translate-y-0 transition-all duration-300">
              <span className="relative flex items-center gap-2.5">
                Get Started Free
                <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 transition-opacity duration-300 cursor-pointer" />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-200/80">
            {stats.map(({ icon: Ico, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Ico className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Glow */}
          <div className="absolute inset-8 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative w-full max-w-[500px]">
            {/* Floating top badge */}
            <div className="absolute -top-5 -left-5 z-20 flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-xl">
              <span className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shrink-0">
                🦷
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  No Cavities Found
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  AI result — healthy ✓
                </p>
              </div>
            </div>

            {/* Main card */}
            <div className="relative rounded-[2rem] overflow-hidden border border-white/80 bg-white shadow-[0_32px_100px_rgba(26,60,255,0.18)]">
              {/* Image */}
              <div className="relative">
                <img
                  src="https://quintessencedental.com/wp-content/uploads/2025/07/Dental-Clinic-Interior-Design-jpg.webp"
                  alt="Modern dental clinic"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {/* Scan line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/70 shadow-[0_0_16px_rgba(59,130,246,0.8)] animate-pulse" />
              </div>

              {/* Analysis panel */}
              <div className="bg-white px-5 pt-5 pb-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Live Analysis
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      Dental Scan Report
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Healthy
                  </span>
                </div>

                {/* Bars */}
                <div className="flex flex-col gap-3">
                  {bars.map(({ label, width, color, text }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs text-slate-500 font-medium">
                        {label}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${width} ${color}`}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-bold text-slate-700">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">
                    View full report →
                  </span>
                </div>
              </div>
            </div>

            {/* Accuracy badge */}
            <div className="absolute -bottom-5 -right-5 z-20 bg-primary text-white rounded-2xl px-6 py-4 shadow-[0_16px_48px_rgba(26,60,255,0.38)]">
              <p className="text-[10px] uppercase tracking-widest opacity-70 font-semibold">
                Accuracy
              </p>
              <p className="text-4xl font-extrabold leading-none mt-0.5">
                85%+
              </p>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -right-[4.5rem] z-20 hidden xl:flex flex-col gap-2 bg-white rounded-2xl border border-slate-100 px-4 py-3.5 shadow-lg">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Tracked
              </p>
              {["Cavities", "Plaque", "Gum"].map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
