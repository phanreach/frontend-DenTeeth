import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

function Footer() {
  const navigation = [
    ["Home", "/"],
    ["AI Scan", "/scan"],
    ["Dentist", "/dentist"],
  ];

  const support = [
    ["Privacy Policy", "#"],
    ["Terms of Service", "#"],
    ["FAQ", "#"],
    ["Contact Us", "#"],
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0f172a] text-slate-300">
      <div className="pointer-events-none absolute -top-32 right-0 h-[350px] w-[350px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div>
                <h3 className="font-serif text-2xl text-white">DenTeeth</h3>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Advanced dental care powered by intelligent technology. We combine
              modern AI diagnostics with compassionate care to create healthier,
              brighter smiles for everyone.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Phone,
                  text: "078 88 63 48",
                },
                {
                  icon: Mail,
                  text: "denteeth@gmail.com",
                },
                {
                  icon: MapPin,
                  text: "Phnom Penh, Cambodia",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon size={16} className="text-primary" />
                  </div>

                  <span className="text-sm text-slate-400">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Accepting new patients
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Navigation
            </h4>

            <ul className="space-y-4">
              {navigation.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span>{label}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Support
            </h4>

            <ul className="space-y-4">
              {support.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span>{label}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© 2026 Denteeth. All rights reserved.</p>

          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "FAQ"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-200 hover:text-slate-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
